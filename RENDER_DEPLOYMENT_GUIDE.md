# Zintel - Render.com Deployment Guide

## 🚀 Complete Deployment Guide for Render.com

### Prerequisites
- GitHub account with your code pushed
- Render.com account (sign up at https://render.com)
- Your environment variables ready

---

## Step 1: Prepare Your Repository

### 1.1 Update Environment-Specific URLs

Before deploying, you need to update the hardcoded localhost URLs to use environment variables.

**Files to update:**
- All files in `components/` that use `http://localhost:8002`
- API routes that reference local backends

### 1.2 Commit and Push Changes

```bash
cd "c:\Users\Asquare\Downloads\Zintel Website"
git add .
git commit -m "Configure for Render deployment"
git push origin main
```

---

## Step 2: Sign Up / Login to Render

1. Go to https://render.com
2. Click "Get Started" or "Sign In"
3. Connect your GitHub account
4. Authorize Render to access your repositories

---

## Step 3: Deploy the Next.js Frontend

### 3.1 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Select your **zintel** repository
3. Configure:
   - **Name:** `zintel-frontend`
   - **Region:** Singapore (or closest to your users)
   - **Branch:** `main`
   - **Root Directory:** Leave empty
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

### 3.2 Add Environment Variables
Click "Advanced" and add these environment variables:

```
NODE_ENV=production
NEXTAUTH_URL=https://zintel-frontend.onrender.com
NEXTAUTH_SECRET=your-super-secret-key-change-this-to-something-random
DATABASE_URL=your-supabase-connection-string
DIRECT_URL=your-supabase-direct-connection-string
NEXT_PUBLIC_SUPABASE_URL=https://rymfsvflnhdvyfxrsbdx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATA_GOV_API_KEY=579b464db66ec23bdd000001fd982dfc503648f375315440b1deafe8
LLM_BACKEND_URL=https://zintel-llm-backend.onrender.com
GOV_FINANCE_BACKEND_URL=https://zintel-gov-finance.onrender.com
```

### 3.3 Deploy
Click **"Create Web Service"** - Deployment will start automatically

---

## Step 4: Deploy LLM Backend API

### 4.1 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Select your **zintel** repository
3. Configure:
   - **Name:** `zintel-llm-backend`
   - **Region:** Singapore
   - **Branch:** `main`
   - **Root Directory:** `llm model`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free

### 4.2 Deploy
Click **"Create Web Service"**

---

## Step 5: Deploy Government Finance API

### 5.1 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Select your **zintel** repository
3. Configure:
   - **Name:** `zintel-gov-finance`
   - **Region:** Singapore
   - **Branch:** `main`
   - **Root Directory:** Leave empty
   - **Environment:** `Python 3`
   - **Build Command:** `pip install fastapi uvicorn requests python-dateutil`
   - **Start Command:** `uvicorn government_finance_server:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free

### 5.2 Deploy
Click **"Create Web Service"**

---

## Step 6: Update Frontend URLs

Once all services are deployed, you'll have three URLs:
- `https://zintel-frontend.onrender.com`
- `https://zintel-llm-backend.onrender.com`
- `https://zintel-gov-finance.onrender.com`

### 6.1 Update Environment Variables in Frontend
Go to your frontend service → Settings → Environment → Edit

Update these values with your actual service URLs:
```
LLM_BACKEND_URL=https://zintel-llm-backend.onrender.com
GOV_FINANCE_BACKEND_URL=https://zintel-gov-finance.onrender.com
NEXTAUTH_URL=https://zintel-frontend.onrender.com
```

---

## Step 7: Configure Custom Domain (Optional)

### 7.1 Add Custom Domain
1. Go to frontend service → Settings → Custom Domain
2. Click "Add Custom Domain"
3. Enter your domain (e.g., `zintel.com`)
4. Follow DNS configuration instructions
5. Add CNAME record to your DNS provider

---

## Step 8: Monitor Deployment

### 8.1 Check Logs
- Click on each service
- View "Logs" tab to see build and runtime logs
- Check for any errors

### 8.2 Test Services
Once deployed, test each endpoint:
- Frontend: `https://zintel-frontend.onrender.com`
- LLM API: `https://zintel-llm-backend.onrender.com/`
- Gov API: `https://zintel-gov-finance.onrender.com/budget/overview?year=2026`

---

## Important Notes

### ⚠️ Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Limited to 750 hours/month per service

### 🔧 Troubleshooting

**Build Fails:**
- Check build logs for specific errors
- Ensure all dependencies are in package.json/requirements.txt
- Verify Python/Node version compatibility

**Service Won't Start:**
- Check start command is correct
- Verify PORT environment variable is used
- Review runtime logs for errors

**Database Connection Issues:**
- Ensure DATABASE_URL is correct
- Check Supabase connection pooling settings
- Verify network access from Render IPs

**API Calls Failing:**
- Update all hardcoded localhost URLs
- Use environment variables for backend URLs
- Check CORS settings in backend APIs

### 🔄 Auto-Deploy on Push
Render automatically deploys when you push to your connected branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

### 💰 Upgrade to Paid Plan (Optional)
For better performance:
- Go to service Settings → Plan
- Upgrade to Starter ($7/month) for:
  - No spin-down
  - More RAM/CPU
  - Priority support

---

## Environment Variables Reference

### Frontend (.env.local)
```
NODE_ENV=production
NEXTAUTH_URL=https://zintel-frontend.onrender.com
NEXTAUTH_SECRET=generate-using-openssl-rand-base64-32
DATABASE_URL=postgresql://user:pass@host:port/db?pgbouncer=true
DIRECT_URL=postgresql://user:pass@host:port/db
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
DATA_GOV_API_KEY=your-key
LLM_BACKEND_URL=https://zintel-llm-backend.onrender.com
GOV_FINANCE_BACKEND_URL=https://zintel-gov-finance.onrender.com
```

---

## Success Checklist

- [ ] All three services deployed successfully
- [ ] Environment variables configured
- [ ] Services are accessible via URLs
- [ ] Frontend can connect to both backends
- [ ] Database connections working
- [ ] Authentication working
- [ ] News feed loading
- [ ] Government data displaying
- [ ] All pages accessible

---

## Support Resources

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com
- **Status Page:** https://status.render.com

**Your deployment is complete! 🎉**

Visit your live site at: https://zintel-frontend.onrender.com
