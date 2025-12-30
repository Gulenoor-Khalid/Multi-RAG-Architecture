@echo off
echo 🔄 Restarting Backend Server...
echo.

REM Kill any existing Python processes running uvicorn
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *uvicorn*" 2>nul

echo ✅ Stopped old backend process
echo.
echo 🚀 Starting new backend...
echo.

cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
