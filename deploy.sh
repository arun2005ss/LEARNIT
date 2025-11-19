#!/bin/bash

# LEARNIT Deployment Script
echo "🚀 Starting LEARNIT deployment..."

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

# Create .env.production file if it doesn't exist
if [ ! -f .env.production ]; then
    echo "📝 Creating .env.production file..."
    cp .env.production.example .env.production 2>/dev/null || {
        echo "⚠️  Please create .env.production file with your production variables"
        exit 1
    }
fi

# Load environment variables
source .env.production

# Validate required environment variables
required_vars=("MONGODB_URI" "JWT_SECRET" "SESSION_SECRET" "CLIENT_URL" "GOOGLE_CLIENT_ID" "GOOGLE_CLIENT_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Missing required environment variable: $var"
        exit 1
    fi
done

echo "✅ Environment variables validated"

# Build and start containers
echo "🔨 Building Docker containers..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service health..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running successfully!"
    
    # Show service status
    echo "📊 Service Status:"
    docker-compose ps
    
    # Show logs
    echo "📋 Recent logs:"
    docker-compose logs --tail=50
    
    echo "🎉 Deployment completed successfully!"
    echo "🌐 Your application should be available at: $CLIENT_URL"
else
    echo "❌ Some services failed to start. Check logs:"
    docker-compose logs
    exit 1
fi
