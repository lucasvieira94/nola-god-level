#!/bin/bash

# Restaurant Analytics Platform - Setup Script
# This script automates the setup process

set -e  # Exit on error

echo "🍔 Restaurant Analytics Platform - Setup Script"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Step 1: Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${YELLOW}⚠️  Node.js version is $NODE_VERSION. Version 18+ is recommended${NC}"
else
    echo -e "${GREEN}✅ Node.js $(node -v)${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✅ npm $(npm -v)${NC}"
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker from https://www.docker.com/products/docker-desktop/"
    exit 1
else
    echo -e "${GREEN}✅ Docker $(docker -v | cut -d' ' -f3 | cut -d',' -f1)${NC}"
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️  docker-compose not found, trying docker compose...${NC}"
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
    echo -e "${GREEN}✅ Docker Compose $(docker-compose -v | cut -d' ' -f4 | cut -d',' -f1)${NC}"
fi

echo ""
echo "📦 Step 2: Starting PostgreSQL database..."

# Start database
$DOCKER_COMPOSE up -d postgres

# Wait for database to be healthy
echo "⏳ Waiting for database to be ready..."
sleep 5

# Check if database is healthy
if $DOCKER_COMPOSE ps postgres | grep -q "healthy"; then
    echo -e "${GREEN}✅ Database is running${NC}"
else
    echo -e "${YELLOW}⚠️  Database might not be fully ready yet${NC}"
fi

echo ""
echo "🎲 Step 3: Generating sample data (this may take 2-5 minutes)..."

# Generate data
$DOCKER_COMPOSE run --rm data-generator

echo ""
echo "🔧 Step 4: Setting up backend..."

cd solution/backend

# Install dependencies
echo "📥 Installing backend dependencies..."
npm install

# Copy env file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping${NC}"
fi

# Generate Prisma client
echo "🔨 Generating Prisma client..."
npm run prisma:generate

echo -e "${GREEN}✅ Backend setup complete${NC}"

cd ../..

echo ""
echo "🎨 Step 5: Setting up frontend..."

cd solution/frontend

# Install dependencies
echo "📥 Installing frontend dependencies..."
npm install

echo -e "${GREEN}✅ Frontend setup complete${NC}"

cd ../..

echo ""
echo "================================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd solution/backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd solution/frontend"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "For more information, see:"
echo "  - README.md (feature overview)"
echo "  - QUICKSTART.md (testing guide)"
echo "  - ARCHITECTURE.md (design decisions)"
echo ""
