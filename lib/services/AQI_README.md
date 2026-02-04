# Real-time AQI Data Integration

## Overview
This module fetches real-time National Air Quality Index (AQI) data from the Government of India's Open Government Data (OGD) API and integrates it into the Environment dashboard without changing the UI.

## Features

✅ **Real-time Data Fetching**
- Fetches live AQI data from OGD API (Resource ID: `3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69`)
- Hourly update frequency support
- Automatic fallback to mock data if API is unavailable

✅ **CPCB Health Risk Mapping**
- Implements official Central Pollution Control Board (CPCB) color-coding logic
- Categories: Good, Satisfactory, Moderate, Poor, Very Poor, Severe
- Individual pollutant health status mapping

✅ **Pollutant Extraction**
- PM₂.₅ (Particulate Matter 2.5 micrometers)
- PM₁₀ (Particulate Matter 10 micrometers)
- O₃ (Ozone)
- NO₂ (Nitrogen Dioxide)
- SO₂ (Sulfur Dioxide)
- CO (Carbon Monoxide)

✅ **City Filtering**
- Pre-configured for major cities: Delhi, Mumbai, Jaipur
- Easy to add more cities
- Station-level granularity with city-wide averaging

## File Structure

```
lib/services/
├── aqiFetcher.ts          # TypeScript service (Node.js compatible)
└── aqi_fetcher.py         # Python service (alternative implementation)

app/api/environment/aqi/
└── route.ts               # Next.js API route

components/environment/
└── AQIPollutionChart.tsx  # UI component (unchanged)
```

## Usage

### TypeScript/Node.js (Recommended)

```typescript
import { getCityAverageAQI, fetchRealtimeAQI } from "@/lib/services/aqiFetcher";

// Get average AQI for a city
const data = await getCityAverageAQI("Delhi");
console.log(`AQI: ${data.aqi} (${data.health_status})`);
console.log(`PM2.5: ${data.pollutants.pm2_5.value} μg/m³`);

// Get all monitoring stations
const stations = await fetchRealtimeAQI(["Delhi", "Mumbai", "Jaipur"]);
```

### Python (Alternative)

```python
from lib.services.aqi_fetcher import get_city_average_aqi, fetch_realtime_aqi

# Get average AQI
data = get_city_average_aqi("Delhi")
print(f"AQI: {data['aqi']} ({data['health_status']})")

# Get all stations
stations = fetch_realtime_aqi(cities=["Delhi", "Mumbai", "Jaipur"])
```

## API Endpoints

### GET `/api/environment/aqi`

**Query Parameters:**
- `city` (optional): City name (default: "delhi")
- `realtime` (optional): Enable real-time fetching (default: "true")

**Example:**
```bash
curl "http://localhost:4001/api/environment/aqi?city=jaipur&realtime=true"
```

**Response:**
```json
[
  { "day": "Mon", "aqi": 142 },
  { "day": "Tue", "aqi": 198 },
  { "day": "Wed", "aqi": 175 },
  { "day": "Thu", "aqi": 156 },
  { "day": "Fri", "aqi": 234 },
  { "day": "Sat", "aqi": 312 },
  { "day": "Sun", "aqi": 287 }
]
```

## Health Risk Categories (CPCB)

| AQI Range | Category | Color | Health Impact |
|-----------|----------|-------|---------------|
| 0-50 | Good | Green | Minimal impact |
| 51-100 | Satisfactory | Light Green | Minor breathing discomfort |
| 101-200 | Moderate | Yellow | Breathing discomfort to sensitive |
| 201-300 | Poor | Orange | Breathing discomfort to all |
| 301-400 | Very Poor | Red | Respiratory illness on prolonged exposure |
| 401-500 | Severe | Maroon | Affects healthy people, seriously impacts those with existing diseases |

## Configuration

### API Key Setup

1. Get your OGD API key from: https://data.gov.in/
2. Update in `lib/services/aqiFetcher.ts`:
```typescript
const API_KEY = "YOUR_API_KEY_HERE";
```

3. Or use environment variable:
```bash
OGD_API_KEY=your_key_here
```

## Error Handling

The service automatically:
- Falls back to mock data if API is unavailable
- Logs errors to console
- Returns graceful empty responses
- Continues to show UI without disruption

## Testing

### Test TypeScript Service
```bash
# Run Next.js dev server
npm run dev

# Test API endpoint
curl "http://localhost:4001/api/environment/aqi?city=delhi&realtime=true"
```

### Test Python Service
```bash
cd lib/services
python aqi_fetcher.py
```

## Adding More Cities

Edit `fetchRealtimeAQI` call in `route.ts`:
```typescript
const cities = ["Delhi", "Mumbai", "Jaipur", "Bangalore", "Chennai"];
const data = await fetchRealtimeAQI(cities);
```

## Hourly Updates

The OGD AQI dataset updates hourly. To implement auto-refresh:

```typescript
// In your component
useEffect(() => {
  const interval = setInterval(() => {
    fetchData();
  }, 3600000); // 1 hour
  
  return () => clearInterval(interval);
}, []);
```

## Dependencies

**Node.js/TypeScript:**
- No additional dependencies (uses built-in `fetch`)

**Python (optional):**
```bash
pip install requests
```

## Troubleshooting

**Issue: API returns no data**
- Check your API key is valid
- Verify city names match OGD dataset format
- Check API endpoint is accessible: https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69

**Issue: CORS errors**
- API calls are made server-side (Next.js API routes)
- No CORS issues should occur

**Issue: Slow response**
- Increase timeout in `aqiFetcher.ts`
- Consider caching responses
- Use mock data for development

## Performance Optimization

### Caching
```typescript
// Add caching to reduce API calls
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour

export async function getCachedAQI(city: string) {
  const cached = cache.get(city);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await getCityAverageAQI(city);
  cache.set(city, { data, timestamp: Date.now() });
  return data;
}
```

## License

MIT - Free to use in your news platform

## Support

For issues with the OGD API, contact: data.gov.in support

## Credits

- Data Source: Open Government Data (OGD) Platform India
- CPCB AQI Standards: Central Pollution Control Board
- Built for: Gen-Z News Platform Environment Dashboard
