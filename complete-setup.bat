@echo off
echo ========================================
echo Zintel Database Setup - Complete Process
echo ========================================
echo.

cd "c:\Users\Asquare\Downloads\Zintel Website"

echo [1/4] Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)
echo ✓ Prisma Client generated successfully
echo.

echo [2/4] Pushing schema to Supabase...
call npx prisma db push --accept-data-loss --skip-generate
if errorlevel 1 (
    echo ERROR: Failed to push schema
    echo.
    echo Common issues:
    echo - Check your DATABASE_URL and DIRECT_URL in .env.local
    echo - Make sure you replaced [YOUR-PASSWORD] with actual password
    echo - Verify internet connection
    pause
    exit /b 1
)
echo ✓ Schema pushed to Supabase successfully
echo.

echo [3/4] Starting development server...
echo Opening new window for server...
start "Zintel Dev Server" cmd /k "npm run dev"
echo.
echo Waiting 10 seconds for server to start...
timeout /t 10 /nobreak
echo.

echo [4/4] Seeding database...
echo Opening browser to seed database...
start http://localhost:4001/api/seed-posts
timeout /t 3 /nobreak
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Check the browser tab that opened
echo 2. You should see: "success": true
echo 3. Visit: http://localhost:4001/social
echo 4. You should see 10 posts from Zintel.in!
echo.
echo If you see errors, check the Dev Server window
echo.
pause
