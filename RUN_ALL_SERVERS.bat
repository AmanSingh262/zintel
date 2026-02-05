@echo off
echo ===================================================
echo      STARTING ALL ZINTEL DATA PLATFORM SERVERS
echo ===================================================
echo.

:: 1. Government Finance Server
echo [1/3] Launching Government Finance AP (Port 8002)...
start "Zintel - Gov Finance API (8002)" cmd /k "python government_finance_server.py"

:: 2. LLM Backend Server
echo [2/3] Launching LLM and News API (Port 8000)...
start "Zintel - LLM Backend (8000)" cmd /k "cd llm-model/backend && python -m uvicorn main:app --reload --port 8000"

:: 3. Frontend Application
echo [3/3] Launching Frontend (Port 4001)...
start "Zintel - Frontend (4001)" cmd /k "npm run dev"

echo.
echo ===================================================
echo      ALL SYSTEMS GO!
echo ===================================================
echo.
echo Access the application at: http://localhost:4001
echo.
echo API Status:
echo - Gov Finance: http://localhost:8002/docs
echo - LLM Backend: http://localhost:8000/docs
echo.
pause
