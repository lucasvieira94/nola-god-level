# 🍔 Plataforma de Analytics para Restaurantes - God Level Coder Challenge

> **Power BI para Restaurantes** - Uma plataforma de analytics customizável que empodera donos de restaurantes a explorarem seus dados operacionais através de dashboards e visualizações intuitivas.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológica](#stack-tecnológica)
- [Arquitetura](#arquitetura)
- [Primeiros Passos](#primeiros-passos)
- [Documentação da API](#documentação-da-api)
- [Deploy](#deploy)
- [Decisões de Design](#decisões-de-design)

## 🎯 Visão Geral

Esta solução aborda um problema crítico enfrentado por donos de restaurantes: **dados existem mas insights não**. Maria, nossa persona, gerencia 3 restaurantes através de 5 canais (iFood, Rappi, WhatsApp, presencial, app) mas não consegue responder perguntas cruciais como:

- "Qual produto vende melhor nas quintas à noite via iFood?"
- "Meu ticket médio está caindo? Qual canal é o responsável?"
- "Quais clientes compraram 3+ vezes mas não retornaram nos últimos 30 dias?"

### A Solução

Uma plataforma de analytics especializada que permite aos donos de restaurantes:

1. ✅ **Explorar dados livremente** - Filtrar por canal, loja, período sem ajuda de desenvolvedores
2. ✅ **Visualizar métricas** - Receita, pedidos, top produtos, tendências ao longo do tempo
3. ✅ **Comparar períodos** - Indicadores automáticos de crescimento vs período anterior
4. ✅ **Criar dashboards personalizados** - Salvar visões personalizadas (melhoria futura)
5. ✅ **Compartilhar insights** - Links de dashboard compartilháveis (API pronta)

## ✨ Funcionalidades

### Implementadas

- **Sistema de Autenticação**

  - Autenticação baseada em JWT com hash seguro de senhas
  - Login/Registro com validação
  - Rotas protegidas e renovação automática de token

- **Dashboard Geral**

  - Cards KPI: Receita total, pedidos, ticket médio, tempo de produção
  - Indicadores de crescimento comparando período atual vs anterior
  - Design responsivo (mobile, tablet, desktop)
  - Suporte a **modo escuro** com transições suaves

- **Analytics Interativa**

  - Tendência de receita e pedidos (gráficos de linha)
  - Top 10 produtos por receita (gráfico de barras)
  - Distribuição de vendas por canal (gráfico de pizza)
  - Tabela detalhada de performance por canal

- **Filtragem Avançada**

  - Seleção de período (data início/fim)
  - Filtro por canal (iFood, Rappi, etc.)
  - Filtro por loja/localização
  - Filtros aplicam globalmente a todas as visualizações

- **Insights com IA** 🤖

  - Análise automática dos dados de vendas
  - 7 tipos de insights: Visão Geral, Produto Top, Performance de Canal, Horários de Pico, Oportunidades, Crescimento, Riscos
  - Indicadores visuais baseados em prioridade (Alta, Média, Baixa)
  - Atualização dinâmica conforme mudança de filtros

- **Exportação de Dados**

  - **Exportação CSV** - Download de dados de vendas filtrados
  - Inclui todos os detalhes da venda (produto, canal, cliente, preços, tempos)
  - Respeita os filtros atuais (período, canal, loja)

- **Acessibilidade**

  - Compatível com WCAG 2.1 AA
  - Suporte a navegação por teclado
  - Compatível com leitores de tela (labels ARIA)
  - Compatível com modo de alto contraste

- **Testes Automatizados**

  - Backend: 17 testes automatizados (Jest + Supertest)
  - Frontend: 6 testes de componentes (Vitest + React Testing Library)
  - Relatórios de cobertura de testes disponíveis

- **Agregações de Dados (API)**
  - Vendas por canal, loja, categoria
  - Dados de série temporal (hora/dia/semana/mês)
  - Mapa de calor por hora para análise de horários de pico
  - Ranking de produtos mais vendidos
  - Geração de insights com IA

### Pronto na API (Ainda não na Interface)

- CRUD de dashboards personalizados
- Compartilhamento de dashboard via tokens
- Visualização de mapa de calor por hora
- Analytics por nível de categoria

## 🛠️ Stack Tecnológica

### Frontend

- **React 18** - Framework moderno de UI
- **TypeScript** - Segurança de tipos e melhor experiência de desenvolvimento
- **Vite** - Ferramenta de build ultra-rápida
- **TailwindCSS** - Estilização utility-first
- **Recharts** - Biblioteca declarativa de gráficos
- **Zustand** - Gerenciamento de estado leve
- **React Router v6** - Roteamento client-side
- **date-fns** - Utilitários para manipulação de datas
- **Lucide React** - Biblioteca moderna de ícones
- **Vitest** - Framework de testes unitários rápido
- **React Testing Library** - Utilitários para teste de componentes

### Backend

- **Node.js 18+** - Ambiente de execução
- **Express.js** - Framework web
- **TypeScript** - Backend type-safe
- **Prisma** - ORM type-safe
- **PostgreSQL** - Banco de dados relacional (fornecido pelo desafio)
- **JWT** - Autenticação segura
- **bcrypt** - Hash de senhas
- **express-validator** - Validação de entrada
- **Jest** - Framework de testes
- **Supertest** - Biblioteca para testes de API

### Infraestrutura

- **Docker** - Containerização do banco de dados
- **Vercel** - Hospedagem do frontend (recomendado)
- **Render/Railway** - Hospedagem do backend (recomendado)

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────┐      HTTPS/REST      ┌─────────────┐      SQL      ┌──────────────┐
│   React     │ ◄──────────────────► │  Express    │ ◄──────────► │  PostgreSQL  │
│   Frontend  │      JSON/JWT        │   Backend   │    Prisma     │   Database   │
└─────────────┘                       └─────────────┘               └──────────────┘
     │                                       │
     │ State Management                      │ Business Logic
     ▼                                       ▼
┌─────────────┐                       ┌─────────────┐
│   Zustand   │                       │ Controllers │
│   Stores    │                       │  Services   │
└─────────────┘                       └─────────────┘
```

### Backend Architecture

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema (maps to PostgreSQL)
├── src/
│   ├── config/
│   │   └── database.ts        # Prisma client configuration
│   ├── controllers/
│   │   ├── authController.ts  # Login, register, profile
│   │   ├── metricsController.ts # Analytics aggregations + CSV export
│   │   ├── insightsController.ts # AI-powered insights generation
│   │   └── dashboardController.ts # Dashboard CRUD
│   ├── middleware/
│   │   └── auth.ts            # JWT verification
│   ├── routes/
│   │   ├── auth.ts            # Auth endpoints
│   │   ├── metrics.ts         # Metrics + Insights endpoints
│   │   └── dashboards.ts      # Dashboard endpoints
│   ├── __tests__/
│   │   ├── auth.test.ts       # Authentication tests (9 tests)
│   │   └── metrics.test.ts    # Metrics API tests (8 tests)
│   └── index.ts               # Express app setup
├── jest.config.js             # Jest configuration
└── package.json
```

### Frontend Architecture

```
frontend/
├── src/
│   ├── api/
│   │   └── client.ts          # Centralized API client (with CSV & Insights)
│   ├── components/
│   │   ├── Layout.tsx          # App shell with navbar
│   │   ├── MetricCard.tsx      # Reusable KPI card
│   │   ├── FilterBar.tsx       # Global filters
│   │   ├── InsightsCard.tsx    # AI insights display
│   │   └── ThemeToggle.tsx     # Dark mode toggle
│   ├── pages/
│   │   ├── LoginPage.tsx       # Authentication page
│   │   └── DashboardPage.tsx   # Main analytics page with CSV export
│   ├── store/
│   │   ├── authStore.ts        # Authentication state
│   │   ├── filterStore.ts      # Filter state (dates, channel, store)
│   │   └── themeStore.ts       # Dark mode state
│   ├── __tests__/
│   │   ├── setup.ts            # Test configuration
│   │   └── MetricCard.test.tsx # Component tests (6 tests)
│   ├── App.tsx                 # Router configuration
│   └── main.tsx                # React entry point
├── vitest.config.ts            # Vitest configuration
└── package.json
```

### Data Flow

1. **User Authentication**

   ```
   User → Login Form → API (/api/auth/login) → JWT Token → LocalStorage → Zustand Store
   ```

2. **Dashboard Data Loading**

   ```
   User Changes Filter → Zustand Store → API Client → Multiple Parallel Requests
   → /api/metrics/overview
   → /api/metrics/top-products
   → /api/metrics/sales-by-channel
   → /api/metrics/time-series
   → /api/metrics/insights (AI-powered analysis)
   → React State Update → Recharts Re-render + Insights Display
   ```

3. **Database Queries**
   ```
   API Endpoint → Controller → Prisma Client → PostgreSQL Aggregate Query → JSON Response
   ```

## 🚀 Primeiros Passos

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Git

### Instalação

1. **Clone o repositório**

   ```bash
   git clone <repository-url>
   cd nola-god-level-solution
   ```

2. **Inicie o banco de dados PostgreSQL**

   ```bash
   docker-compose up -d
   ```

3. **Gere dados de exemplo** (500k registros de vendas)

   ```bash
   docker-compose run --rm data-generator
   ```

4. **Configure o Backend**

   ```bash
   cd solution/backend
   npm install
   cp .env.example .env
   npm run prisma:generate
   npm run dev
   ```

   Backend roda em `http://localhost:3001`

5. **Configure o Frontend**

   ```bash
   cd solution/frontend
   npm install
   npm run dev
   ```

   Frontend roda em `http://localhost:3000`

6. **Acesse a aplicação**
   - Abra `http://localhost:3000`
   - Registre uma nova conta
   - Explore o dashboard!

## 📊 Documentação da API

### URL Base

```
http://localhost:3001/api
```

### Endpoints de Autenticação

#### POST /auth/register

Registra uma nova conta de usuário.

**Requisição:**

```json
{
  "email": "maria@restaurant.com",
  "password": "secure123",
  "name": "Maria Silva"
}
```

**Resposta:**

```json
{
  "user": {
    "id": 1,
    "email": "maria@restaurant.com",
    "name": "Maria Silva"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/login

Login em conta existente.

**Requisição:**

```json
{
  "email": "maria@restaurant.com",
  "password": "secure123"
}
```

**Resposta:** Mesma do registro

#### GET /auth/profile

Obtém perfil do usuário atual (requer autenticação).

**Headers:**

```
Authorization: Bearer <token>
```

### Endpoints de Métricas (Todos requerem autenticação)

#### GET /metrics/overview

Obtém métricas gerais com indicadores de crescimento.

**Parâmetros de Query:**

- `startDate` (opcional): Data inicial (YYYY-MM-DD)
- `endDate` (opcional): Data final (YYYY-MM-DD)
- `channelId` (opcional): Filtrar por ID do canal
- `storeId` (opcional): Filtrar por ID da loja

**Resposta:**

```json
{
  "currentPeriod": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  },
  "metrics": {
    "totalRevenue": 125430.5,
    "totalOrders": 1250,
    "averageTicket": 100.34,
    "totalDiscount": 5420.0,
    "averageProductionTime": 720,
    "averageDeliveryTime": 1800
  },
  "growth": {
    "revenueGrowth": 12.5,
    "ordersGrowth": 8.3
  }
}
```

#### GET /metrics/top-products

Obtém produtos mais vendidos.

**Parâmetros de Query:**

- Todos do `/overview` mais:
- `limit` (opcional): Número de produtos (padrão: 10)

**Resposta:**

```json
[
  {
    "productId": 42,
    "productName": "X-Bacon Burger",
    "categoryName": "Burgers",
    "totalQuantity": 345,
    "totalRevenue": 8625.0
  }
]
```

#### GET /metrics/sales-by-channel

Obtém vendas agregadas por canal.

**Resposta:**

```json
[
  {
    "channelId": 1,
    "channelName": "iFood",
    "channelType": "D",
    "totalRevenue": 45230.5,
    "totalOrders": 450,
    "averageTicket": 100.51
  }
]
```

#### GET /metrics/time-series

Obtém dados de série temporal para gráficos.

**Parâmetros de Query:**

- Todos do `/overview` mais:
- `groupBy` (opcional): hour | day | week | month (padrão: day)

**Resposta:**

```json
[
  {
    "date": "2024-01-01",
    "orders": 45,
    "revenue": 4523.5
  }
]
```

#### GET /metrics/filters

Get available filter options (channels, stores, categories).

**Response:**

```json
{
  "channels": [{ "id": 1, "name": "iFood", "type": "D" }],
  "stores": [
    { "id": 1, "name": "Store Central", "city": "São Paulo", "state": "SP" }
  ],
  "categories": [{ "id": 1, "name": "Burgers" }]
}
```

#### GET /metrics/export-csv

Export filtered sales data as CSV file.

**Query Parameters:**

- All from `/overview` (startDate, endDate, channelId, storeId)
- `limit` (optional): Number of records (default: 1000)

**Response:** CSV file download with columns:

```
Sale ID, Date, Time, Channel, Store, Customer, Product, Category,
Quantity, Base Price, Final Price, Discount, Production Time, Delivery Time
```

#### GET /metrics/insights

Get AI-generated insights from sales data analysis.

**Query Parameters:**

- All from `/overview` (startDate, endDate, channelId, storeId)

**Response:**

```json
{
  "insights": [
    {
      "type": "summary",
      "icon": "📊",
      "title": "Performance Overview",
      "description": "You've processed 1,250 orders generating R$ 125,430.50 in revenue.",
      "priority": "high",
      "data": {
        "orders": 1250,
        "revenue": 125430.5,
        "avgTicket": 100.34
      }
    },
    {
      "type": "top_product",
      "icon": "🏆",
      "title": "Best Selling Product",
      "description": "X-Bacon Burger is your star product with 345 units sold.",
      "priority": "high",
      "data": {
        "productName": "X-Bacon Burger",
        "quantity": 345,
        "revenue": 8625.0
      }
    },
    {
      "type": "peak_hours",
      "icon": "⏰",
      "title": "Peak Hours Identified",
      "description": "Your busiest hours are: 19h (89 orders), 20h (85 orders), 18h (78 orders)",
      "priority": "medium",
      "data": {
        "peakHours": [
          { "hour": 19, "orders": 89 },
          { "hour": 20, "orders": 85 },
          { "hour": 18, "orders": 78 }
        ]
      }
    }
  ]
}
```

**Insight Types:**

- `summary`: Performance overview
- `top_product`: Best-selling product
- `channel_performance`: Leading sales channel
- `peak_hours`: Busiest hours
- `opportunity`: Upsell recommendations
- `growth`: Sales velocity trends
- `risk`: Revenue concentration warnings

### Endpoints de Dashboard

#### POST /dashboards

Cria um dashboard personalizado.

**Requisição:**

```json
{
  "name": "Meu Dashboard Personalizado",
  "description": "Revisão semanal de performance",
  "layout": {
    "widgets": [{ "type": "revenue-chart", "position": { "x": 0, "y": 0 } }]
  },
  "isPublic": false
}
```

#### GET /dashboards/:id

Obtém dashboard por ID.

#### PUT /dashboards/:id

Atualiza dashboard.

#### DELETE /dashboards/:id

Deleta dashboard.

#### GET /dashboards/shared/:shareToken

Obtém dashboard público compartilhado (não requer autenticação).

## 🚢 Deploy

### Deploy Rápido

**Guia completo de deploy disponível:** Veja [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) para instruções passo a passo.

### Frontend (Vercel)

1. Conecte o repositório ao Vercel
2. Configure as opções de build:
   - Build Command: `cd solution/frontend && npm install && npm run build`
   - Output Directory: `solution/frontend/dist`
   - Install Command: `npm install`
3. Variáveis de Ambiente:
   - `VITE_API_URL`: URL da API do backend
4. Deploy!

**Alternativa:** Use `vercel.json` na raiz para configuração automatizada.

### Backend (Render)

1. Crie um novo Web Service
2. Conecte o repositório
3. Configure:
   - Build Command: `cd solution/backend && npm install && npm run build`
   - Start Command: `cd solution/backend && npm start`
4. Variáveis de Ambiente:
   - `DATABASE_URL`: String de conexão PostgreSQL
   - `JWT_SECRET`: Chave secreta aleatória (gere com `openssl rand -base64 32`)
   - `CORS_ORIGIN`: URL do seu frontend (ex: https://yourapp.vercel.app)
   - `PORT`: 3001 (ou use o padrão do Render)
   - `NODE_ENV`: production
5. Adicione o addon PostgreSQL
6. Execute as migrations: `npx prisma migrate deploy`
7. Deploy!

**Alternativa:** Use `render.yaml` na raiz para Infrastructure as Code.

### Banco de Dados

- **Render PostgreSQL**: Tier gratuito disponível
- **Railway PostgreSQL**: Tier gratuito generoso
- **Supabase**: PostgreSQL com dashboard
- **Neon**: PostgreSQL serverless

### Testando Antes do Deploy

```bash
# Testes do backend
cd solution/backend
npm test

# Testes do frontend
cd solution/frontend
npm test

# Verificação de build
cd solution/backend && npm run build
cd solution/frontend && npm run build
```

Veja [`TESTING.md`](./TESTING.md) para documentação completa de testes.

## 🧠 Decisões de Design

### Por que PostgreSQL ao invés de MongoDB?

**Decisão:** Usar PostgreSQL com Prisma ORM
**Justificativa:**

- Desafio forneceu schema PostgreSQL com 500k registros
- Modelo de dados relacional se encaixa nas operações de restaurantes (vendas → produtos → categorias)
- Prisma fornece queries type-safe e migrations
- Agregações SQL são mais performáticas para queries analíticas

### Por que Zustand ao invés de Redux?

**Decisão:** Usar Zustand para gerenciamento de estado
**Justificativa:**

- API mais simples, menos boilerplate
- Design TypeScript-first
- Perfeito para apps pequenos/médios
- Não precisa de context provider
- Ainda suporta DevTools

### Por que Express ao invés de NestJS?

**Decisão:** Usar Express com TypeScript
**Justificativa:**

- Mais rápido para prototipar
- Curva de aprendizado menor
- Suficiente para CRUD + agregações
- Fácil de escalar com routers adicionais
- NestJS seria exagero para o escopo atual

### Filosofia de Design da API

**RESTful + Query Parameters**

- Endpoints simples e previsíveis
- Filtragem via query params (não POST bodies)
- Formatos de resposta consistentes
- JWT no header Authorization

**Exemplo:**

```
GET /api/metrics/overview?startDate=2024-01-01&channelId=1
```

### Otimizações de Performance

1. **Banco de Dados**

   - Índices em chaves estrangeiras (Prisma cuida disso)
   - Queries de agregação no nível do banco
   - Apenas `SELECT` dos campos necessários

2. **API**

   - Requisições paralelas para carregamento de dados do dashboard
   - Suporte a paginação (parâmetro limit)
   - Queries eficientes do Prisma com `include` e `select`

3. **Frontend**
   - Code splitting com React Router
   - Zustand para re-renders eficientes
   - Recharts ResponsiveContainer para gráficos responsivos
   - date-fns para operações eficientes com datas

### Medidas de Segurança

- ✅ Expiração de token JWT (7 dias)
- ✅ Hash de senhas com bcrypt (10 rounds)
- ✅ Validação de entrada com express-validator
- ✅ Prevenção de SQL injection (queries parametrizadas do Prisma)
- ✅ Configuração de CORS
- ✅ Rotas protegidas (middleware)
- ⚠️ **TODO Produção**: Rate limiting, apenas HTTPS, validação de env

### Considerações de Escalabilidade

**Carga Atual:** 500k registros de vendas, usuário único
**Carga Futura:** 10k+ restaurantes, milhões de vendas

**Estratégias:**

1. **Banco de Dados**

   - Particionamento por data (tabela de vendas)
   - Read replicas para analytics
   - Connection pooling (Prisma já suporta)

2. **Caching**

   - Redis para queries frequentes (métricas de overview)
   - CDN para assets do frontend
   - Headers de cache HTTP

3. **Arquitetura**
   - Separate analytics worker service
   - Event-driven updates (WebSockets)
   - Microservices for scale (analytics vs CRUD)

### Por que esta Stack Tecnológica?

| Tecnologia  | Alternativa        | Por que foi Escolhida                      |
| ----------- | ------------------ | ------------------------------------------ |
| React       | Vue, Angular       | Padrão da indústria, ecossistema enorme    |
| TypeScript  | JavaScript         | Segurança de tipos, melhor DX, menos bugs  |
| Vite        | Webpack, CRA       | Builds 10x mais rápidos, DX moderna        |
| TailwindCSS | Styled-components  | Utility-first, sem overhead de CSS-in-JS   |
| Recharts    | Chart.js, D3       | Nativo do React, declarativo, boa docs     |
| Prisma      | TypeORM, Sequelize | Melhor ORM TypeScript da categoria         |
| Express     | Fastify, Koa       | Testado em batalha, ecossistema enorme     |
| PostgreSQL  | MySQL, MongoDB     | ACID, agregações poderosas, suporte a JSON |

## 📝 Melhorias Futuras

### Fase 2 (Próximas 2 semanas)

- [x] ~~Modo escuro~~ ✅ **Implementado**
- [x] ~~Exportar gráficos como CSV~~ ✅ **Implementado**
- [x] ~~Insights com IA~~ ✅ **Implementado**
- [x] ~~Testes automatizados~~ ✅ **Implementado** (17 backend + 6 frontend)
- [ ] Construtor de dashboard personalizado (drag & drop)
- [ ] Exportar gráficos como PNG/PDF
- [ ] Visualização de mapa de calor por hora
- [ ] Análise de segmentação de clientes
- [ ] Visão de comparação entre lojas

### Fase 3 (Próximo mês)

- [ ] Atualizações em tempo real com WebSockets
- [ ] Insights de IA aprimorados com OpenAI API
- [ ] Relatórios automatizados via email
- [ ] App mobile (React Native)
- [ ] Suporte multi-idioma (i18n)

### Fase 4 (Longo prazo)

- [ ] Multi-tenancy (múltiplas marcas de restaurantes)
- [ ] Controle de acesso baseado em função (gerente vs dono)
- [ ] Integração com sistemas POS
- [ ] Analytics preditiva (modelos ML)
- [ ] Bot do WhatsApp para insights rápidos

## 🤝 Contribuindo

Esta é uma submissão para o desafio, mas feedback é bem-vindo!

## 📄 Licença

Licença MIT - sinta-se livre para usar como referência para seus próprios projetos.

## 👨‍💻 Autor

Criado para o **God Level Coder Challenge** da Nola (2025)

---

**Dúvidas?** Abra uma issue ou entre em contato via Discord do desafio.

**Vídeo Demo:** [Link do vídeo demo - a ser adicionado após gravação]

**Demo ao Vivo:** [Link da aplicação deployada - a ser adicionado após deployment]
