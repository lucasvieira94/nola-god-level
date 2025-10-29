@echo off
REM Restaurant Analytics Platform - Setup Script for Windows
REM This script automates the setup process

echo.
echo 🍔 Restaurant Analytics Platform - Setup Script
echo ================================================
echo.

REM Step 1: Check prerequisites
echo 📋 Step 1: Checking prerequisites...

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js 18+ from https://nodejs.org/
    exit /b 1
)
echo ✅ Node.js found

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed
    exit /b 1
)
echo ✅ npm found

where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not installed
    echo Please install Docker from https://www.docker.com/products/docker-desktop/
    exit /b 1
)
echo ✅ Docker found

where docker-compose >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set DOCKER_COMPOSE=docker-compose
    echo ✅ Docker Compose found
) else (
    set DOCKER_COMPOSE=docker compose
    echo ✅ Using docker compose
)

echo.
echo 📦 Step 2: Starting PostgreSQL database...

REM Start database
%DOCKER_COMPOSE% up -d postgres

REM Wait for database
echo ⏳ Waiting for database to be ready...
timeout /t 10 /nobreak >nul

echo ✅ Database started

echo.
echo 🎲 Step 3: Generating sample data (this may take 2-5 minutes)...

REM Generate data
%DOCKER_COMPOSE% run --rm data-generator

echo.
echo 🔧 Step 4: Setting up backend...

cd solution\backend

REM Install dependencies
echo 📥 Installing backend dependencies...
call npm install

REM Copy env file
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ✅ .env file created
) else (
    echo ⚠️  .env file already exists, skipping
)

REM Generate Prisma client
echo 🔨 Generating Prisma client...
call npm run prisma:generate

echo ✅ Backend setup complete

cd ..\..

echo.
echo 🎨 Step 5: Setting up frontend...

cd solution\frontend

REM Install dependencies
echo 📥 Installing frontend dependencies...
call npm install

echo ✅ Frontend setup complete

cd ..\..

echo.
echo ================================================
echo 🎉 Setup Complete!
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd solution\backend
echo   npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd solution\frontend
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo For more information, see:
echo   - README.md (feature overview)
echo   - QUICKSTART.md (testing guide)
echo   - ARCHITECTURE.md (design decisions)
echo.
pause
