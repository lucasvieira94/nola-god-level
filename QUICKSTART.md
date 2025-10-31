# Quick Start - NOLA Platform

## Testando em Produção

**Acesse agora**: https://nola-god-level-solution.vercel.app

1. Registre uma conta (qualquer email válido)
2. Explore o dashboard com **10,337 vendas reais**
3. Teste filtros, gráficos e exportações

---

## Setup Local Completo

### Pré-requisitos

- Docker Desktop instalado e rodando
- Node.js 18+ instalado

### 1. Clone e Prepare o Ambiente

```bash
# Clone o repositório
git clone https://github.com/Su6eate9/nola-god-level-solution.git
cd nola-god-level-solution
```

### 2. Inicie os Serviços com Docker

```bash
docker compose up -d

docker ps
```

### 3. Popule o Banco de Dados

```bash
# Volume completo - 2.0M+ vendas (leva ~30 minutos)
docker compose run --rm data-generator

# Volume menor - 90k vendas (leva ~5 minutos)
docker compose run --rm -e MONTHS=10 data-generator

# Verificar dados
docker exec godlevel-db psql -U challenge -d challenge_db -c "SELECT COUNT(*) FROM sales;"
```

### 4. Inicie o Frontend

```bash
cd solution/frontend
npm install
npm run dev
```

### 5. Acesse a Aplicação

Frontend: http://localhost:5173  
Backend API: http://localhost:3001  
Health Check: http://localhost:3001/api/health

**Credenciais de teste:**

- Email: `test@nola.com`
- Senha: `Test123!`

**Para criar uma nova conta, a senha deve ter:**

- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula (A-Z)
- Pelo menos 1 caractere especial (!@#$%^&\*(),.?":{}|<>)

> Exemplo de senha válida: `MinhaSenh@123`, `Teste2024!`, `Nola#Plat1`

---

## Verificação Rápida

```bash
docker exec godlevel-db psql -U challenge -d challenge_db -c "SELECT COUNT(*) FROM sales;"
curl http://localhost:3001/api/health
docker logs -f godlevel-backend-dev
```

---

## Comandos Úteis

```bash
docker compose down
docker compose down -v
docker exec -it godlevel-db psql -U challenge -d challenge_db
docker logs -f godlevel-db
docker logs -f godlevel-backend-dev
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

---

Setup completo!
