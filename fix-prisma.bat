@echo off
echo Fixing Prisma Client Error...
echo.
cd "c:\Users\Asquare\Downloads\Zintel Website"
echo Running: npx prisma generate
npx prisma generate
echo.
echo Done! Press any key to close...
pause
