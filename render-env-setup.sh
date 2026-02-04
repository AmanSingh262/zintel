#!/bin/bash

# Zintel - Environment Variables Setup Script for Render.com
# Copy and customize these for your Render deployment

echo "==================================="
echo "Zintel - Render Environment Setup"
echo "==================================="

# FRONTEND ENVIRONMENT VARIABLES
cat << 'EOF'

========================================
FRONTEND SERVICE (zintel-frontend)
========================================

NODE_ENV=production
NEXTAUTH_URL=https://zintel-frontend.onrender.com
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters-long
DATABASE_URL=postgresql://postgres.xxx:password@aws-x-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.xxx:password@aws-x-ap-south-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATA_GOV_API_KEY=579b464db66ec23bdd000001fd982dfc503648f375315440b1deafe8
LLM_BACKEND_URL=https://zintel-llm-backend.onrender.com
GOV_FINANCE_BACKEND_URL=https://zintel-gov-finance.onrender.com
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret

========================================
LLM BACKEND SERVICE (zintel-llm-backend)
========================================

PYTHON_VERSION=3.12.0
PORT=10000

========================================
GOVERNMENT FINANCE API (zintel-gov-finance)
========================================

PYTHON_VERSION=3.12.0
PORT=10000

========================================

INSTRUCTIONS:
1. Go to each service in Render dashboard
2. Navigate to: Settings → Environment
3. Click "Add Environment Variable"
4. Copy and paste the variables above
5. Replace placeholder values with your actual credentials
6. Click "Save Changes"
7. Service will automatically redeploy

GENERATE SECURE NEXTAUTH_SECRET:
Run this command locally and copy the output:
  openssl rand -base64 32

EOF
