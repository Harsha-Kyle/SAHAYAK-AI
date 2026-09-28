@echo off
title Sahayak AI Launcher

echo ===================================================
echo     Starting Sahayak AI (Frontend + Backend)
echo ===================================================
echo.

:: 1. Launch Backend Server (no venv required - uses system Python)
echo [INFO] Launching FastAPI Backend on http://localhost:8000 ...
if exist backend\venv\Scripts\activate.bat (
    start "Sahayak AI Backend" cmd /k "cd backend && venv\Scripts\activate.bat && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
) else (
    start "Sahayak AI Backend" cmd /k "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
)

:: 2. Wait 3 seconds for backend to boot before opening browser
timeout /t 3 /nobreak >nul

:: 3. Open Web Browser
echo [INFO] Opening http://localhost:5173/ in browser...
start http://localhost:5173/

:: 4. Start Frontend Server
echo [INFO] Starting Vite Frontend Server...
call npm run dev

echo.
echo [INFO] Process finished.
pause
