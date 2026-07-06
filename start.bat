@echo off
echo ===================================================
echo      FraudShield AI - Enterprise Edition v10.0
echo ===================================================
echo.

echo [1/3] Checking Backend Environment...
cd backend
if not exist venv\ (
    echo Creating Python Virtual Environment...
    python -m venv venv
)
echo Installing Backend Dependencies...
call .\venv\Scripts\python -m pip install -r requirements.txt
if not exist fraudshield.db (
    echo Seeding Initial Database...
    call .\venv\Scripts\python seed.py
)
cd ..

echo.
echo [2/3] Checking Frontend Environment...
cd frontend
if not exist node_modules\ (
    echo Installing Node Modules...
    call npm install
)
cd ..

echo.
echo [3/3] Starting Servers...
echo Starting Backend (FastAPI)...
start "FraudShield Backend" cmd /k "cd backend && .\venv\Scripts\uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

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
