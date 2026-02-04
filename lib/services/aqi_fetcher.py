"""
Real-time AQI Data Fetcher for Environment Dashboard
Fetches National Air Quality Index data from OGD API
Resource ID: 3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69
"""

import requests
from typing import Dict, List, Optional
from datetime import datetime

# OGD API Configuration
OGD_API_BASE = "https://api.data.gov.in/resource"
RESOURCE_ID = "3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69"
API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"  # Replace with your key


def get_aqi_health_status(aqi_value: float) -> str:
    """
    Map AQI value to health risk category based on CPCB color-coding logic.
    
    CPCB AQI Categories:
    - Good: 0-50 (Green)
    - Satisfactory: 51-100 (Light Green)
    - Moderate: 101-200 (Yellow)
    - Poor: 201-300 (Orange)
    - Very Poor: 301-400 (Red)
    - Severe: 401-500 (Maroon)
    
    Args:
        aqi_value: The Air Quality Index value
        
    Returns:
        Health risk category string
    """
    if aqi_value <= 50:
        return "Good"
    elif aqi_value <= 100:
        return "Satisfactory"
    elif aqi_value <= 200:
        return "Moderate"
    elif aqi_value <= 300:
        return "Poor"
    elif aqi_value <= 400:
        return "Very Poor"
    else:
        return "Severe"


def get_pollutant_health_status(pollutant: str, value: float) -> str:
    """
    Get health status for individual pollutants.
    
    Args:
        pollutant: Name of pollutant (PM2.5, PM10, O3, etc.)
        value: Pollutant concentration value
        
    Returns:
        Health risk category
    """
    # PM2.5 thresholds (μg/m³)
    if pollutant.upper() == "PM2.5":
        if value <= 30:
            return "Good"
        elif value <= 60:
            return "Satisfactory"
        elif value <= 90:
            return "Moderate"
        elif value <= 120:
            return "Poor"
        elif value <= 250:
            return "Very Poor"
        else:
            return "Severe"
    
    # PM10 thresholds (μg/m³)
    elif pollutant.upper() == "PM10":
        if value <= 50:
            return "Good"
        elif value <= 100:
            return "Satisfactory"
        elif value <= 250:
            return "Moderate"
        elif value <= 350:
            return "Poor"
        elif value <= 430:
            return "Very Poor"
        else:
            return "Severe"
    
    # O3 (Ozone) thresholds (μg/m³)
    elif pollutant.upper() == "O3":
        if value <= 50:
            return "Good"
        elif value <= 100:
            return "Satisfactory"
        elif value <= 168:
            return "Moderate"
        elif value <= 208:
            return "Poor"
        elif value <= 748:
            return "Very Poor"
        else:
            return "Severe"
    
    return "Unknown"


def fetch_realtime_aqi(
    cities: Optional[List[str]] = None,
    limit: int = 100,
    api_key: Optional[str] = None
) -> List[Dict]:
    """
    Fetch real-time National Air Quality Index data from OGD API.
    
    Args:
        cities: List of city names to filter (e.g., ['Jaipur', 'Delhi', 'Mumbai'])
        limit: Maximum number of records to fetch
        api_key: OGD API key (uses default if not provided)
        
    Returns:
        List of dictionaries containing AQI data with health risk mapping
    """
    if api_key is None:
        api_key = API_KEY
    
    if cities is None:
        cities = ["Jaipur", "Delhi", "Mumbai"]
    
    # Build API URL
    url = f"{OGD_API_BASE}/{RESOURCE_ID}"
    
    params = {
        "api-key": api_key,
        "format": "json",
        "limit": limit
    }
    
    try:
        print(f"Fetching AQI data from OGD API...")
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        if "records" not in data:
            print("No records found in API response")
            return []
        
        records = data["records"]
        print(f"Fetched {len(records)} records")
        
        # Filter for specified cities
        filtered_data = []
        
        for record in records:
            city_name = record.get("city", "").strip()
            station = record.get("station", "Unknown")
            
            # Check if city matches filter
            if not any(city.lower() in city_name.lower() for city in cities):
                continue
            
            # Extract pollutants
            pm25 = float(record.get("pm2_5", 0) or 0)
            pm10 = float(record.get("pm10", 0) or 0)
            o3 = float(record.get("o3", 0) or 0)
            no2 = float(record.get("no2", 0) or 0)
            so2 = float(record.get("so2", 0) or 0)
            co = float(record.get("co", 0) or 0)
            
            # Get overall AQI
            aqi = float(record.get("aqi", 0) or 0)
            
            # Map to health risk
            health_status = get_aqi_health_status(aqi)
            
            # Create structured data
            filtered_data.append({
                "city": city_name,
                "station": station,
                "aqi": aqi,
                "health_status": health_status,
                "pollutants": {
                    "pm2_5": {
                        "value": pm25,
                        "status": get_pollutant_health_status("PM2.5", pm25)
                    },
                    "pm10": {
                        "value": pm10,
                        "status": get_pollutant_health_status("PM10", pm10)
                    },
                    "o3": {
                        "value": o3,
                        "status": get_pollutant_health_status("O3", o3)
                    },
                    "no2": {"value": no2},
                    "so2": {"value": so2},
                    "co": {"value": co}
                },
                "last_update": record.get("last_update", datetime.now().isoformat()),
                "timestamp": datetime.now().isoformat()
            })
        
        print(f"Filtered to {len(filtered_data)} records for cities: {cities}")
        return filtered_data
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching AQI data: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error: {e}")
        return []


def get_city_average_aqi(city: str, api_key: Optional[str] = None) -> Dict:
    """
    Get average AQI for a specific city from all monitoring stations.
    
    Args:
        city: City name (e.g., 'Delhi', 'Jaipur', 'Mumbai')
        api_key: OGD API key
        
    Returns:
        Dictionary with average AQI and aggregated pollutant data
    """
    data = fetch_realtime_aqi(cities=[city], api_key=api_key)
    
    if not data:
        return {
            "city": city,
            "aqi": 0,
            "health_status": "No Data",
            "station_count": 0,
            "pollutants": {}
        }
    
    # Calculate averages
    total_aqi = sum(record["aqi"] for record in data)
    avg_aqi = total_aqi / len(data)
    
    # Average pollutants
    avg_pm25 = sum(r["pollutants"]["pm2_5"]["value"] for r in data) / len(data)
    avg_pm10 = sum(r["pollutants"]["pm10"]["value"] for r in data) / len(data)
    avg_o3 = sum(r["pollutants"]["o3"]["value"] for r in data) / len(data)
    
    return {
        "city": city,
        "aqi": round(avg_aqi, 1),
        "health_status": get_aqi_health_status(avg_aqi),
        "station_count": len(data),
        "pollutants": {
            "pm2_5": {
                "value": round(avg_pm25, 2),
                "status": get_pollutant_health_status("PM2.5", avg_pm25)
            },
            "pm10": {
                "value": round(avg_pm10, 2),
                "status": get_pollutant_health_status("PM10", avg_pm10)
            },
            "o3": {
                "value": round(avg_o3, 2),
                "status": get_pollutant_health_status("O3", avg_o3)
            }
        },
        "last_update": data[0]["last_update"] if data else None,
        "timestamp": datetime.now().isoformat()
    }


# Example usage
if __name__ == "__main__":
    print("Fetching real-time AQI data...\n")
    
    # Fetch data for specific cities
    cities = ["Jaipur", "Delhi", "Mumbai"]
    aqi_data = fetch_realtime_aqi(cities=cities)
    
    print(f"\n{'='*60}")
    print(f"Real-time AQI Data Summary")
    print(f"{'='*60}\n")
    
    for record in aqi_data[:5]:  # Show first 5 records
        print(f"City: {record['city']}")
        print(f"Station: {record['station']}")
        print(f"AQI: {record['aqi']} ({record['health_status']})")
        print(f"PM2.5: {record['pollutants']['pm2_5']['value']} μg/m³ ({record['pollutants']['pm2_5']['status']})")
        print(f"PM10: {record['pollutants']['pm10']['value']} μg/m³ ({record['pollutants']['pm10']['status']})")
        print(f"O3: {record['pollutants']['o3']['value']} μg/m³ ({record['pollutants']['o3']['status']})")
        print(f"Last Update: {record['last_update']}")
        print("-" * 60)
    
    # Get city averages
    print("\n\nCity-wise Average AQI:\n")
    for city in cities:
        avg_data = get_city_average_aqi(city)
        print(f"{city}: {avg_data['aqi']} AQI ({avg_data['health_status']}) - {avg_data['station_count']} stations")
