@echo off
title Sahayak AI Launcher

echo ===================================================
echo     Starting Sahayak AI (Frontend + Backend)
echo ===================================================
echo.

:: 1. Launch Backend Server if python virtualenv exists
if exist backend\venv\Scripts\activate.bat (
    echo [INFO] Launching FastAPI Backend on http://localhost:8000 ...
    start "Sahayak AI Backend" cmd /k "cd backend && venv\Scripts\activate.bat && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
) else (
    echo [INFO] Backend virtualenv not initialized. Running frontend...
)

:: 2. Open Web Browser
echo [INFO] Opening http://localhost:5173/ in browser...
start http://localhost:5173/

:: 3. Start Frontend Server
echo [INFO] Starting Vite Frontend Server...
call npm run dev

echo.
echo [INFO] Process finished.
pause
