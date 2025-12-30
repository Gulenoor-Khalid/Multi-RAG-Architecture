#!/bin/bash

echo "🚀 Starting RAG Multi-LLM System..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env if not exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads vector_db

# Build and start containers
echo "🏗️  Building containers..."
docker-compose build

echo "▶️  Starting containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check health
echo "🔍 Checking services..."
curl -f http://localhost:8000/health &> /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend is running!"
else
    echo "⚠️  Backend is starting... (this may take a minute)"
fi

curl -f http://localhost &> /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend is running!"
else
    echo "⚠️  Frontend is starting..."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Access the application at:"
echo "  - Frontend: http://localhost"
echo "  - Backend API: http://localhost:8000"
echo "  - API Docs: http://localhost:8000/docs"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop:"
echo "  docker-compose down"
