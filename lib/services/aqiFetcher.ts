/**
 * Real-time AQI Data Service (Node.js/TypeScript version)
 * Fetches National Air Quality Index data from OGD API
 * Resource ID: 3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69
 */

const OGD_API_BASE = "https://api.data.gov.in/resource";
const RESOURCE_ID = "3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69";
// Prefer env keys so we don't ship a hard-coded token
const API_KEY = process.env.OGD_API_KEY || process.env.DATA_GOV_API_KEY || "";

import { calculateAQI } from "./aqiCalculator";

// City alias map to improve matches when stations report slight naming differences
const CITY_ALIASES: Record<string, string[]> = {
  delhi: ["delhi", "new delhi"],
  mumbai: ["mumbai", "bombay"],
  jaipur: ["jaipur"],
  kanpur: ["kanpur", "kanpur nagar"],
  nagpur: ["nagpur", "maharashtra", "pune", "mumbai"],
  amritsar: ["amritsar", "golden temple"],
  mysore: ["mysore", "mysuru", "karnataka", "bangalore", "bengaluru"],
  pune: ["pune", "maharashtra"],
  bangalore: ["bangalore", "bengaluru"],
  bengaluru: ["bengaluru", "bangalore"],
  hyderabad: ["hyderabad"],
  chennai: ["chennai"],
  kolkata: ["kolkata", "calcutta"],
  lucknow: ["lucknow"],
};


// Station to Parent City mapping for OGD API
// Used when a monitoring station is searched as a city (e.g. "Rohini" -> "Delhi")
const STATION_PARENT_CITY: Record<string, string> = {
  "rohini": "Delhi",
  "punjabi bagh": "Delhi",
  "pusa": "Delhi",
  "anand vihar": "Delhi",
  "rk puram": "Delhi",
  "dwarka": "Delhi",
  "mandir marg": "Delhi",
  "lodhi road": "Delhi",
  "shadipur": "Delhi",
  "nsit dwarka": "Delhi",
  "ihbas": "Delhi",
  "nehru nagar": "Delhi",
  "patparganj": "Delhi",
  "ashok vihar": "Delhi",
  "sonia vihar": "Delhi",
  "jahangirpuri": "Delhi",
  "vivek vihar": "Delhi",
  "najafgarh": "Delhi",
  "narela": "Delhi",
  "wazirpur": "Delhi",
  "bawana": "Delhi",
  "khirki extension": "Delhi",
  "mundka": "Delhi",
  "okhla": "Delhi",
  "new delhi": "Delhi",
  "connaught place": "Delhi",
  "bandra": "Mumbai",
  "colaba": "Mumbai",
  "worli": "Mumbai",
  "andheri": "Mumbai",
  "borivali": "Mumbai",
  "sion": "Mumbai",
  "chembur": "Mumbai",
  "malad": "Mumbai",
  "mazgaon": "Mumbai",
  "bkc": "Mumbai",
  "navy nagar": "Mumbai"
};

// Fallback search strategies when specific location is not found
const NEARBY_STATIONS: Record<string, string[]> = {
    "connaught place": ["mandir marg", "pusa", "ito", "major dhyan chand"],
    "rajpath": ["mandir marg", "ito"],
    "india gate": ["ito", "major dhyan chand"],
    "karol bagh": ["pusa", "shadipur"],
    "saket": ["sri aurobindo marg", "sirifort"],
    "defence colony": ["jawaharlal nehru stadium", "lodhi road"]
};

function expandCities(cities: string[]): string[] {
  const expanded = new Set<string>();
  cities.forEach((city) => {
    const key = city.toLowerCase().trim();
    expanded.add(key);
    const aliases = CITY_ALIASES[key];
    if (aliases) {
      aliases.forEach((alias) => expanded.add(alias.toLowerCase()));
    }
  });
  return Array.from(expanded);
}

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

export interface PollutantData {
  value: number;
  status?: string;
}

export interface AQIRecord {
  city: string;
  station: string;
  aqi: number;
  health_status: string;
  pollutants: {
    pm2_5: PollutantData;
    pm10: PollutantData;
    o3: PollutantData;
    no2: PollutantData;
    so2: PollutantData;
    co: PollutantData;
  };
  last_update: string;
  timestamp: string;
}

/**
 * Map AQI value to health risk category based on CPCB color-coding logic.
 * 
 * CPCB AQI Categories:
 * - Good: 0-50 (Green)
 * - Satisfactory: 51-100 (Light Green)
 * - Moderate: 101-200 (Yellow)
 * - Poor: 201-300 (Orange)
 * - Very Poor: 301-400 (Red)
 * - Severe: 401-500 (Maroon)
 */
export function getAQIHealthStatus(aqiValue: number): string {
  if (aqiValue <= 50) return "Good";
  if (aqiValue <= 100) return "Satisfactory";
  if (aqiValue <= 200) return "Moderate";
  if (aqiValue <= 300) return "Poor";
  if (aqiValue <= 400) return "Very Poor";
  return "Severe";
}

/**
 * Get health status for individual pollutants
 */
export function getPollutantHealthStatus(pollutant: string, value: number): string {
  const p = pollutant.toUpperCase();

  // PM2.5 thresholds (μg/m³)
  if (p === "PM2.5") {
    if (value <= 30) return "Good";
    if (value <= 60) return "Satisfactory";
    if (value <= 90) return "Moderate";
    if (value <= 120) return "Poor";
    if (value <= 250) return "Very Poor";
    return "Severe";
  }

  // PM10 thresholds (μg/m³)
  if (p === "PM10") {
    if (value <= 50) return "Good";
    if (value <= 100) return "Satisfactory";
    if (value <= 250) return "Moderate";
    if (value <= 350) return "Poor";
    if (value <= 430) return "Very Poor";
    return "Severe";
  }

  // O3 (Ozone) thresholds (μg/m³)
  if (p === "O3") {
    if (value <= 50) return "Good";
    if (value <= 100) return "Satisfactory";
    if (value <= 168) return "Moderate";
    if (value <= 208) return "Poor";
    if (value <= 748) return "Very Poor";
    return "Severe";
  }

  return "Unknown";
}

/**
 * Fetch real-time National Air Quality Index data from OGD API
 */
export async function fetchRealtimeAQI(
  cities: string[] = ["Jaipur", "Delhi", "Mumbai"],
  limit: number = 500,
  apiKey: string = API_KEY
): Promise<AQIRecord[]> {
  if (!apiKey) {
    console.warn("[AQI Fetcher] Missing OGD API key. Set OGD_API_KEY or DATA_GOV_API_KEY.");
    return [];
  }

  const cityQueries = expandCities(cities);
  const url = `${OGD_API_BASE}/${RESOURCE_ID}`;
  
  const params = new URLSearchParams({
    "api-key": apiKey,
    format: "json",
    limit: limit.toString(),
  });

  // Optimization: If fetching for a single city, filter by it on the server
  // This prevents hitting the limit (default 500) and missing the city's records
  if (cities.length === 1) {
      let filterCity = cities[0];
      const lowerCity = filterCity.toLowerCase().trim();
      
      // Check if the requested "city" is actually a known station (e.g., "Rohini")
      // If so, filter by the parent city (e.g., "Delhi") to ensure we get the records
      if (STATION_PARENT_CITY[lowerCity]) {
          filterCity = STATION_PARENT_CITY[lowerCity];
          console.log(`[AQI Fetcher] Mapped station '${cities[0]}' to parent city '${filterCity}' for API filter`);
      }

      // OGD API uses title case for most cities (e.g. "Amritsar", "Delhi")
      params.append("filters[city]", toTitleCase(filterCity));
      console.log(`[AQI Fetcher] Applied server-side filter for city: ${filterCity}`);
  }

  try {
    console.log("[AQI Fetcher] Fetching AQI data from OGD API...");
    console.log(`[AQI Fetcher] URL: ${url}?${params}`);
    
    const response = await fetch(`${url}?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`[AQI Fetcher] Response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`[AQI Fetcher] Response structure:`, {
      hasRecords: !!data.records,
      recordCount: data.records?.length || 0,
      keys: Object.keys(data)
    });

    if (!data.records || !Array.isArray(data.records)) {
      console.log("[AQI Fetcher] ⚠️ No records found in API response");
      return [];
    }

    const records = data.records;
    console.log(`[AQI Fetcher] ✅ Fetched ${records.length} records from API`);
    
    // Log unique city names to help with debugging
    const uniqueCities = [...new Set(records.map((r: any) => (r.city || r.station || "").trim()))];
    console.log(`[AQI Fetcher] Cities in response:`, uniqueCities.slice(0, 15));

    // Group records by station, as the API returns one row per pollutant
    const stationMap = new Map<string, {
      city: string;
      station: string;
      last_update: string;
      pollutants: Record<string, number>;
    }>();

    for (const record of records) {
      const cityName = (record.city || "").trim();
      const stationName = record.station || "Unknown";
      
      // Filter by city first (optimization)
      const stationLower = stationName.toLowerCase();
      const cityLower = cityName.toLowerCase();
      
      // Check for direct match or station/city match
      let matches = cityQueries.some((target) => {
        const t = target.toLowerCase();
        return cityLower.includes(t) ||
               stationLower.includes(t) ||
               t.includes(cityLower) ||
               t.includes(stationLower);
      });

      // Special handling for Connaught Place / Locations without direct stations
      // If we don't have a direct match, check if this station is a nearby fallback for the requested city
      if (!matches) {
          for (const query of cityQueries) {
            const queryLower = query.toLowerCase();
              const fallbacks = NEARBY_STATIONS[queryLower];
              if (fallbacks) {
                  // Check if current station is one of the fallbacks
                  if (fallbacks.some(fb => stationLower.includes(fb))) {
                      matches = true;
                      // HACK: Rename this record virtually so it appears as the requested location
                      // preventing "No Data" result
                      // Only rename if it's the exact match we wanted
                      break; 
                  }
              }
          }
      }

      if (!matches) continue;

      if (!stationMap.has(stationName)) {
        stationMap.set(stationName, {
          city: cityName,
          station: stationName,
          last_update: record.last_update,
          pollutants: {}
        });
      }

      const entry = stationMap.get(stationName)!;
// Cleanup values
      const pollutantRaw = record.pollutant_id || "";
      const pollutantId = pollutantRaw.trim();
      const avgValue = parseFloat(record.avg_value || "0");
      
      // Debug log for first few records to catch ID mismatches
      if (stationMap.size === 1 && Object.keys(entry.pollutants).length < 2) {
          console.log(`[AQI Debug] Processing: '${pollutantId}' = ${avgValue} for ${stationName}`);
      }

      if (pollutantId && !isNaN(avgValue)) {
        entry.pollutants[pollutantId] = avgValue;
        
        // Normalize common IDs to ensure calculator finds them
        const pUpper = pollutantId.toUpperCase();
        if (pUpper === "PM2.5" || pUpper === "PM25") entry.pollutants["PM2.5"] = avgValue;
        if (pUpper === "PM10") entry.pollutants["PM10"] = avgValue;
        if (pUpper === "NO2") entry.pollutants["NO2"] = avgValue;
        if (pUpper === "SO2") entry.pollutants["SO2"] = avgValue;
        if (pUpper === "CO") entry.pollutants["CO"] = avgValue;
        if (pUpper === "OZONE" || pUpper === "O3") {
            entry.pollutants["OZONE"] = avgValue;
            entry.pollutants["O3"] = avgValue;
        }
      }
    }

    // Convert grouped station data to AQIRecord
    const filteredData: AQIRecord[] = [];

    for (const [stationName, data] of stationMap.entries()) {
      const { city, pollutants, last_update } = data;

      // Calculate AQI from pollutants
      const aqi = calculateAQI(pollutants); // Helper function to compute AQI
      
      if (aqi === 0) {
          console.log(`[AQI Debug] Zero AQI for ${city} - Pollutants:`, JSON.stringify(pollutants));
      }

      const healthStatus = getAQIHealthStatus(aqi);

      // Extract standard pollutants
      const pm25 = pollutants["PM2.5"] || 0;
      const pm10 = pollutants["PM10"] || 0;
      const o3 = pollutants["OZONE"] || pollutants["O3"] || 0;
      const no2 = pollutants["NO2"] || 0;
      const so2 = pollutants["SO2"] || 0;
      const co = pollutants["CO"] || 0;

      filteredData.push({
        city: city,
        station: stationName,
        aqi: aqi,
        health_status: healthStatus,
        pollutants: {
          pm2_5: {
            value: pm25,
            status: getPollutantHealthStatus("PM2.5", pm25),
          },
          pm10: {
            value: pm10,
            status: getPollutantHealthStatus("PM10", pm10),
          },
          o3: {
            value: o3,
            status: getPollutantHealthStatus("O3", o3),
          },
          no2: { value: no2 },
          so2: { value: so2 },
          co: { value: co },
        },
        last_update: last_update || new Date().toISOString(),
        timestamp: new Date().toISOString(),
      });
    }

    console.log(`[AQI Fetcher] ✅ Filtered to ${filteredData.length} records for cities: ${cities.join(", ")}`);
    
    if (filteredData.length > 0) {
      console.log(`[AQI Fetcher] Sample record:`, {
        city: filteredData[0].city,
        aqi: filteredData[0].aqi,
        health_status: filteredData[0].health_status
      });
    }
    
    return filteredData;
  } catch (error) {
    console.error("[AQI Fetcher] ❌ Error fetching AQI data:", error);
    return [];
  }
}

/**
 * Get representative AQI for a specific city from all monitoring stations.
 * Per CPCB guidelines: Use the maximum AQI (worst station) as the city AQI.
 * This ensures we report the most accurate air quality condition.
 */
export async function getCityAverageAQI(city: string, apiKey?: string) {
  console.log(`[AQI Fetcher] Getting AQI for: ${city}`);
  const data = await fetchRealtimeAQI([city], 500, apiKey);

  if (data.length === 0) {
    console.log(`[AQI Fetcher] ⚠️ No stations found for ${city}`);
    return {
      city: city,
      aqi: 0,
      health_status: "No Data",
      station_count: 0,
      pollutants: {},
    };
  }

  // CPCB Standard: Report the MAXIMUM AQI (worst station) as city AQI
  // This gives a more accurate representation of air quality concerns
  const maxAqi = Math.max(...data.map(r => r.aqi));
  
  // For transparency, also calculate averages for pollutant concentrations
  const avgPm25 = data.reduce((sum, r) => sum + r.pollutants.pm2_5.value, 0) / data.length;
  const avgPm10 = data.reduce((sum, r) => sum + r.pollutants.pm10.value, 0) / data.length;
  const avgO3 = data.reduce((sum, r) => sum + r.pollutants.o3.value, 0) / data.length;

  return {
    city: city,
    aqi: Math.round(maxAqi * 10) / 10,
    health_status: getAQIHealthStatus(maxAqi),
    station_count: data.length,
    pollutants: {
      pm2_5: {
        value: Math.round(avgPm25 * 100) / 100,
        status: getPollutantHealthStatus("PM2.5", avgPm25),
      },
      pm10: {
        value: Math.round(avgPm10 * 100) / 100,
        status: getPollutantHealthStatus("PM10", avgPm10),
      },
      o3: {
        value: Math.round(avgO3 * 100) / 100,
        status: getPollutantHealthStatus("O3", avgO3),
      },
    },
    last_update: data[0]?.last_update,
    timestamp: new Date().toISOString(),
  };
}
