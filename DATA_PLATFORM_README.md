# ZINTEL Unified Data Platform

## 🎯 Overview

The ZINTEL Unified Data Platform is a production-grade system that:
- Uses **ONE** Data.gov.in API key to fetch data from **MANY** datasets (15+ included)
- Normalizes inconsistent government data into a unified schema
- Stores everything in MongoDB for fast querying
- Exposes clean internal APIs for the frontend
- Auto-refreshes data every 20 minutes via background worker

## 🏗️ Architecture

```
Data.gov.in (ONE API Key)
        ↓
Data Fetch Engine (15+ datasets)
        ↓
Normalization Layer (unified schema)
        ↓
MongoDB (NormalizedIndicator collection)
        ↓
Internal APIs (/api/data/*)
        ↓
ZINTEL Frontend
```

## 📦 Components

### 1. Dataset Registry
**File:** `config/dataset-registry.json`

Central configuration defining all 15 datasets:
- Population & Migration
- State GDP & Economic Indicators
- Government Finance (Budget, Revenue, Tax)
- Environment (AQI, Water, Waste)
- Healthcare Infrastructure
- Export-Import & Industry

### 2. Data Fetch Engine
**File:** `lib/data-fetch-engine.ts`

Orchestrates the entire data pipeline:
- Fetches data from data.gov.in
- Handles pagination automatically
- Implements retry logic with exponential backoff
- Respects rate limits
- Logs all operations to `DataFetchLog` collection

### 3. Data Normalizer
**File:** `lib/data-normalizer.ts`

Converts raw data into unified `NormalizedIndicator` format:
```typescript
{
  indicatorName: "Population" | "GDP" | "Unemployment Rate" | ...
  value: number
  unit: "persons" | "crores" | "percentage" | ...
  geography: "National" | "State" | "District"
  geographyName: "India" | "Uttar Pradesh" | ...
  period: "2024" | "2024-Q1" | ...
  category: "population" | "economy" | "government" | ...
}
```

### 4. Internal APIs
**Location:** `app/api/data/`

Clean REST APIs for frontend consumption:

#### Population Data
```
GET /api/data/population?state=Uttar Pradesh&year=2024
```

#### Economy Data
```
GET /api/data/economy?indicator=gdp&state=Maharashtra
```

#### Environment Data
```
GET /api/data/environment?indicator=aqi&city=Delhi
```

#### Government Finance
```
GET /api/data/government?indicator=budget&year=2024
```

#### State-Specific Data
```
GET /api/data/state/uttar-pradesh
Returns all indicators for that state, grouped by category
```

#### Manual Refresh Trigger
```
POST /api/data/refresh
Body: { "all": true } or { "datasetId": "population_india" }
```

### 5. Background Worker
**File:** `scripts/data-refresh-worker.ts`

Runs on 20-minute intervals:
- Checks which datasets need refresh
- Fetches updated data
- Updates MongoDB
- Logs success/failure

## 🚀 Setup & Usage

### Step 1: Get Data.gov.in API Key

1. Visit https://data.gov.in/
2. Sign up / Log in
3. Navigate to "API Console"
4. Generate ONE API key
5. Copy the key

### Step 2: Configure Environment

Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Add your API key:
```
DATA_GOV_API_KEY="your-actual-api-key-here"
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Update Database Schema

```bash
npx prisma generate
npx prisma db push
```

This adds the new collections:
- `DatasetRegistry`
- `DataFetchLog`
- `NormalizedIndicator`
- `DataUpdateSchedule`

### Step 5: Run Initial Data Sync

**First time only - populates the database:**

```bash
npm run sync:initial -- --force
```

This will:
- Fetch all 15 datasets from data.gov.in
- Normalize ~10,000+ indicators
- Store in MongoDB
- Takes 10-20 minutes

**Expected output:**
```
📦 Fetching all datasets (15 total)

🚀 Fetching dataset: Population of India - Census Data
   Resource ID: 9ef84268-d588-465a-a308-a864a43d0070
   ...
✅ Successfully processed Population of India
   Records: 542, Indicators: 2,168, Duration: 3200ms

...

📊 Initial Sync Complete
   ✅ Successful: 14
   ❌ Failed: 1
   Total Indicators Created: 12,450
   Duration: 847.23 seconds
```

### Step 6: Start Development Server

```bash
npm run dev
```

Server starts on http://localhost:3000

### Step 7: Start Background Worker (Optional)

In a separate terminal:

```bash
npm run worker
```

This runs the 20-minute refresh cycle:
```
🚀 ZINTEL Data Platform Worker Starting...
   Refresh Interval: 20 minutes
   
🔄 Data Refresh Cycle Started - 2026-01-03T17:00:00Z
📥 Fetching datasets due for refresh (3 found)
...
✅ Worker is running. Press Ctrl+C to stop.
```

## 📡 API Usage Examples

### Frontend Data Fetching

#### Population Page
```typescript
// app/population/page.tsx
const response = await fetch('/api/data/population?state=all');
const { data, lastUpdated } = await response.json();

data.forEach(indicator => {
  console.log(`${indicator.indicator}: ${indicator.value} ${indicator.unit}`);
  // "Population: 1,400,000,000 persons"
});
```

#### Economy Dashboard
```typescript
const gdpData = await fetch('/api/data/economy?indicator=gdp');
const unemploymentData = await fetch('/api/data/economy?indicator=unemployment');
```

#### State Profile Page
```typescript
const stateData = await fetch('/api/data/state/uttar-pradesh');
const { data } = await stateData.json();

// data.population = [{ indicator: "Population", value: 240000000, ... }]
// data.economy = [{ indicator: "GDP", value: 25000, ... }]
// data.environment = [{ indicator: "AQI", value: 152, ... }]
```

## 🔧 Troubleshooting

### No Data Appearing

**Check if initial sync completed:**
```bash
npm run sync:initial -- --force
```

**Verify API key:**
```env
DATA_GOV_API_KEY should be set in .env
```

### API Errors (HTTP 401)

**Invalid or missing API key from data.gov.in**
- Verify key is correct
- Check key hasn't expired
- Try generating a new key

### Worker Not Refreshing

**Check interval setting:**
```env
DATA_REFRESH_INTERVAL="20"  # minutes
```

**Manually trigger refresh:**
```bash
curl -X POST http://localhost:3000/api/data/refresh \
  -H "Content-Type: application/json" \
  -d '{"all": true}'
```

### Slow Initial Sync

**Normal behavior:**
- 15 datasets × ~500 records each = ~7,500+ raw records
- Normalizes to ~12,000+ indicators
- Includes pagination + rate limiting delays
- Expected time: 10-20 minutes

**To speed up (not recommended for production):**
- Reduce datasets in `config/dataset-registry.json`
- Or comment out `await this.delay(1000)` in fetch engine

## 🗄️ Database Schema

### NormalizedIndicator Collection

Stores all government data in unified format:

| Field | Type | Example |
|-------|------|---------|
| indicatorName | String | "Population" |
| value | Number | 1400000000 |
| unit | String | "persons" |
| geography | Enum | "National" / "State" / "District" |
| geographyName | String | "India" |
| period | String | "2024" |
| periodType | Enum | "year" / "quarter" / "month" |
| sourceDataset | String | "population_india" |
| category | String | "population" |
| lastUpdated | DateTime | 2026-01-03T22:30:00Z |

**Indexed on:**
- `category + geographyName`
- `indicatorName + geographyName + period`

### DataFetchLog Collection

Tracks all fetch operations:
- Status (success/failed)
- Records fetched
- Duration
- Error messages

### DatasetRegistry Collection

Stores metadata for each dataset:
- Resource ID
- Category
- Refresh interval
- Last fetched time

## 📊 Monitoring & Logs

### Check Fetch Logs

Use Prisma Studio:
```bash
npx prisma studio
```

Navigate to `DataFetchLog` to see:
- Which datasets succeeded/failed
- How many records fetched
- Error messages

### Worker Logs

Console output shows:
```
===========================================
🔄 Data Refresh Cycle Started
===========================================
📥 Fetching dataset: Population of India
   Fetched 100 records (offset: 0, total: 542)
   Fetched 100 records (offset: 100, total: 542)
   ...
✅ Completed fetching 542 total records
✅ Normalized 2,168 indicators
   
📊 Refresh Cycle Summary
   ✅ Successful: 14
   ❌ Failed: 1
   Records Fetched: 7,234
   Indicators Created: 12,450
===========================================
```

## 🔐 Security Best Practices

1. **Never commit `.env`** - API key must stay secret
2. **Use environment variables** in production (Vercel, AWS, etc.)
3. **Rate limiting** - Already implemented in fetch engine
4. **Input validation** - All API endpoints validate parameters
5. **Error handling** - Never expose internal errors to frontend

## 🚢 Deployment

### Vercel (Recommended for Next.js)

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

**For background worker on Vercel:**
Use Vercel Cron Jobs:
```javascript
// vercel.json
{
  "crons": [{
    "path": "/api/data/refresh",
    "schedule": "*/20 * * * *"
  }]
}
```

### AWS / Custom Server

1. Deploy Next.js app as usual
2. Run worker as separate process:
   ```bash
   pm2 start "npm run worker" --name zintel-worker
   ```

## 📈 Future Enhancements

- [ ] Redis caching for sub-200ms API responses
- [ ] GraphQL endpoint for complex queries
- [ ] Real-time WebSocket updates
- [ ] AI-generated insights from trends
- [ ] Historical trend analysis
- [ ] Data quality scoring
- [ ] Multi-language support (Hindi translations)

## 🆘 Support

**Data.gov.in Issues:**
- API Documentation: https://data.gov.in/apis
- Support: https://data.gov.in/contact

**ZINTEL Platform:**
- Check logs in `npx prisma studio`
- Review `DataFetchLog` for errors
- Test API manually with curl or Postman

---

**Built with ❤️ for transparent, data-driven governance**
