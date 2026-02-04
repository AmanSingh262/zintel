@echo off
echo ========================================
echo Quick Database Fix for Zintel
echo ========================================
echo.

cd "c:\Users\Asquare\Downloads\Zintel Website"

echo Step 1: Generating Prisma Client...
call npx prisma generate

echo.
echo Step 2: Pushing Schema to Database...
call npx prisma db push --accept-data-loss

echo.
echo ========================================
echo Done! Now start your server:
echo npm run dev
echo ========================================
echo.
echo Then visit:
echo http://localhost:4001/api/db-test
echo.
pause
