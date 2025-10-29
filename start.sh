#!/bin/bash

echo "🚀 Iniciando God Level Coder Challenge - Restaurant Analytics"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "solution/backend/package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Iniciando Backend ===${NC}"
cd solution/backend
npx tsx src/index.ts &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend iniciado (PID: $BACKEND_PID)${NC}"
echo -e "${GREEN}✓ Backend rodando em http://localhost:3001${NC}"
cd ../..

sleep 3

echo ""
echo -e "${BLUE}=== Iniciando Frontend ===${NC}"
cd solution/frontend
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend iniciado (PID: $FRONTEND_PID)${NC}"
echo -e "${GREEN}✓ Frontend rodando em http://localhost:3000${NC}"
cd ../..

echo ""
echo -e "${GREEN}=== Aplicação Iniciada! ===${NC}"
echo ""
echo "📊 Dashboard: http://localhost:3000"
echo "🔌 API: http://localhost:3001"
echo ""
echo "Para parar os servidores:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Pressione Ctrl+C para sair"
echo ""

# Manter o script rodando
wait
