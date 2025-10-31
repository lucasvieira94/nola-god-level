# ⚡ Quick Start - NOLA Platform

## 🌐 Testando em Produção (Mais Rápido!)

**Acesse agora**: https://nola-god-level-solution.vercel.app

1. Registre uma conta (qualquer email válido)
2. Explore o dashboard com **10,337 vendas reais**
3. Teste filtros, gráficos e exportações

---

## 💻 Setup Local Completo

### Pré-requisitos

- Docker Desktop instalado e rodando
- Node.js 18+ instalado

### 1️⃣ Clone e Prepare o Ambiente

```bash
# Clone o repositório
git clone https://github.com/Su6eate9/nola-god-level-solution.git
cd nola-god-level-solution
```

### 2️⃣ Inicie os Serviços com Docker

```bash
# Sobe PostgreSQL + Backend automaticamente
docker compose up -d

# Verifique os containers
docker ps
# Você deve ver: godlevel-db e godlevel-backend-dev
```

### 3️⃣ Popule o Banco de Dados

```bash
# OPÇÃO 1: Volume completo - 2.0M+ vendas para stress test (leva ~30 minutos)
docker compose run --rm data-generator

# OPÇÃO 2: Volume menor - 90k vendas para testes rápidos (leva ~5 minutos)
docker compose run --rm -e MONTHS=10 data-generator

# Verifique os dados
docker exec godlevel-db psql -U challenge -d challenge_db -c "SELECT COUNT(*) FROM sales;"
```

### 4️⃣ Inicie o Frontend

```bash
# Em uma nova janela de terminal
cd solution/frontend
npm install
npm run dev
```

### 5️⃣ Acesse a Aplicação

**Frontend**: http://localhost:5173  
**Backend API**: http://localhost:3001  
**Health Check**: http://localhost:3001/api/health

**Credenciais de teste:**

- Email: `test@nola.com`
- Senha: `Test123!`

---

## ✅ Verificação Rápida

```bash
# Contar vendas no banco
docker exec godlevel-db psql -U challenge -d challenge_db -c "SELECT COUNT(*) FROM sales;"

# Testar backend
curl http://localhost:3001/api/health

# Ver logs do backend
docker logs -f godlevel-backend-dev
```

---

## 🔧 Comandos Úteis

```bash
# Parar todos os serviços
docker compose down

# Reiniciar do zero (apaga dados)
docker compose down -v
docker compose up -d
docker compose run --rm data-generator

# Acessar o banco diretamente
docker exec -it godlevel-db psql -U challenge -d challenge_db

# Ver logs
docker logs -f godlevel-db          # PostgreSQL
docker logs -f godlevel-backend-dev # Backend
```

## Estrutura dos Dados

```
Sale
├── ProductSale (produtos)
│   └── ItemProductSale (customizações: +bacon, -cebola)
├── Payment (formas de pagamento)
└── DeliverySale (delivery)
    └── DeliveryAddress (com lat/long)
```

**Schema completo**: [DADOS.md](./DADOS.md)

## Próximos Passos

1. **Entenda o problema**: Leia [PROBLEMA.md](./PROBLEMA.md)
2. **Explore os dados**: Rode queries, veja padrões
3. **Desenhe solução**: Arquitetura, stack, UX
4. **Implemente**: Resolva o problema!

---

**Setup completo! Hora de codar. 🚀**
