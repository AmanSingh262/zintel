@echo off
echo ==========================================
echo OPTION 1: Quick Setup via PowerShell
echo ==========================================
echo.
echo Right-click SETUP.ps1 and select "Run with PowerShell"
echo (This has better error handling)
echo.
pause
echo.
echo ==========================================
echo OPTION 2: Manual Setup via Command Prompt
echo ==========================================
echo.
echo Running installation now...
echo.

cd /d "%~dp0"

echo [1/5] Checking Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not installed!
    echo Please install from https://nodejs.org/
    pause
    exit /b 1
)

node -v
npm -v
echo.

echo [2/5] Installing dependencies (2-3 minutes)...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    echo Try running: npm cache clean --force
    pause
    exit /b 1
)
echo Done!
echo.

echo [3/5] Generating Prisma...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)
echo Done!
echo.

echo [4/5] Setting up database...
call npx prisma db push
if errorlevel 1 (
    echo ERROR: Database setup failed!
    pause
    exit /b 1
)
echo Done!
echo.

echo [5/5] Starting server...
echo.
echo ==========================================
echo Opening http://localhost:3000 in browser
echo Press Ctrl+C to stop the server
echo ==========================================
echo.

start http://localhost:3000
timeout /t 2 >nul

call npm run dev
