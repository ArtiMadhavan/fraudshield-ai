@echo off
echo ===================================================
echo      FraudShield AI - Enterprise Edition v4.0
echo ===================================================
echo.
echo Starting Backend (FastAPI)...
start "FraudShield Backend" cmd /k "cd backend && .\venv\Scripts\python -m pip install -r requirements.txt && .\venv\Scripts\uvicorn app.main:app --host 0.0.0.0 --port 8000"

echo Starting Frontend (Next.js)...
start "FraudShield Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting! 
echo.
echo  - Frontend Dashboard: http://localhost:3000
echo  - Backend API Docs:   http://localhost:8000/docs
echo.
echo Close this window or the opened command prompts to stop the servers.
pause
