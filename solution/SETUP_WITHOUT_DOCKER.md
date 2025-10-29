# 🚀 Setup Sem Docker

Guia para rodar o projeto sem Docker, usando PostgreSQL instalado localmente.

## 📋 Pré-requisitos

- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 15+ ([Download](https://www.postgresql.org/download/windows/))
- npm 9+

## 🗄️ Configurar PostgreSQL

### 1. Instalar PostgreSQL

1. Baixe o instalador: https://www.postgresql.org/download/windows/
2. Execute o instalador
3. Durante a instalação:
   - **Porta:** 5432 (padrão)
   - **Senha do superusuário:** Escolha uma senha (ex: `postgres`)
   - Marque "pgAdmin 4" para instalar a interface gráfica

### 2. Criar o Banco de Dados

Após a instalação, abra o terminal e execute:

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Dentro do psql, criar o banco de dados:
CREATE DATABASE nola_challenge;

# Criar usuário (opcional, pode usar o postgres mesmo):
CREATE USER nola_user WITH PASSWORD 'nola_password';
GRANT ALL PRIVILEGES ON DATABASE nola_challenge TO nola_user;

# Sair do psql
\q
```

**OU** use o pgAdmin 4:

1. Abra pgAdmin 4
2. Conecte ao servidor local
3. Clique com botão direito em "Databases" → "Create" → "Database"
4. Nome: `nola_challenge`

### 3. Importar o Schema

```bash
# Na pasta raiz do projeto
psql -U postgres -d nola_challenge -f database-schema.sql
```

### 4. Gerar Dados de Teste

```bash
# Instalar dependências do Python (se não tiver):
pip install psycopg2-binary faker

# Editar generate_data.py para usar suas credenciais:
# Linha ~15: conn = psycopg2.connect(...)
# Altere para:
# conn = psycopg2.connect(
#     host="localhost",
#     port=5432,
#     database="nola_challenge",
#     user="postgres",  # ou seu usuário
#     password="sua_senha_aqui"
# )

# Gerar dados (500k registros - pode demorar 5-10 min):
python generate_data.py
```

## ⚙️ Configurar Backend

### 1. Instalar Dependências

```bash
cd solution/backend
npm install
```

### 2. Configurar .env

Crie o arquivo `solution/backend/.env`:

```env
# Database
DATABASE_URL="postgresql://postgres:sua_senha_aqui@localhost:5432/nola_challenge?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server
PORT=3001
NODE_ENV=development
```

**⚠️ IMPORTANTE:** Substitua `sua_senha_aqui` pela senha que você definiu ao instalar o PostgreSQL!

### 3. Gerar Prisma Client

```bash
npm run prisma:generate
```

### 4. Iniciar Backend

```bash
npm run dev
```

Você verá:

```
🚀 Server running on http://localhost:3001
✅ Database connected
```

## 🎨 Configurar Frontend

### 1. Instalar Dependências

Abra **outro terminal**:

```bash
cd solution/frontend
npm install
```

### 2. Configurar .env

Crie o arquivo `solution/frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

### 3. Iniciar Frontend

```bash
npm run dev
```

Você verá:

```
  VITE v6.0.1  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## ✅ Testar a Aplicação

1. Abra o navegador em: http://localhost:5173
2. Clique em "Registrar"
3. Preencha o formulário:
   - Nome: `Teste`
   - Email: `teste@example.com`
   - Senha: `123456`
4. Clique em "Criar Conta"
5. Você será redirecionado para o dashboard
6. Verifique se os gráficos aparecem com dados! 📊

## 🔧 Troubleshooting

### Erro: "Connection refused" ou "ECONNREFUSED"

**Causa:** PostgreSQL não está rodando

**Solução:**

```bash
# Windows - Verificar se o serviço está ativo:
# 1. Win + R → digite "services.msc"
# 2. Procure por "postgresql-x64-15" (ou similar)
# 3. Se estiver "Parado", clique com botão direito → "Iniciar"

# OU via PowerShell (como administrador):
Start-Service postgresql-x64-15
```

### Erro: "password authentication failed"

**Causa:** Senha incorreta no DATABASE_URL

**Solução:**

1. Verifique a senha no arquivo `.env`
2. Teste a conexão manualmente:
   ```bash
   psql -U postgres -d nola_challenge
   # Se pedir senha e conectar, a senha está correta
   ```

### Erro: "database nola_challenge does not exist"

**Causa:** Banco de dados não foi criado

**Solução:**

```bash
psql -U postgres
CREATE DATABASE nola_challenge;
\q
```

### Erro: "relation sales does not exist"

**Causa:** Schema não foi importado

**Solução:**

```bash
psql -U postgres -d nola_challenge -f database-schema.sql
```

### Erro: "No data available" no dashboard

**Causa:** Dados de teste não foram gerados

**Solução:**

```bash
python generate_data.py
# Aguarde 5-10 minutos para gerar 500k registros
```

### Erro no Python: "No module named psycopg2"

**Causa:** Dependências Python não instaladas

**Solução:**

```bash
pip install psycopg2-binary faker
```

### Frontend não conecta ao Backend

**Causa:** URL incorreta ou Backend não está rodando

**Solução:**

1. Verifique se o backend está rodando em http://localhost:3001
2. Teste diretamente: `curl http://localhost:3001/health`
3. Verifique o arquivo `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3001
   ```

## 📊 Verificar Dados no Banco

Para verificar se os dados foram gerados:

```bash
psql -U postgres -d nola_challenge

-- Ver total de vendas
SELECT COUNT(*) FROM sales;
-- Deve retornar ~500000

-- Ver vendas por canal
SELECT c.channel_name, COUNT(*)
FROM sales s
JOIN channels c ON s.channel_id = c.id
GROUP BY c.channel_name;

-- Sair
\q
```

## 🎯 Comandos Úteis

```bash
# Backend
cd solution/backend
npm run dev          # Iniciar em dev mode
npm run build        # Build para produção
npm run start        # Rodar build de produção
npm run prisma:studio # Abrir GUI do Prisma

# Frontend
cd solution/frontend
npm run dev          # Iniciar em dev mode
npm run build        # Build para produção
npm run preview      # Preview do build

# PostgreSQL
psql -U postgres -d nola_challenge  # Conectar ao banco
pg_dump -U postgres nola_challenge > backup.sql  # Backup
psql -U postgres -d nola_challenge < backup.sql  # Restore
```

## 🚀 Próximos Passos

Após tudo funcionando:

1. ✅ Testar todos os filtros (data, canal, loja)
2. ✅ Verificar se os gráficos atualizam
3. ✅ Testar logout/login
4. 📹 Gravar vídeo demo (5-10 min)
5. 🌐 Deploy (opcional)
6. 📧 Submeter o desafio!

## 💡 Dica

Se você pretende fazer deploy, recomendo usar:

- **Backend:** Render (tem PostgreSQL gratuito integrado)
- **Frontend:** Vercel (deploy automático do GitHub)

Veja o guia completo em `README.md` → Seção "Deployment"

---

**Precisa de ajuda?** Verifique os outros documentos:

- `QUICKSTART.md` - Setup rápido
- `INSTALLATION.md` - Instalação detalhada
- `README.md` - Documentação completa
