@echo off
echo 🌐 Opening Frontend...
echo.
echo Backend phải đang chạy tại http://localhost:8000
echo.

REM Check if backend is running
curl -f http://localhost:8000/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend is not running!
    echo Please run start-local.bat first in another terminal
    echo.
    pause
    exit /b 1
)

echo ✅ Backend is running
echo.

REM Update frontend to use localhost API
echo 📝 Configuring frontend for local development...

REM Open frontend in default browser
echo 🌐 Opening frontend in browser...
start "" "http://localhost:3000"

REM Start simple HTTP server for frontend
echo 📡 Starting frontend server on port 3000...
cd frontend
python -m http.server 3000
