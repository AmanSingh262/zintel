# Testing Real-Time AQI Data

## Quick Test Steps

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test the API Endpoint
Open your browser or use curl:

**Test Endpoint:**
```
http://localhost:4001/api/environment/aqi/test
```

This will show:
- ✅ If OGD API is accessible
- Number of records fetched
- Sample AQI data for Delhi, Mumbai, Jaipur

### 3. Check the Main AQI Endpoint
```
http://localhost:4001/api/environment/aqi?city=jaipur&realtime=true
```

### 4. Check Browser Console
Open DevTools (F12) and look for logs:
- `[AQI Fetcher]` - Shows OGD API calls
- `[AQI API]` - Shows API route processing
- `✅` Success markers
- `❌` Error markers

## Expected Behavior

### If Real-Time Data Works:
- Console shows: `✅ Real-time AQI for {city}: {number}`
- Chart displays varying AQI values based on real data
- Last update shows current date/time

### If Falling Back to Mock Data:
- Console shows: `⚠️ [AQI API] Using mock data`
- Chart shows static pattern (142, 198, 175, 156, 234, 312, 287)
- Reason will be logged in console

## Common Issues & Solutions

### Issue: "No records found in API response"
**Cause:** OGD API returned empty data or wrong structure
**Solution:** 
- Check API key is valid
- Verify OGD API is online: https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69
- Check city name spelling matches OGD dataset

### Issue: "HTTP error! status: 401"
**Cause:** Invalid or missing API key
**Solution:** 
- Update API key in `lib/services/aqiFetcher.ts`
- Get new key from: https://data.gov.in/

### Issue: "HTTP error! status: 429"
**Cause:** Too many API requests (rate limit)
**Solution:** 
- Wait a few minutes
- Implement caching (see AQI_README.md)
- Reduce request frequency

### Issue: Still showing mock data
**Cause:** Real-time fetch failed silently
**Solution:**
1. Check browser console for error messages
2. Run test endpoint: `/api/environment/aqi/test`
3. Verify network tab shows API call to OGD
4. Check if `realtime=true` parameter is in URL

## Debugging Commands

### View Terminal Logs
Watch the terminal where `npm run dev` is running:
```bash
[AQI Fetcher] Fetching AQI data from OGD API...
[AQI Fetcher] URL: https://api.data.gov.in/resource/...
[AQI Fetcher] Response status: 200
[AQI Fetcher] ✅ Fetched 47 records from API
[AQI Fetcher] ✅ Filtered to 12 records for cities: Delhi, Mumbai, Jaipur
✅ Real-time AQI for jaipur: 156 (Moderate)
```

### Test with Curl
```bash
# Test main endpoint
curl "http://localhost:4001/api/environment/aqi?city=delhi&realtime=true"

# Test diagnostics
curl "http://localhost:4001/api/environment/aqi/test"
```

### Browser DevTools
1. Open F12
2. Go to Network tab
3. Reload page
4. Look for request to `/api/environment/aqi`
5. Check Response tab for data

## Verifying Real Data

Real-time data should show:
- ✅ Different AQI values each hour
- ✅ Values that change with city selection
- ✅ Realistic patterns (not identical to mock data)
- ✅ Current timestamp in console logs

Mock data always shows:
- ❌ Same values: 142, 198, 175, 156, 234, 312, 287
- ❌ Never changes between refreshes
- ❌ Same for all cities

## Force Refresh Real-Time Data

Add this to your component for manual refresh:
```typescript
// In AQIPollutionChart.tsx
const refreshData = () => {
  setLoading(true);
  fetchData();
};

// Add button
<button onClick={refreshData}>🔄 Refresh AQI</button>
```

## API Key Setup

Current API key is a demo key. For production:

1. Register at: https://data.gov.in/
2. Get your API key
3. Update in `lib/services/aqiFetcher.ts`:
```typescript
const API_KEY = "YOUR_ACTUAL_API_KEY_HERE";
```

4. Or use environment variable:
```bash
# .env.local
OGD_API_KEY=your_key_here
```

Then update code:
```typescript
const API_KEY = process.env.OGD_API_KEY || "fallback_key";
```

## Success Indicators

When everything works correctly:

Terminal shows:
```
[AQI Fetcher] ✅ Fetched 47 records from API
✅ Real-time AQI for delhi: 234 (Poor)
   Stations: 15
   PM2.5: 156.7
```

Browser shows:
- Chart with dynamic values
- AQI badge with current number
- "Updated: 2/1/2026" (today's date)

Console Network tab shows:
- 200 OK response from API
- JSON with 7 days of data
- Last value matches current AQI

## Still Not Working?

1. **Check if OGD API is online:**
   ```bash
   curl "https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=1"
   ```

2. **Verify Next.js can make external requests:**
   - Check firewall settings
   - Check proxy configuration
   - Try fetch from different API

3. **Enable verbose logging:**
   Set in route.ts:
   ```typescript
   const DEBUG = true;
   if (DEBUG) console.log(...);
   ```

4. **Contact for help:**
   - Share terminal logs
   - Share browser console errors
   - Share test endpoint response
