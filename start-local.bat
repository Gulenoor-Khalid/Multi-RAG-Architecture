@echo off
echo 🚀 Starting RAG Local Development...
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.11+
    pause
    exit /b 1
)

echo ✅ Python found
echo.

REM Create virtual environment if not exists
if not exist venv (
    echo 📦 Creating virtual environment...
    python -m venv venv
    echo ✅ Virtual environment created
    echo.
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
echo This may take 5-10 minutes on first run...
pip install -r requirements.txt

REM Create .env if not exists
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
)

REM Create directories
if not exist uploads mkdir uploads
if not exist vector_db mkdir vector_db

echo.
echo ✅ Setup complete!
echo.
echo 🚀 Starting backend server...
echo Backend will be available at: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start backend
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
