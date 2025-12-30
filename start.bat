@echo off
echo 🚀 Starting RAG Multi-LLM System...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Create .env if not exists
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
)

REM Create necessary directories
echo 📁 Creating directories...
if not exist uploads mkdir uploads
if not exist vector_db mkdir vector_db

REM Build and start containers
echo 🏗️  Building containers...
docker-compose build

echo ▶️  Starting containers...
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check health
echo 🔍 Checking services...
curl -f http://localhost:8000/health >nul 2>&1
if errorlevel 0 (
    echo ✅ Backend is running!
) else (
    echo ⚠️  Backend is starting... (this may take a minute^)
)

curl -f http://localhost >nul 2>&1
if errorlevel 0 (
    echo ✅ Frontend is running!
) else (
    echo ⚠️  Frontend is starting...
)

echo.
echo 🎉 Setup complete!
echo.
echo Access the application at:
echo   - Frontend: http://localhost
echo   - Backend API: http://localhost:8000
echo   - API Docs: http://localhost:8000/docs
echo.
echo To view logs:
echo   docker-compose logs -f
echo.
echo To stop:
echo   docker-compose down
echo.
pause
