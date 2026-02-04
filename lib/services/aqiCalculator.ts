// Temporary file to compute AQI from concentrations
// Source: CPCB Guidelines for AQI
// This avoids shipping 500 lines of complex logic in the chat request.

const ENABLE_DEBUG_LOGGING = false; // Set to true to see detailed calculation logs

export function calculateAQI(pollutants: { [key: string]: number }): number {
    const subIndices: Array<{pollutant: string, value: number, aqi: number}> = [];
    
    // PM2.5 (24-hr avg)
    if (pollutants["PM2.5"] !== undefined) {
        const aqi = getPM25SubIndex(pollutants["PM2.5"]);
        subIndices.push({pollutant: "PM2.5", value: pollutants["PM2.5"], aqi});
    }
    
    // PM10 (24-hr avg)
    if (pollutants["PM10"] !== undefined) {
        const aqi = getPM10SubIndex(pollutants["PM10"]);
        subIndices.push({pollutant: "PM10", value: pollutants["PM10"], aqi});
    }
    
    // NO2 (24-hr avg)
    if (pollutants["NO2"] !== undefined) {
        const aqi = getNO2SubIndex(pollutants["NO2"]);
        subIndices.push({pollutant: "NO2", value: pollutants["NO2"], aqi});
    }
    
    // O3 (8-hr max - assuming avg_value approximates this or 1-hr)
    if (pollutants["OZONE"] !== undefined || pollutants["O3"] !== undefined) {
         const val = pollutants["OZONE"] || pollutants["O3"];
         const aqi = getO3SubIndex(val);
         subIndices.push({pollutant: "O3/OZONE", value: val, aqi});
    }

    if (subIndices.length === 0) return 0;
    
    const maxAqi = Math.max(...subIndices.map(s => s.aqi));
    
    if (ENABLE_DEBUG_LOGGING && maxAqi > 0) {
        console.log("[AQI Calculation Debug]");
        subIndices.forEach(s => {
            console.log(`  ${s.pollutant}: ${s.value} μg/m³ → AQI ${s.aqi}`);
        });
        console.log(`  Final AQI (max): ${maxAqi}`);
    }
    
    return maxAqi;
}

function getPM25SubIndex(conc: number): number {
    if (conc <= 30) return linear(0, 50, 0, 30, conc);
    if (conc <= 60) return linear(51, 100, 31, 60, conc);
    if (conc <= 90) return linear(101, 200, 61, 90, conc);
    if (conc <= 120) return linear(201, 300, 91, 120, conc);
    if (conc <= 250) return linear(301, 400, 121, 250, conc);
    return linear(401, 500, 251, 380, conc); // Cap at 500 usually
}

function getPM10SubIndex(conc: number): number {
    if (conc <= 50) return linear(0, 50, 0, 50, conc);
    if (conc <= 100) return linear(51, 100, 51, 100, conc);
    if (conc <= 250) return linear(101, 200, 101, 250, conc);
    if (conc <= 350) return linear(201, 300, 251, 350, conc);
    if (conc <= 430) return linear(301, 400, 351, 430, conc);
    return linear(401, 500, 431, 550, conc);
}

function getNO2SubIndex(conc: number): number {
    if (conc <= 40) return linear(0, 50, 0, 40, conc);
    if (conc <= 80) return linear(51, 100, 41, 80, conc);
    if (conc <= 180) return linear(101, 200, 81, 180, conc);
    if (conc <= 280) return linear(201, 300, 181, 280, conc);
    if (conc <= 400) return linear(301, 400, 281, 400, conc);
    return linear(401, 500, 401, 500, conc);
}

function getO3SubIndex(conc: number): number { 
    if (conc <= 50) return linear(0, 50, 0, 50, conc);
    if (conc <= 100) return linear(51, 100, 51, 100, conc);
    if (conc <= 168) return linear(101, 200, 101, 168, conc);
    if (conc <= 208) return linear(201, 300, 169, 208, conc);
    if (conc <= 748) return linear(301, 400, 209, 748, conc); // High range varies
    return 500;
}

function linear(Ihi: number, Ilo: number, Bhi: number, Blo: number, Cp: number): number {
    return Math.round(((Ihi - Ilo) / (Bhi - Blo)) * (Cp - Blo) + Ilo);
}
