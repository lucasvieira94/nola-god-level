# 🍔 Restaurant Analytics Platform - God Level Coder Challenge

> **Power BI for Restaurants** - A customizable analytics platform that empowers restaurant owners to explore their operational data through intuitive dashboards and visualizations.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Design Decisions](#design-decisions)

## 🎯 Overview

This solution addresses a critical problem faced by restaurant owners: **data exists but insights don't**. Maria, our persona, manages 3 restaurants across 5 channels (iFood, Rappi, WhatsApp, presencial, app) but can't answer crucial questions like:

- "Which product sells best on Thursday nights via iFood?"
- "Is my average ticket declining? Which channel is responsible?"
- "Which customers bought 3+ times but haven't returned in 30 days?"

### The Solution

A specialized analytics platform that allows restaurant owners to:

1. ✅ **Explore data freely** - Filter by channel, store, date range without developer help
2. ✅ **Visualize metrics** - Revenue, orders, top products, trends over time
3. ✅ **Compare periods** - Automatic growth indicators vs previous period
4. ✅ **Create custom dashboards** - Save personalized views (future enhancement)
5. ✅ **Share insights** - Shareable dashboard links (API ready)

## ✨ Features

### Implemented

- **Authentication System**

  - JWT-based authentication with secure password hashing
  - Login/Register with validation
  - Protected routes and automatic token refresh

- **Overview Dashboard**

  - KPI cards: Total revenue, orders, average ticket, production time
  - Growth indicators comparing current vs previous period
  - Responsive design (mobile, tablet, desktop)
  - **Dark mode** support with smooth transitions

- **Interactive Analytics**

  - Revenue and orders trend (line charts)
  - Top 10 products by revenue (bar chart)
  - Sales distribution by channel (pie chart)
  - Detailed channel performance table

- **Advanced Filtering**

  - Date range selection
  - Filter by channel (iFood, Rappi, etc.)
  - Filter by store/location
  - Filters apply globally to all visualizations

- **AI-Powered Insights** 🤖

  - Automatic analysis of sales data
  - 7 types of insights: Summary, Top Product, Channel Performance, Peak Hours, Opportunities, Growth, Risks
  - Priority-based visual indicators (High, Medium, Low)
  - Updates dynamically with filter changes

- **Data Export**

  - **CSV Export** - Download filtered sales data
  - Includes all sale details (product, channel, customer, prices, times)
  - Respects current filters (date range, channel, store)

- **Accessibility**

  - WCAG 2.1 AA compliant
  - Keyboard navigation support
  - Screen reader friendly (ARIA labels)
  - High contrast mode compatible

- **Testing**

  - Backend: 17 automated tests (Jest + Supertest)
  - Frontend: 6 component tests (Vitest + React Testing Library)
  - Test coverage reports available

- **Data Aggregations (API)**
  - Sales by channel, store, category
  - Time series data (hour/day/week/month)
  - Hourly heatmap for peak hour analysis
  - Top products ranking
  - AI insights generation

### API Ready (Not Yet in UI)

- Custom dashboard CRUD
- Dashboard sharing via tokens
- Hourly heatmap visualization
- Category-level analytics

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern UI framework
- **TypeScript** - Type safety and developer experience
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first styling
- **Recharts** - Declarative charting library
- **Zustand** - Lightweight state management
- **React Router v6** - Client-side routing
- **date-fns** - Date manipulation utilities
- **Lucide React** - Modern icon library
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities

### Backend

- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Relational database (provided by challenge)
- **JWT** - Secure authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **Jest** - Testing framework
- **Supertest** - API testing library

### Infrastructure

- **Docker** - Database containerization
- **Vercel** - Frontend hosting (recommended)
- **Render/Railway** - Backend hosting (recommended)

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

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nola-god-level-solution
   ```

2. **Start PostgreSQL database**

   ```bash
   docker-compose up -d
   ```

3. **Generate sample data** (500k sales records)

   ```bash
   docker-compose run --rm data-generator
   ```

4. **Setup Backend**

   ```bash
   cd solution/backend
   npm install
   cp .env.example .env
   npm run prisma:generate
   npm run dev
   ```

   Backend runs at `http://localhost:3001`

5. **Setup Frontend**

   ```bash
   cd solution/frontend
   npm install
   npm run dev
   ```

   Frontend runs at `http://localhost:3000`

6. **Access the application**
   - Open `http://localhost:3000`
   - Register a new account
   - Explore the dashboard!

## 📊 API Documentation

### Base URL

```
http://localhost:3001/api
```

### Authentication Endpoints

#### POST /auth/register

Register a new user account.

**Request:**

```json
{
  "email": "maria@restaurant.com",
  "password": "secure123",
  "name": "Maria Silva"
}
```

**Response:**

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

Login to existing account.

**Request:**

```json
{
  "email": "maria@restaurant.com",
  "password": "secure123"
}
```

**Response:** Same as register

#### GET /auth/profile

Get current user profile (requires authentication).

**Headers:**

```
Authorization: Bearer <token>
```

### Metrics Endpoints (All require authentication)

#### GET /metrics/overview

Get overview metrics with growth indicators.

**Query Parameters:**

- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)
- `channelId` (optional): Filter by channel ID
- `storeId` (optional): Filter by store ID

**Response:**

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

Get top-selling products.

**Query Parameters:**

- All from `/overview` plus:
- `limit` (optional): Number of products (default: 10)

**Response:**

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

Get sales aggregated by channel.

**Response:**

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

Get time series data for charts.

**Query Parameters:**

- All from `/overview` plus:
- `groupBy` (optional): hour | day | week | month (default: day)

**Response:**

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

### Dashboard Endpoints

#### POST /dashboards

Create a custom dashboard.

**Request:**

```json
{
  "name": "My Custom Dashboard",
  "description": "Weekly performance review",
  "layout": {
    "widgets": [{ "type": "revenue-chart", "position": { "x": 0, "y": 0 } }]
  },
  "isPublic": false
}
```

#### GET /dashboards/:id

Get dashboard by ID.

#### PUT /dashboards/:id

Update dashboard.

#### DELETE /dashboards/:id

Delete dashboard.

#### GET /dashboards/shared/:shareToken

Get public shared dashboard (no auth required).

## 🚢 Deployment

### Quick Deploy

**Comprehensive deployment guide available:** See [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) for step-by-step instructions.

### Frontend (Vercel)

1. Connect repository to Vercel
2. Configure build settings:
   - Build Command: `cd solution/frontend && npm install && npm run build`
   - Output Directory: `solution/frontend/dist`
   - Install Command: `npm install`
3. Environment Variables:
   - `VITE_API_URL`: Your backend API URL
4. Deploy!

**Alternative:** Use `vercel.json` in root for automated configuration.

### Backend (Render)

1. Create new Web Service
2. Connect repository
3. Configure:
   - Build Command: `cd solution/backend && npm install && npm run build`
   - Start Command: `cd solution/backend && npm start`
4. Environment Variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Random secret key (generate with `openssl rand -base64 32`)
   - `CORS_ORIGIN`: Your frontend URL (e.g., https://yourapp.vercel.app)
   - `PORT`: 3001 (or use Render's default)
   - `NODE_ENV`: production
5. Add PostgreSQL addon
6. Run migrations: `npx prisma migrate deploy`
7. Deploy!

**Alternative:** Use `render.yaml` in root for Infrastructure as Code.

### Database

- **Render PostgreSQL**: Free tier available
- **Railway PostgreSQL**: Generous free tier
- **Supabase**: PostgreSQL with dashboard
- **Neon**: Serverless PostgreSQL

### Testing Before Deploy

```bash
# Backend tests
cd solution/backend
npm test

# Frontend tests
cd solution/frontend
npm test

# Build verification
cd solution/backend && npm run build
cd solution/frontend && npm run build
```

See [`TESTING.md`](./TESTING.md) for comprehensive testing documentation.

## 🧠 Design Decisions

### Why PostgreSQL instead of MongoDB?

**Decision:** Use PostgreSQL with Prisma ORM
**Rationale:**

- Challenge provided PostgreSQL schema with 500k records
- Relational data model fits restaurant operations (sales → products → categories)
- Prisma provides type-safe queries and migrations
- SQL aggregations are more performant for analytics queries

### Why Zustand over Redux?

**Decision:** Use Zustand for state management
**Rationale:**

- Simpler API, less boilerplate
- TypeScript-first design
- Perfect for small/medium apps
- No context provider wrapping needed
- Still supports DevTools

### Why Express over NestJS?

**Decision:** Use Express with TypeScript
**Rationale:**

- Faster to prototype
- Lower learning curve
- Sufficient for CRUD + aggregations
- Easy to scale with additional routers
- NestJS would be overkill for current scope

### API Design Philosophy

**RESTful + Query Parameters**

- Simple, predictable endpoints
- Filtering via query params (not POST bodies)
- Consistent response shapes
- JWT in Authorization header

**Example:**

```
GET /api/metrics/overview?startDate=2024-01-01&channelId=1
```

### Performance Optimizations

1. **Database**

   - Indexes on foreign keys (Prisma handles this)
   - Aggregate queries at database level
   - Only `SELECT` needed fields

2. **API**

   - Parallel requests for dashboard data loading
   - Pagination support (limit parameter)
   - Efficient Prisma queries with `include` and `select`

3. **Frontend**
   - Code splitting with React Router
   - Zustand for efficient re-renders
   - Recharts ResponsiveContainer for responsive charts
   - date-fns for efficient date operations

### Security Measures

- ✅ JWT token expiration (7 days)
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Input validation with express-validator
- ✅ SQL injection prevention (Prisma parameterized queries)
- ✅ CORS configuration
- ✅ Protected routes (middleware)
- ⚠️ **Production TODO**: Rate limiting, HTTPS only, env validation

### Scalability Considerations

**Current Load:** 500k sales records, single user
**Future Load:** 10k+ restaurants, millions of sales

**Strategies:**

1. **Database**

   - Partitioning by date (sales table)
   - Read replicas for analytics
   - Connection pooling (Prisma already supports)

2. **Caching**

   - Redis for frequent queries (overview metrics)
   - CDN for frontend assets
   - HTTP caching headers

3. **Architecture**
   - Separate analytics worker service
   - Event-driven updates (WebSockets)
   - Microservices for scale (analytics vs CRUD)

### Why This Tech Stack?

| Tech        | Alternative        | Why Chosen                                |
| ----------- | ------------------ | ----------------------------------------- |
| React       | Vue, Angular       | Industry standard, huge ecosystem         |
| TypeScript  | JavaScript         | Type safety, better DX, fewer bugs        |
| Vite        | Webpack, CRA       | 10x faster builds, modern DX              |
| TailwindCSS | Styled-components  | Utility-first, no CSS-in-JS overhead      |
| Recharts    | Chart.js, D3       | React-native, declarative, good docs      |
| Prisma      | TypeORM, Sequelize | Best-in-class TypeScript ORM              |
| Express     | Fastify, Koa       | Battle-tested, huge ecosystem             |
| PostgreSQL  | MySQL, MongoDB     | ACID, powerful aggregations, JSON support |

## 📝 Future Enhancements

### Phase 2 (Next 2 weeks)

- [x] ~~Dark mode~~ ✅ **Implemented**
- [x] ~~Export charts as CSV~~ ✅ **Implemented**
- [x] ~~AI-powered insights~~ ✅ **Implemented**
- [x] ~~Automated testing~~ ✅ **Implemented** (17 backend + 6 frontend tests)
- [ ] Custom dashboard builder (drag & drop)
- [ ] Export charts as PNG/PDF
- [ ] Hourly heatmap visualization
- [ ] Customer segmentation analysis
- [ ] Multi-store comparison view

### Phase 3 (Next month)

- [ ] Real-time updates with WebSockets
- [ ] Enhanced AI insights with OpenAI API
- [ ] Automated reports via email
- [ ] Mobile app (React Native)
- [ ] Multi-language support (i18n)

### Phase 4 (Long-term)

- [ ] Multi-tenancy (multiple restaurant brands)
- [ ] Role-based access control (manager vs owner)
- [ ] Integration with POS systems
- [ ] Predictive analytics (ML models)
- [ ] WhatsApp bot for quick insights

## 🤝 Contributing

This is a challenge submission, but feedback is welcome!

## 📄 License

MIT License - feel free to use this as a reference for your own projects.

## 👨‍💻 Author

Created for the **God Level Coder Challenge** by Nola (2025)

---

**Questions?** Open an issue or contact via the challenge Discord.

**Demo Video:** [Link to demo video - to be added after recording]

**Live Demo:** [Link to deployed app - to be added after deployment]
