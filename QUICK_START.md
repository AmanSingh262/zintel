# ZINTEL Data Platform - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Your Data.gov.in API Key

1. Visit: https://data.gov.in/
2. Click "Sign Up" or "Login"
3. Go to "API Console" or "My Profile"
4. Generate an API key
5. Copy the key (looks like: `579b464db66ec23bdd0000016da52937e18f446a4c8d67cd1fbc0e15`)

### Step 2: Configure Environment

```bash
# Create .env file
cp .env.example .env
```

Edit `.env` and add your API key:
```bash
DATA_GOV_API_KEY="paste-your-key-here"
DATABASE_URL="mongodb://localhost:27017/zintel"
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Setup Database

```bash
npx prisma generate
npx prisma db push
```

### Step 5: Run Initial Data Sync (ONE TIME ONLY)

**This fetches all 15 datasets and populates MongoDB:**

```bash
npm run sync:initial -- --force
```

⏱️ Takes 10-20 minutes. You'll see output like:
```
🚀 ZINTEL Data Platform - Initial Data Sync
📦 Fetching all datasets (15 total)

🚀 Fetching dataset: Population of India
   ✅ Successfully processed
   
... (14 more datasets)

📊 Initial Sync Complete
   ✅ Successful: 14
   Total Indicators Created: 12,450 ✨
```

### Step 6: Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### Step 7: Test the APIs

**Check population data:**
```bash
curl http://localhost:3000/api/data/population?state=Uttar Pradesh
```

**Check economy data:**
```bash
curl http://localhost:3000/api/data/economy?indicator=gdp
```

**Check state data:**
```bash
curl http://localhost:3000/api/data/state/maharashtra
```

### Step 8: Start Background Worker (Optional)

In a **new terminal**:

```bash
npm run worker
```

This auto-refreshes data every 20 minutes.

---

## 🎉 That's It!

You now have:
- ✅ 15 datasets from data.gov.in
- ✅ ~12,000+ normalized indicators in MongoDB
- ✅ 6 clean REST APIs
- ✅ Auto-refresh every 20 minutes

## 📋 API Endpoints Cheat Sheet

| Endpoint | Query Params | Example |
|----------|--------------|---------|
| `/api/data/population` | `?state=...&year=...` | `/api/data/population?state=Delhi` |
| `/api/data/economy` | `?indicator=gdp\|unemployment\|income` | `/api/data/economy?indicator=gdp` |
| `/api/data/environment` | `?indicator=aqi\|water\|waste&city=...` | `/api/data/environment?indicator=aqi&city=Delhi` |
| `/api/data/government` | `?indicator=budget\|revenue&year=...` | `/api/data/government?indicator=budget` |
| `/api/data/state/[state]` | - | `/api/data/state/uttar-pradesh` |
| `/api/data/refresh` | POST `{"all": true}` | Manual refresh trigger |

## 🔧 Common Issues

**"Connection refused" for MongoDB:**
```bash
# Install MongoDB locally:
# Windows: https://www.mongodb.com/try/download/community
# Or use MongoDB Atlas (cloud): https://cloud.mongodb.com

# Update .env:
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/zintel"
```

**"API key invalid":**
- Double-check you copied the full key from data.gov.in
- No extra spaces or quotes
- Verify key is active in your data.gov.in dashboard

**"No data returned":**
- Run initial sync first: `npm run sync:initial -- --force`
- Check `DataFetchLog` in Prisma Studio: `npx prisma studio`

**TypeScript/lint errors:**
- Run: `npm install` again
- Run: `npx prisma generate`

## 📚 Next Steps

1. **Customize datasets:** Edit `config/dataset-registry.json`
2. **Update frontend:** Use new APIs in your pages
3. **Deploy:** Push to Vercel or your hosting platform
4. **Monitor:** Check logs in Prisma Studio

## 📖 Full Documentation

See `DATA_PLATFORM_README.md` for comprehensive docs.

---

**Need help?** Check the troubleshooting section in `DATA_PLATFORM_README.md`
