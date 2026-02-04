# Zintel Website - Troubleshooting Guide

## Issue: Website Not Starting

### Current Status
❌ **Node modules NOT installed** - Dependencies need to be installed before the server can run
❌ **Dev server NOT running** - localhost:3000 shows connection refused

### Root Cause
The `npm install` command hasn't been executed successfully yet. This needs to complete before the website can run.

---

## Solution Steps

### Step 1: Verify Node.js Is Installed

Open Command Prompt and run:
```cmd
node -v
npm -v
```

**Expected output:**
```
v18.x.x (or higher)
9.x.x (or higher)
```

**If you see "command not found":**
➡️ You need to install Node.js first
➡️ Download from: https://nodejs.org/ (LTS version recommended)
➡️ After installation, restart Command Prompt and try again

---

### Step 2: Install Dependencies

Once Node.js is confirmed installed, run:

```cmd
cd "c:\Users\Asquare\Downloads\Zintel Website"
npm install
```

**This will take 2-3 minutes.** You'll see output like:
```
npm WARN deprecated ...
added 324 packages, and audited 325 packages in 2m
```

---

### Step 3: Initialize Database

After npm install completes successfully:

```cmd
npx prisma generate
npx prisma db push
```

---

### Step 4: Start Development Server

```cmd
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

---

### Step 5: Open in Browser

Open Chrome and navigate to:
```
http://localhost:3000
```

You should see the Zintel homepage with:
- Purple gradient hero section
- "ZINTEL – The Nation in Live Data" title
- Quick stats cards
- India map placeholder
- Trending panel

---

## Alternative: Use the Batch File

Double-click: **`INSTALL_AND_START.bat`**

This automates all steps above.

---

## Common Issues

### Issue: "npm is not recognized"
**Solution:** Node.js not installed. Install from https://nodejs.org/

### Issue: npm install fails with errors
**Solution:** 
- Try deleting `package-lock.json` if it exists
- Run `npm cache clean --force`
- Try again: `npm install`

### Issue: Port 3000 already in use
**Solution:**
- Check if another app is using port 3000
- Kill the process: `npx kill-port 3000`
- Or use different port: `npm run dev -- -p 3001`

### Issue: Prisma errors
**Solution:**
- Make sure npm install completed first
- Delete `node_modules` and `.next` folders
- Re-run `npm install`

---

## What Should Work After Setup

✅ All 15+ pages accessible
✅ Sidebar navigation functional
✅ Homepage with hero and stats
✅ Population page with state data
✅ Media verification with Real/Fake/Misleading badges
✅ Podcasts player
✅ Social community feed
✅ Exact color scheme (#5B2D8B, #2ECC71, #E74C3C)

---

## Next Steps After It's Running

Once you see the homepage in Chrome, I can help you:
1. Test all navigation links
2. Verify every page loads correctly
3. Check color scheme accuracy
4. Test responsive design
5. Verify all features are working

---

## Need Help?

If you're stuck:
1. Share the error message you're seeing
2. Confirm if Node.js is installed (`node -v`)
3. Share the output of `npm install` if it fails
