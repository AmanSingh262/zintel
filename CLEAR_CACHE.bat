@echo off
echo ========================================
echo  CLEARING NEXT.JS CACHE
echo ========================================
echo.

echo Stopping any running processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Deleting .next folder...
if exist ".next" (
    rmdir /s /q ".next"
    echo ✓ Cache cleared
) else (
    echo ✓ No cache to clear
)

echo.
echo ========================================
echo  CACHE CLEARED!
echo ========================================
echo.
echo Now run: npm run dev
echo.
pause
