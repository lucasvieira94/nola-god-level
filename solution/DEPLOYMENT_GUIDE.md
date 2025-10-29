# 🚀 Guia de Deploy - Nola Challenge

Este guia fornece instruções passo a passo para fazer deploy da aplicação em produção.

---

## 📋 Pré-requisitos

- [ ] Conta no [Render](https://render.com) (para backend e database)
- [ ] Conta no [Vercel](https://vercel.com) (para frontend)
- [ ] Conta no GitHub com repositório público ou privado
- [ ] Git configurado localmente

---

## 🗄️ PARTE 1: Deploy do Backend no Render

### Passo 1: Preparar o Repositório

1. Certifique-se de que todas as alterações estão commitadas:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Passo 2: Criar Conta e Novo Web Service

1. Acesse https://render.com e crie uma conta (ou faça login)
2. No dashboard, clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub
4. Selecione o repositório `nola-god-level-solution`

### Passo 3: Configurar o Web Service

**Configurações Básicas:**

- **Name:** `nola-backend` (ou nome de sua escolha)
- **Region:** Oregon (US West) ou mais próximo de você
- **Branch:** `main`
- **Root Directory:** deixe vazio (ou `solution/backend` se preferir)
- **Runtime:** Node
- **Build Command:**
  ```bash
  cd solution/backend && npm install && npm run build
  ```
- **Start Command:**
  ```bash
  cd solution/backend && npm start
  ```

**Instance Type:**

- Selecione **Free** (para teste, $0/mês)

### Passo 4: Criar Database PostgreSQL

1. No dashboard do Render, clique em **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name:** `nola-database`
   - **Database:** `nola_db`
   - **User:** `nola_user`
   - **Region:** Mesma do backend (Oregon)
   - **PostgreSQL Version:** 15 (ou mais recente)
   - **Plan:** Free ($0/mês)
3. Clique em **"Create Database"**
4. Aguarde alguns minutos para provisionar

### Passo 5: Configurar Variáveis de Ambiente

No web service `nola-backend`, vá em **Environment**:

1. Adicione as seguintes variáveis:

```
NODE_ENV=production
PORT=3001
DATABASE_URL=[Cole a Internal Database URL do seu PostgreSQL]
JWT_SECRET=[Gere uma string aleatória segura, ex: openssl rand -base64 32]
CORS_ORIGIN=*
```

**Para obter a DATABASE_URL:**

- Vá no dashboard do Render → PostgreSQL `nola-database`
- Copie a **"Internal Database URL"**
- Cole no campo `DATABASE_URL`

**Para gerar JWT_SECRET:**

```bash
# No terminal local (Git Bash no Windows):
openssl rand -base64 32
```

2. Clique em **"Save Changes"**

### Passo 6: Deploy Inicial

1. O Render automaticamente iniciará o deploy
2. Aguarde o build completar (5-10 minutos na primeira vez)
3. Verifique os logs para erros
4. Quando aparecer "Build successful", seu backend está no ar!

### Passo 7: Executar Migrations e Seed

**IMPORTANTE:** O banco de dados precisa ter o schema criado.

**Opção 1: Via Dashboard do Render (PSQL Console)**

1. Vá em PostgreSQL `nola-database` → **Connect** → **PSQL Command**
2. Copie o comando fornecido
3. No terminal local, execute:

```bash
# Conectar ao banco
psql [comando copiado]

# Dentro do psql, executar o schema:
# Copie e cole o conteúdo de solution/backend/prisma/schema.sql
```

**Opção 2: Via Prisma no Backend (Recomendado)**

1. No backend service, vá em **Shell**
2. Execute:

```bash
cd solution/backend
npx prisma db push
npx prisma db seed
```

### Passo 8: Testar o Backend

1. Copie a URL do serviço (ex: `https://nola-backend.onrender.com`)
2. Teste o health check:

```bash
curl https://nola-backend.onrender.com/health
```

3. Deve retornar: `{"status":"ok","timestamp":"..."}`

---

## 🎨 PARTE 2: Deploy do Frontend no Vercel

### Passo 1: Atualizar Variável de Ambiente

1. Abra `solution/frontend/.env` (crie se não existir)
2. Adicione:

```
VITE_API_URL=https://your-backend-url.onrender.com
```

3. Substitua pela URL real do seu backend Render

### Passo 2: Criar Projeto no Vercel

1. Acesse https://vercel.com e crie conta (ou faça login)
2. Clique em **"Add New..."** → **"Project"**
3. **Import Git Repository:** Selecione seu repo GitHub
4. Clique em **"Import"**

### Passo 3: Configurar o Projeto

**Framework Preset:** Vite (auto-detectado)

**Root Directory:**

- Clique em **"Edit"**
- Selecione `solution/frontend`

**Build Command:**

```bash
npm install && npm run build
```

**Output Directory:**

```bash
dist
```

**Install Command:**

```bash
npm install
```

### Passo 4: Configurar Environment Variables

Na seção **Environment Variables**, adicione:

- **Key:** `VITE_API_URL`
- **Value:** `https://your-backend-url.onrender.com` (URL do Render)
- **Environment:** Production, Preview, Development (todos marcados)

Clique em **"Add"**

### Passo 5: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-5 minutos)
3. Quando concluir, clique na URL gerada (ex: `https://nola-xxxxx.vercel.app`)

### Passo 6: Atualizar CORS no Backend

**IMPORTANTE:** Atualize o CORS no backend Render:

1. Vá no Render → `nola-backend` → **Environment**
2. Edite `CORS_ORIGIN`:

```
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

3. Substitua pela URL real do Vercel
4. Salve e aguarde redeploy automático

---

## ✅ Verificação Final

### Checklist de Funcionalidade:

- [ ] Backend health check respondendo: `https://backend-url/health`
- [ ] Frontend carregando: `https://frontend-url`
- [ ] Login funcionando
- [ ] Dashboard carregando dados
- [ ] Filtros atualizando gráficos
- [ ] Dark mode funcionando
- [ ] Responsivo em mobile
- [ ] Exportação CSV funcionando
- [ ] Sem erros no console do browser

### Testar End-to-End:

1. **Abra o frontend:** `https://your-app.vercel.app`
2. **Teste o registro:** Crie novo usuário
3. **Teste o login:** Faça login
4. **Verifique dashboard:** Dados carregando corretamente
5. **Teste filtros:** Mude data, canal, loja
6. **Teste dark mode:** Toggle deve funcionar
7. **Teste exportação:** Clique em "Export CSV"
8. **Teste mobile:** Redimensione janela ou use DevTools
9. **Teste logout:** Deve redirecionar para login

---

## 🐛 Troubleshooting

### Backend não está buildando:

**Erro:** `npm ERR! missing script: build`

- **Solução:** Verifique que `package.json` tem script `"build": "tsc"`

**Erro:** `Cannot find module 'prisma'`

- **Solução:** Adicione `npx prisma generate` antes do build:

```bash
cd solution/backend && npm install && npx prisma generate && npm run build
```

### Database connection falhou:

**Erro:** `Can't reach database server`

- **Solução:**
  1. Verifique que DATABASE_URL está configurada corretamente
  2. Use a **Internal Database URL** (não External)
  3. Certifique-se que o formato é: `postgresql://user:pass@host:5432/dbname`

### Frontend não carrega dados:

**Erro:** `Network Error` ou `CORS policy`

- **Solução:**
  1. Verifique que `VITE_API_URL` aponta para backend correto
  2. Atualize `CORS_ORIGIN` no backend com URL do Vercel
  3. Redeploy do backend após mudar CORS

### CORS Error no browser:

**Erro:** `blocked by CORS policy`

- **Solução:** No Render backend, adicione a URL do Vercel em `CORS_ORIGIN`:

```
CORS_ORIGIN=https://your-app.vercel.app,https://another-domain.com
```

### Prisma migrations não aplicadas:

**Solução:** Conecte via PSQL e execute manualmente:

```bash
# Local:
psql [connection_string from Render]

# No psql:
\i /path/to/schema.sql
```

Ou via Prisma:

```bash
# No Render Shell:
cd solution/backend
npx prisma db push --accept-data-loss
```

---

## 🔄 Updates e Redeploy

### Para atualizar o código após mudanças:

**Backend (Render):**

1. Commit e push para GitHub:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

2. Render detecta automaticamente e redeploy

**Frontend (Vercel):**

1. Commit e push para GitHub:

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

2. Vercel detecta automaticamente e redeploy

### Para redeploy manual:

**Backend:** Render dashboard → Service → **Manual Deploy** → **"Deploy latest commit"**

**Frontend:** Vercel dashboard → Project → **Deployments** → **"Redeploy"**

---

## 📊 Monitoramento

### Logs do Backend (Render):

1. Vá em dashboard → `nola-backend` → **Logs**
2. Monitore erros em tempo real
3. Pesquise por timestamps específicos

### Logs do Frontend (Vercel):

1. Vá em dashboard → Projeto → **Deployments** → Clique em deployment
2. Veja **Build Logs** e **Function Logs**
3. Use browser DevTools para erros de client-side

### Métricas:

**Render Free Tier Limits:**

- 750 horas/mês (suficiente para testes)
- Dorme após 15 min de inatividade
- Primeira request pode levar 30-60s (cold start)

**Vercel Free Tier Limits:**

- 100 GB bandwidth/mês
- Deployments ilimitados
- Serverless functions: 100 GB-Hrs/mês

---

## 🔒 Segurança em Produção

### Checklist de Segurança:

- [ ] `JWT_SECRET` é uma string aleatória segura (32+ caracteres)
- [ ] `CORS_ORIGIN` está configurado com domínios específicos (não `*`)
- [ ] `DATABASE_URL` usa a Internal URL do Render
- [ ] Senhas de usuários são hasheadas (bcrypt)
- [ ] HTTPS está habilitado (automático no Render e Vercel)
- [ ] `.env` não está commitado no GitHub
- [ ] Variáveis sensíveis estão nas env vars do serviço

---

## 📝 URLs Finais

Após deploy completo, documente suas URLs:

- **Backend API:** `https://nola-backend.onrender.com`
- **Frontend App:** `https://nola-app.vercel.app`
- **Database:** `postgresql://...` (Internal URL do Render)

**Adicione ao README.md:**

```markdown
## 🌐 Live Demo

- **Aplicação:** https://nola-app.vercel.app
- **API:** https://nola-backend.onrender.com
- **Health Check:** https://nola-backend.onrender.com/health
```

---

## 🎉 Conclusão

Parabéns! Sua aplicação está em produção e acessível pela internet.

**Próximos passos:**

1. Teste todas as funcionalidades em produção
2. Grave o vídeo demo usando a versão deployed
3. Atualize documentação com URLs reais
4. Prepare email de submissão

**Para submissão, inclua:**

- Link do repositório GitHub
- Link do vídeo demo
- **Link do deploy funcionando** (URLs acima)
- Documento de decisões arquiteturais (ARCHITECTURE.md)

Boa sorte! 🚀
