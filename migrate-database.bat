@echo off
echo ========================================
echo Zintel Database Migration to Supabase
echo ========================================
echo.

cd "c:\Users\Asquare\Downloads\Zintel Website"

echo Step 1: Running Prisma Migration...
echo This will create all tables in your Supabase database
echo.
npx prisma migrate dev --name init_supabase

echo.
echo Step 2: Generating Prisma Client...
npx prisma generate

echo.
echo ========================================
echo Migration Complete!
echo ========================================
echo.
echo Next: Run the development server
echo Command: npm run dev
echo.
pause
