@echo off
title Sahayak AI Backend Setup

echo ===================================================
echo     Setting up Sahayak AI Python Backend
echo ===================================================
echo.

cd /d backend

echo [INFO] Creating Python virtual environment...
python -m venv venv

echo [INFO] Installing requirements...
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo.
echo [INFO] Setup complete! You can now run start.bat
pause
