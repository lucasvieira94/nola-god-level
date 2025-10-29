# Restaurant Analytics Backend

Backend API for the Restaurant Analytics Platform - God Level Coder Challenge

## 🚀 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   └── database.ts        # Prisma client config
│   ├── controllers/
│   │   ├── authController.ts  # Auth endpoints
│   │   ├── metricsController.ts # Analytics endpoints
│   │   └── dashboardController.ts # Dashboard CRUD
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication
│   ├── routes/
│   │   ├── auth.ts            # Auth routes
│   │   ├── metrics.ts         # Metrics routes
│   │   └── dashboards.ts      # Dashboard routes
│   └── index.ts               # App entry point
├── .env.example
├── package.json
└── tsconfig.json
```

## 🛠️ Setup

1. **Install dependencies**:

```bash
cd backend
npm install
```

2. **Configure environment**:

```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Generate Prisma Client**:

```bash
npm run prisma:generate
```

4. **Start development server**:

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (protected)

### Metrics (All protected)

- `GET /api/metrics/overview` - Revenue, orders, growth
- `GET /api/metrics/top-products` - Best selling products
- `GET /api/metrics/sales-by-channel` - Sales grouped by channel
- `GET /api/metrics/sales-by-store` - Sales grouped by store
- `GET /api/metrics/heatmap` - Hourly/daily sales heatmap
- `GET /api/metrics/time-series` - Time series data (groupBy: hour/day/week/month)
- `GET /api/metrics/categories` - Sales by category
- `GET /api/metrics/filters` - Get available filters (channels, stores, categories)

### Dashboards (Protected)

- `POST /api/dashboards` - Create dashboard
- `GET /api/dashboards` - List user dashboards
- `GET /api/dashboards/:id` - Get specific dashboard
- `PUT /api/dashboards/:id` - Update dashboard
- `DELETE /api/dashboards/:id` - Delete dashboard
- `GET /api/dashboards/shared/:shareToken` - Get shared dashboard (public)

## 🔍 Query Parameters

Most metric endpoints support the following filters:

- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)
- `channelId` - Filter by channel
- `storeId` - Filter by store
- `limit` - Limit results (for top products)
- `groupBy` - Time grouping (hour/day/week/month) for time-series

Example:

```
GET /api/metrics/overview?startDate=2024-01-01&endDate=2024-01-31&channelId=1
```

## 🔐 Authentication

Protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🗄️ Database

The application uses Prisma ORM to connect to the PostgreSQL database provided in the challenge. Make sure the database is running (via docker-compose from the root directory) before starting the backend.

## 📝 Environment Variables

```env
DATABASE_URL="postgresql://challenge:challenge_2024@localhost:5432/challenge_db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3001
NODE_ENV=development
```

## 🧪 Testing

Start the database and generate sample data:

```bash
# From root directory
docker-compose up -d
docker-compose run --rm data-generator
```

Then test the API:

```bash
# Health check
curl http://localhost:3001/health

# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

## 🚢 Production Build

```bash
npm run build
npm start
```

## 📚 Additional Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
