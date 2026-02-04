# Zintel Deployment Quick Start

## ⚡ Fast Track Deployment (10 minutes)

### Step 1: Update GitHub Repository (1 min)
```bash
cd "c:\Users\Asquare\Downloads\Zintel Website"
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Login to Render (1 min)
1. Go to: https://dashboard.render.com
2. Sign up with GitHub
3. Authorize Render

### Step 3: Deploy Services (8 min)

#### A. Deploy Frontend (3 min)
1. Click **New +** → **Web Service**
2. Select **zintel** repo
3. Settings:
   - Name: `zintel-frontend`
   - Environment: **Node**
   - Build: `npm install && npm run build`
   - Start: `npm start`
4. Add Environment Variables (copy from .env.local)
5. Click **Create Web Service**

#### B. Deploy LLM Backend (2 min)
1. Click **New +** → **Web Service**
2. Select **zintel** repo
3. Settings:
   - Name: `zintel-llm-backend`
   - Root: `llm model`
   - Environment: **Python 3**
   - Build: `pip install -r requirements.txt`
   - Start: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Click **Create Web Service**

#### C. Deploy Gov Finance API (2 min)
1. Click **New +** → **Web Service**
2. Select **zintel** repo
3. Settings:
   - Name: `zintel-gov-finance`
   - Environment: **Python 3**
   - Build: `pip install fastapi uvicorn requests python-dateutil`
   - Start: `uvicorn government_finance_server:app --host 0.0.0.0 --port $PORT`
4. Click **Create Web Service**

### Step 4: Update Frontend URLs (1 min)
Once backends are deployed:
1. Go to frontend service → Environment
2. Update:
   ```
   LLM_BACKEND_URL=https://zintel-llm-backend.onrender.com
   GOV_FINANCE_BACKEND_URL=https://zintel-gov-finance.onrender.com
   ```
3. Save (auto-redeploys)

### Step 5: Test Your Deployment ✅
Visit: `https://zintel-frontend.onrender.com`

---

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] .env variables noted down
- [ ] Supabase database running
- [ ] Data.gov.in API key ready

## ⚠️ Common Issues

**Build Fails?**
- Check build logs
- Verify package.json has all dependencies

**Service Won't Start?**
- Ensure `$PORT` variable is used in start command
- Check runtime logs

**Frontend Can't Connect to Backend?**
- Verify backend URLs in environment variables
- Wait for all services to finish deploying

## 💡 Tips

- Free tier services sleep after 15 min inactivity
- First request after sleep takes ~30-60 seconds
- Use Render.yaml for automated multi-service deployment
- Enable auto-deploy for CI/CD

---

**Need detailed help?** See `RENDER_DEPLOYMENT_GUIDE.md`
