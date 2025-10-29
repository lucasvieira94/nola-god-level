@echo off
title God Level Coder Challenge - Restaurant Analytics

echo.
echo ========================================
echo  God Level Coder Challenge
echo  Restaurant Analytics Platform
echo ========================================
echo.

REM Verificar se estamos no diretório correto
if not exist "solution\backend\package.json" (
    echo [ERROR] Execute este script na raiz do projeto
    exit /b 1
)

echo [1/2] Iniciando Backend...
cd solution\backend
start "Backend Server" cmd /k "npx tsx src/index.ts"
timeout /t 3 /nobreak >nul
cd ..\..
echo [OK] Backend iniciado em http://localhost:3001

echo.
echo [2/2] Iniciando Frontend...
cd solution\frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..\..
echo [OK] Frontend iniciado em http://localhost:3000

echo.
echo ========================================
echo  Aplicacao Iniciada!
echo ========================================
echo.
echo Dashboard: http://localhost:3000
echo API:       http://localhost:3001
echo.
echo Pressione qualquer tecla para abrir o navegador...
pause >nul

start http://localhost:3000

echo.
echo Para parar os servidores, feche as janelas do terminal
echo.
