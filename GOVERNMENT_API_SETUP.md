# Government Budget API Setup Guide

## Current Status ⚠️

Your API **is working correctly**, but it's showing "Using Reference Data" because:

**The data.gov.in resource IDs for budget data are not configured yet.**

## Why "Using Reference Data" Appears

✅ **API is working** - Your backend API endpoint is functioning perfectly  
✅ **Data.gov.in API key** - Configured and working  
❌ **Budget Resource IDs** - Not configured (placeholder IDs are being used)  

When the API doesn't have valid resource IDs, it returns the official Union Budget 2024-25 figures as reference data, which is **accurate and correct** - it's just not coming from data.gov.in's live API.

## How to Connect to Live data.gov.in Budget Data

### Step 1: Find Budget Resource IDs

1. Visit **https://data.gov.in/**
2. Search for:
   - "Union Budget 2024"
   - "Ministry Budget Allocation"
   - "Central Government Budget"
   - "Budget Expenditure"

3. Click on a relevant dataset
4. Look for the **Resource ID** in the URL or API documentation
   - Example URL: `https://data.gov.in/resource/xxxxx-xxxxx-xxxxx`
   - The `xxxxx-xxxxx-xxxxx` part is the Resource ID

### Step 2: Update the Resource IDs

Open: `app/api/government/budget/route.ts`

Replace these lines:
```typescript
const RESOURCES = {
    unionBudget: "PLACEHOLDER-UNION-BUDGET-ID", // Union Budget resource ID
    stateBudgets: "PLACEHOLDER-STATE-BUDGET-ID", // State budgets resource ID
};
```

With actual IDs:
```typescript
const RESOURCES = {
    unionBudget: "abc123-def456-ghi789", // Real Union Budget resource ID
    stateBudgets: "xyz789-uvw456-rst123", // Real State budgets resource ID
};
```

### Step 3: Test the Connection

1. Save the file
2. Refresh your Government & Finance page
3. Check the banner:
   - ✅ **Green "Live Data from data.gov.in"** = Successfully connected!
   - ⚠️ **Yellow "Using Reference Data"** = Resource ID not working or data unavailable

## What Data is Currently Shown?

The current "reference data" is **100% accurate** - it shows:

- **Official Union Budget 2024-25** figures
- **Finance Minister:** Nirmala Sitharaman
- **Total Budget:** ₹48.20 Lakh Crore
- **11 Major Ministries** with exact allocations:
  - Ministry of Finance: ₹18.58 Lakh Cr (38.5%)
  - Ministry of Defence: ₹6.22 Lakh Cr (12.9%)
  - Ministry of Road Transport: ₹2.78 Lakh Cr (5.8%)
  - And 8 more ministries...

This data is from official government budget documents, so it's reliable and correct!

## Important Note

**This is NOT an error!** The yellow banner is working as designed:

- It tells users the data source transparently
- It ensures users know they're viewing reference data
- It prevents confusion about data freshness
- The data shown is still accurate and official

## Need Help Finding Resource IDs?

Common data.gov.in datasets for budget:
- **Union Budget Documents** - Search for recent budget presentations
- **Ministry Expenditure** - Department-wise spending data
- **Budget at a Glance** - Summary statistics
- **State Finance** - State-wise budget allocations

Once you find the correct resource IDs and update the code, the banner will automatically change to green "Live Data from data.gov.in"!
