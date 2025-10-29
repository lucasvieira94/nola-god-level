# 🚀 Próximos Passos - Execute Manualmente

## ✅ Já Concluído:

- ✅ PostgreSQL instalado e rodando
- ✅ Banco de dados `nola_challenge` criado
- ✅ Schema importado
- ✅ Arquivo `.env` do backend configurado
- ✅ Dependências do backend instaladas
- ✅ Prisma Client gerado
- ✅ **Dados sendo gerados** (aguarde terminar - ~500k registros)

## 📊 Verificar Geração de Dados

Aguarde até ver esta mensagem no terminal onde está rodando `python generate_data.py`:

```
✓ Data generation complete!
  Stores: 50
  Products: 498
  Items/Complements: 28
  Customers: 10,000
  Sales: ~500,000
```

**Tempo estimado:** 5-10 minutos total

## 🎯 Próximos Comandos (Execute depois que os dados terminarem)

### 1. Iniciar Backend

Abra um **novo terminal** e execute:

```bash
cd "solution/backend"
npm run dev
```

Você deverá ver:

```
🚀 Server running on http://localhost:3001
✅ Database connected
```

### 2. Criar arquivo .env do Frontend

Crie o arquivo `solution/frontend/.env` com este conteúdo:

```env
VITE_API_URL=http://localhost:3001
```

**OU** execute este comando na raiz do projeto:

```bash
echo "VITE_API_URL=http://localhost:3001" > solution/frontend/.env
```

### 3. Instalar dependências do Frontend

Abra **outro terminal** e execute:

```bash
cd "solution/frontend"
npm install
```

### 4. Iniciar Frontend

No mesmo terminal do frontend:

```bash
npm run dev
```

Você verá:

```
VITE v6.0.1  ready in 500 ms

➜  Local:   http://localhost:5173/
```

### 5. Abrir no Navegador

Abra: **http://localhost:5173**

### 6. Testar a Aplicação

1. Clique em **"Registrar"**
2. Preencha:
   - **Nome:** Teste
   - **Email:** teste@example.com
   - **Senha:** 123456
3. Clique em **"Criar Conta"**
4. Você será redirecionado para o dashboard
5. **Verifique:**
   - ✅ 4 cards de KPIs aparecem com valores
   - ✅ Gráficos de linha, barra e pizza aparecem
   - ✅ Filtros de data, canal e loja funcionam
   - ✅ Gráficos atualizam ao mudar os filtros

## 🔍 Verificar Status

### Backend rodando?

```bash
curl http://localhost:3001/health
# Deve retornar: {"status":"ok"}
```

### Quantos registros foram gerados?

```bash
"C:/Program Files/PostgreSQL/15/bin/psql.exe" -U postgres -d nola_challenge -c "SELECT COUNT(*) FROM sales;"
```

### Ver logs do backend

No terminal onde o backend está rodando, veja se há erros

### Ver logs do frontend

No terminal onde o frontend está rodando, veja se há erros

## ❌ Problemas Comuns

### Erro: "ECONNREFUSED" no frontend

**Causa:** Backend não está rodando
**Solução:** Inicie o backend primeiro (passo 1)

### Erro: "Network Error" ao fazer login

**Causa:** Backend não conectou ao banco
**Solução:** Verifique se:

1. PostgreSQL está rodando (procure "postgresql-x64-15" nos serviços do Windows)
2. Senha no `.env` está correta
3. Banco `nola_challenge` existe

### Frontend não carrega dados

**Causa:** Dados ainda não foram gerados
**Solução:** Aguarde o script Python terminar

### Porta 3001 ou 5173 em uso

**Solução:**

```bash
# Windows - Encontrar e matar processo
netstat -ano | findstr :3001
taskkill /PID <número_do_pid> /F
```

## 📹 Próximo: Gravar Vídeo Demo

Após tudo funcionando:

1. **Mostre a aplicação funcionando:**

   - Dashboard com dados
   - Filtros funcionando
   - Gráficos atualizando

2. **Explique a arquitetura:**

   - Backend: Express + TypeScript + Prisma
   - Frontend: React + Vite + TailwindCSS + Recharts
   - Database: PostgreSQL com 500k registros

3. **Destaque decisões técnicas:**

   - Por que PostgreSQL em vez de MongoDB
   - Por que Zustand em vez de Redux
   - Por que Prisma em vez de Mongoose
   - Performance: agregações SQL, parallel requests

4. **Tempo:** 5-10 minutos

## 🎉 Tudo Pronto!

Quando tudo estiver funcionando, você terá:

- ✅ Backend rodando (http://localhost:3001)
- ✅ Frontend rodando (http://localhost:5173)
- ✅ 500k+ registros de vendas
- ✅ Dashboard interativo
- ✅ Filtros funcionando
- ✅ Gráficos atualizando

**Deadline:** 3 de novembro de 2025

**Email para submissão:** gsilvestre@arcca.io

Boa sorte! 🚀
