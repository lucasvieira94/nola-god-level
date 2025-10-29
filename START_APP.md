# 🚀 Como Iniciar a Aplicação

## ⚡ Opção 1: Executar Script Automático (Windows)

**No Windows Explorer:**

1. Navegue até: `C:\Users\aclau\Documents\Atlas\god level coder challenge\nola-god-level-solution`
2. Dê duplo clique no arquivo **`start.bat`**
3. Aguarde as duas janelas abrirem (Backend e Frontend)
4. O navegador abrirá automaticamente em http://localhost:3000

---

## 🔧 Opção 2: Manual (Recomendado se Option 1 não funcionar)

### Terminal 1 - Backend

Abra um **novo terminal** (PowerShell ou Git Bash) e execute:

```bash
cd "C:\Users\aclau\Documents\Atlas\god level coder challenge\nola-god-level-solution\solution\backend"
npm run dev
```

**Aguarde ver:**

```
🚀 Server running on http://localhost:3001
✅ Database connected
```

---

### Terminal 2 - Frontend

Abra **outro terminal** (PowerShell ou Git Bash) e execute:

```bash
cd "C:\Users\aclau\Documents\Atlas\god level coder challenge\nola-god-level-solution\solution\frontend"
npm run dev
```

**Aguarde ver:**

```
VITE v6.4.1  ready in 500 ms

➜  Local:   http://localhost:3000/
```

---

### Terminal 3 - Abrir Navegador

Execute este comando OU abra manualmente no navegador:

```bash
start http://localhost:3000
```

---

## ✅ Verificar se está Funcionando

### 1. Testar API Backend

```bash
curl http://localhost:3001/health
# Deve retornar: {"status":"ok"}
```

OU abra no navegador: http://localhost:3001/health

### 2. Testar Frontend

Abra no navegador: http://localhost:3000

Você deve ver a **tela de login/registro**

---

## 🧪 Testar a Aplicação

1. **Registrar usuário:**

   - Clique em "Registrar"
   - Nome: `Teste`
   - Email: `teste@example.com`
   - Senha: `123456`
   - Clique "Criar Conta"

2. **Ver Dashboard:**

   - Após registro, você será redirecionado automaticamente
   - Deve ver **4 KPI cards** com valores
   - Deve ver **4 gráficos** (2 linhas, 1 barra, 1 pizza)
   - Deve ver **filtros** (data, canal, loja)

3. **Testar Filtros:**
   - Altere o período de datas
   - Selecione um canal específico
   - Selecione uma loja específica
   - Veja os gráficos atualizarem

---

## ❌ Problemas Comuns

### Erro: "Cannot GET /"

**Causa:** Frontend não iniciou corretamente

**Solução:**

```bash
cd solution/frontend
npm run dev
```

---

### Erro: "Network Error" ou "Failed to fetch"

**Causa:** Backend não está rodando

**Solução:**

```bash
cd solution/backend
npm run dev
```

---

### Erro: "Port 3001 already in use"

**Causa:** Backend já está rodando em outro terminal

**Solução:**

- Feche o outro terminal com backend
- OU encontre e mate o processo:

```bash
# Windows PowerShell
netstat -ano | findstr :3001
taskkill /PID <número> /F
```

---

### Erro: "Port 3000 already in use"

**Causa:** Frontend já está rodando

**Solução:**

- Use a porta alternativa que o Vite sugerir (ex: http://localhost:3001)
- OU mate o processo na porta 3000

---

## 🛑 Como Parar os Servidores

### No terminal onde estão rodando:

Pressione `Ctrl + C`

### Ou feche as janelas do terminal

---

## 📊 Status Esperado

Quando tudo estiver funcionando:

✅ **Backend:** http://localhost:3001

- Health check: http://localhost:3001/health → `{"status":"ok"}`

✅ **Frontend:** http://localhost:3000

- Dashboard: http://localhost:3000 → Tela de login/registro

✅ **Database:** PostgreSQL

- 563,319 vendas carregadas

---

## 🎯 Comandos Rápidos de Referência

```bash
# Backend
cd solution/backend
npm run dev              # Modo desenvolvimento
npm run build            # Build produção
npm run start            # Rodar build produção
npm run prisma:studio    # Abrir GUI do banco

# Frontend
cd solution/frontend
npm run dev              # Modo desenvolvimento
npm run build            # Build produção
npm run preview          # Preview do build

# Database
"C:/Program Files/PostgreSQL/15/bin/psql.exe" -U postgres -d nola_challenge
# Dentro do psql:
SELECT COUNT(*) FROM sales;  # Ver total de vendas
\dt                          # Listar tabelas
\q                           # Sair
```

---

## 💡 Dicas

1. **Use PowerShell** se Git Bash estiver com problemas
2. **Mantenha os terminais abertos** enquanto usa a aplicação
3. **Verifique os logs** nos terminais se algo não funcionar
4. **Ctrl+C** para parar os servidores quando terminar

---

## 📹 Pronto para o Vídeo?

Quando tudo estiver funcionando:

1. ✅ Registre um usuário
2. ✅ Navegue pelo dashboard
3. ✅ Teste os filtros
4. ✅ Grave seu vídeo demo!

**Boa sorte! 🚀**
