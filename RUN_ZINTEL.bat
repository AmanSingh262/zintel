@echo off
cd /d "%~dp0"

echo ==========================================
echo      ZINTEL WEBSITE LAUNCHER
echo ==========================================
echo.
echo [1/3] Checking environment...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is NOT installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)
node -v
npm -v
echo.

echo [2/3] Installing/Updating dependencies...
call npm install
if %errorlevel% neq 0 (
    echo WARNING: npm install reported errors. Trying to proceed anyway...
)
echo.

echo [3/3] Starting Server on Port 4001...
echo.
echo If the browser opens too early, just refresh the page.
echo Press Ctrl+C to stop the server.
echo.

start http://localhost:4001

:: Force run on port 4001 directly to be safe
call npx next dev -p 4001

echo.
echo ==========================================
echo SERVER STOPPED OR CRASHED
echo Read the error message above.
echo ==========================================
pause
