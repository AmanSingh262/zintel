@echo off
echo ========================================
echo  FIXING ZINTEL DATABASE TABLES
echo ========================================
echo.

echo Step 1: Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)
echo ✓ Prisma client generated
echo.

echo Step 2: Pushing schema to Supabase...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ERROR: Database push failed!
    pause
    exit /b 1
)
echo ✓ Database schema pushed
echo.

echo ========================================
echo  SUCCESS! Database is ready.
echo ========================================
echo.
echo Next steps:
echo 1. Restart your dev server (Ctrl+C, then npm run dev)
echo 2. Try liking a post again
echo.
pause
