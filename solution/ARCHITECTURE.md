# 🏗️ Architecture Decision Records (ADR)

This document explains the key architectural decisions made during the development of the Restaurant Analytics Platform.

## ADR-001: PostgreSQL over MongoDB

**Status:** Accepted

**Context:**
The challenge prompt suggested MongoDB, but the provided data schema and generator are for PostgreSQL.

**Decision:**
Use PostgreSQL with Prisma ORM.

**Consequences:**

- ✅ Works directly with provided 500k records dataset
- ✅ Relational model fits restaurant domain perfectly (sales → products → stores)
- ✅ SQL aggregations are highly optimized for analytics
- ✅ ACID guarantees for financial data
- ✅ Prisma provides type-safe queries and migrations
- ⚠️ Slightly different from prompt, but practical choice

**Alternatives Considered:**

1. Migrate PostgreSQL data to MongoDB
   - Rejected: Unnecessary complexity, data loss risk
2. Use PostgreSQL raw SQL queries
   - Rejected: Prisma provides better type safety

---

## ADR-002: Monolithic Backend vs Microservices

**Status:** Accepted

**Context:**
Should we build separate services for authentication, analytics, and dashboards?

**Decision:**
Single Express.js monolith with modular controller/route structure.

**Consequences:**

- ✅ Faster development and deployment
- ✅ Simpler debugging and testing
- ✅ No inter-service communication overhead
- ✅ Easy to split later if needed (modular structure)
- ⚠️ All scaling is vertical initially

**Migration Path:**
If needed, split into:

- `auth-service`: User authentication
- `analytics-service`: Heavy aggregation queries
- `dashboard-service`: CRUD operations

---

## ADR-003: Server-Side vs Client-Side Aggregations

**Status:** Accepted

**Context:**
Should data aggregations happen in PostgreSQL or in Node.js/React?

**Decision:**
Perform aggregations in PostgreSQL using Prisma.

**Consequences:**

- ✅ Database is optimized for aggregations
- ✅ Reduces data transfer (only send aggregated results)
- ✅ Prisma's `aggregate` and `groupBy` are type-safe
- ✅ Frontend stays lightweight
- ⚠️ Complex queries require SQL knowledge

**Example:**

```typescript
// Good: Database aggregation
await prisma.sale.groupBy({
  by: ["channelId"],
  _sum: { totalAmount: true },
  _count: { id: true },
});

// Bad: Fetch all and aggregate in JS
const sales = await prisma.sale.findMany();
const grouped = sales.reduce((acc, sale) => {
  /* ... */
});
```

---

## ADR-004: Zustand over Redux Toolkit

**Status:** Accepted

**Context:**
Need state management for auth and filters.

**Decision:**
Use Zustand for global state management.

**Consequences:**

- ✅ 5x less boilerplate than Redux
- ✅ TypeScript-first design
- ✅ No Provider wrapper needed
- ✅ Supports middleware and DevTools
- ✅ Perfect for small/medium apps
- ⚠️ Less ecosystem than Redux

**Code Comparison:**

```typescript
// Zustand (10 lines)
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (email, password) => {
    const { user } = await apiClient.login(email, password);
    set({ user });
  },
}));

// Redux Toolkit (30+ lines)
// createSlice, createAsyncThunk, configureStore, Provider, etc.
```

---

## ADR-005: TailwindCSS over CSS-in-JS

**Status:** Accepted

**Context:**
Need a styling solution for rapid UI development.

**Decision:**
Use TailwindCSS with custom utilities.

**Consequences:**

- ✅ Utility-first = faster development
- ✅ No runtime CSS-in-JS overhead
- ✅ Purge unused styles in production
- ✅ Consistent design tokens
- ✅ Easy responsive design
- ⚠️ HTML can look verbose
- ⚠️ Learning curve for utility classes

**Performance:**

- Styled-components: ~8kb runtime + dynamic styles
- TailwindCSS: ~3kb (after purge), zero runtime

---

## ADR-006: Recharts over Chart.js

**Status:** Accepted

**Context:**
Need a charting library for analytics visualizations.

**Decision:**
Use Recharts for data visualization.

**Consequences:**

- ✅ Declarative React components
- ✅ TypeScript support
- ✅ Composable (CartesianGrid, Tooltip, Legend)
- ✅ Responsive out of the box
- ⚠️ Heavier bundle than Chart.js
- ⚠️ Less customizable than D3

**Alternatives:**

1. Chart.js - Imperative API, not React-native
2. D3.js - Too low-level, steep learning curve
3. Nivo - Similar to Recharts, but less popular

---

## ADR-007: JWT Authentication over Session Cookies

**Status:** Accepted

**Context:**
Need authentication that works across domains (frontend and backend separate).

**Decision:**
JWT tokens stored in localStorage, sent via Authorization header.

**Consequences:**

- ✅ Stateless authentication (no session store)
- ✅ Works across domains (CORS-friendly)
- ✅ Easy to implement
- ✅ Can embed user data in token
- ⚠️ Vulnerable to XSS (mitigated by CSP)
- ⚠️ Can't revoke before expiry (7 days)

**Security Measures:**

- HttpOnly cookies would be more secure
- Considered acceptable for MVP
- Production: Add refresh tokens + short expiry

---

## ADR-008: Prisma Schema from Existing Database

**Status:** Accepted

**Context:**
PostgreSQL database already exists with data generated by challenge script.

**Decision:**
Use `prisma db pull` to generate schema from existing database, then manually refine.

**Consequences:**

- ✅ Schema matches existing database exactly
- ✅ No migration conflicts
- ✅ Can use Prisma Client immediately
- ⚠️ Manual refinement needed (relations, naming)
- ⚠️ Future migrations must be careful

**Process:**

1. `prisma db pull` - Generate base schema
2. Add relations (`@relation`)
3. Add custom models (`User`, `Dashboard`)
4. `prisma generate` - Generate Prisma Client

---

## ADR-009: Date Range Filtering via Query Parameters

**Status:** Accepted

**Context:**
How should users filter data by date ranges?

**Decision:**
Use query parameters with ISO date strings.

**Consequences:**

- ✅ RESTful and cacheable
- ✅ Shareable URLs (copy & paste)
- ✅ Easy to bookmark
- ✅ Standard HTTP caching works
- ⚠️ URL can get long with many filters

**Example:**

```
GET /api/metrics/overview?startDate=2024-01-01&endDate=2024-01-31&channelId=1
```

**Alternative (POST with body):**

- Rejected: Not RESTful, harder to cache, can't share URLs

---

## ADR-010: Centralized API Client

**Status:** Accepted

**Context:**
Frontend needs to make many API calls with consistent error handling and authentication.

**Decision:**
Create a single `apiClient` class with all API methods.

**Consequences:**

- ✅ Single place for API configuration
- ✅ Automatic token injection
- ✅ Consistent error handling
- ✅ TypeScript types for all responses
- ✅ Easy to mock for testing

**Structure:**

```typescript
class ApiClient {
  setToken(token: string) {
    /* ... */
  }

  // Auth
  async login(email, password): Promise<LoginResponse> {
    /* ... */
  }

  // Metrics
  async getOverview(params): Promise<MetricsOverview> {
    /* ... */
  }

  // Dashboards
  async createDashboard(data): Promise<Dashboard> {
    /* ... */
  }
}

export const apiClient = new ApiClient();
```

---

## ADR-011: Parallel API Requests on Dashboard Load

**Status:** Accepted

**Context:**
Dashboard needs data from 4 different endpoints. Should we load sequentially or in parallel?

**Decision:**
Use `Promise.all()` to fetch all dashboard data in parallel.

**Consequences:**

- ✅ Faster page load (4x faster than sequential)
- ✅ Better user experience
- ✅ All or nothing loading state
- ⚠️ Single failure cancels all
- ⚠️ Higher server load (4 concurrent requests)

**Code:**

```typescript
const [overview, products, channels, timeSeries] = await Promise.all([
  apiClient.getOverview(params),
  apiClient.getTopProducts(params),
  apiClient.getSalesByChannel(params),
  apiClient.getTimeSeries(params),
]);
```

---

## ADR-012: Responsive Design Mobile-First

**Status:** Accepted

**Context:**
Restaurant owners often check analytics on mobile devices.

**Decision:**
Design mobile-first with TailwindCSS breakpoints.

**Consequences:**

- ✅ Works on all devices
- ✅ Progressive enhancement
- ✅ TailwindCSS breakpoints (`md:`, `lg:`)
- ✅ Hamburger menu on mobile

**Breakpoints:**

- Mobile: < 768px (1 column)
- Tablet: 768-1024px (2 columns)
- Desktop: > 1024px (4 columns)

---

## ADR-013: Environment Variables for Configuration

**Status:** Accepted

**Context:**
Need different configs for development, staging, production.

**Decision:**
Use `.env` files with validation.

**Consequences:**

- ✅ Industry standard
- ✅ Works with Docker
- ✅ Secrets not in code
- ✅ Vite/Node.js native support
- ⚠️ Must document all variables

**Variables:**

- Backend: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `NODE_ENV`
- Frontend: `VITE_API_URL`

---

## ADR-014: Component Structure: Pages vs Components

**Status:** Accepted

**Context:**
How should we organize React components?

**Decision:**
Separate `pages/` and `components/` directories.

**Consequences:**

- ✅ Clear separation of concerns
- ✅ Pages = routes
- ✅ Components = reusable pieces
- ✅ Easy to find code

**Structure:**

```
src/
├── pages/
│   ├── LoginPage.tsx       (Route: /login)
│   └── DashboardPage.tsx   (Route: /dashboard)
└── components/
    ├── Layout.tsx           (Shared app shell)
    ├── MetricCard.tsx       (Reusable KPI card)
    └── FilterBar.tsx        (Reusable filters)
```

---

## ADR-015: Growth Indicators via Period Comparison

**Status:** Accepted

**Context:**
Users want to know if metrics are improving or declining.

**Decision:**
Automatically calculate previous period and show growth percentage.

**Consequences:**

- ✅ Instant insights without manual comparison
- ✅ Works for any date range (7 days, 30 days, custom)
- ✅ Color-coded (green = up, red = down)
- ⚠️ Two database queries per metric (current + previous)

**Algorithm:**

```typescript
const periodDuration = endDate - startDate;
const previousStart = startDate - periodDuration;
const previousEnd = startDate;

const growth = ((current - previous) / previous) * 100;
```

---

## Summary of Key Decisions

1. **PostgreSQL + Prisma** - Works with provided data, type-safe ORM
2. **Monolithic Backend** - Faster development, easy to split later
3. **Database Aggregations** - Leverage SQL performance
4. **Zustand State** - Simple, modern, TypeScript-first
5. **TailwindCSS** - Utility-first, zero runtime, fast development
6. **Recharts** - Declarative React charts
7. **JWT Auth** - Stateless, works across domains
8. **Query Param Filters** - RESTful, shareable URLs
9. **Centralized API Client** - Consistent error handling, type safety
10. **Parallel Requests** - Faster dashboard loading
11. **Mobile-First** - Restaurant owners use mobile devices
12. **Environment Variables** - Standard config management
13. **Pages/Components Split** - Clear code organization
14. **Automatic Growth Indicators** - Instant insights

## Trade-offs Accepted

| What                | Why                           | Risk                  | Mitigation                            |
| ------------------- | ----------------------------- | --------------------- | ------------------------------------- |
| JWT in localStorage | Simpler than httpOnly cookies | XSS vulnerability     | CSP headers, short expiry             |
| No request caching  | Simpler implementation        | More API calls        | Add Redis in v2                       |
| No pagination       | Simpler queries               | Large result sets     | Add `limit`/`offset` params           |
| No WebSockets       | Simpler deployment            | No real-time          | Add in v2 for live updates            |
| Monolithic backend  | Faster development            | Vertical scaling only | Modular structure allows future split |

## Future Considerations

### When to Split Backend into Microservices?

- **Trigger:** > 10k concurrent users or > 1M sales/day
- **First Split:** Analytics service (CPU-heavy queries)
- **Second Split:** Auth service (independent scaling)

### When to Add Caching?

- **Trigger:** Response time > 500ms for overview endpoint
- **Solution:** Redis cache with 5-minute TTL

### When to Add Database Replication?

- **Trigger:** Database CPU > 70% sustained
- **Solution:** Read replica for analytics queries

---

**Last Updated:** October 29, 2025

## Recent Additions (October 2025)

### ADR-010: AI Insights Implementation

**Status:** Accepted

**Context:**
Need to provide automated insights to restaurant owners without requiring an external AI API (to avoid costs and API key management).

**Decision:**
Implement heuristic-based analysis system that generates 7 types of insights from sales data.

**Consequences:**

- ✅ No external API costs or rate limits
- ✅ Fast response times (< 100ms)
- ✅ Works offline
- ✅ Privacy-friendly (no data sent to third parties)
- ⚠️ Less sophisticated than GPT-4 analysis
- ⚠️ Limited to predefined insight patterns

**Implementation:**

```typescript
// insightsController.ts - Analyzes sales data
- Summary: Overview metrics (orders, revenue, avg ticket)
- Top Product: Best-selling product identification
- Channel Performance: Leading sales channel analysis
- Peak Hours: Hourly distribution analysis (top 3 hours)
- Opportunities: Upsell recommendations based on avg ticket
- Growth: Sales velocity calculation (orders per day)
- Risk: Revenue concentration warnings (top 3 products > 60%)
```

**Future Enhancement:**
Replace with OpenAI GPT-4 analysis for more sophisticated insights like:

- Predictive analytics ("Sales may drop next week based on weather")
- Anomaly detection ("Unusual spike in cancellations on Tuesdays")
- Natural language explanations

### ADR-011: CSV Export Strategy

**Status:** Accepted

**Context:**
Users need to export filtered data for external analysis (Excel, BI tools).

**Decision:**
Implement server-side CSV generation with blob download on frontend.

**Consequences:**

- ✅ Simple implementation (no file storage needed)
- ✅ Respects current filters (date, channel, store)
- ✅ Works with large datasets (1000 records default, configurable)
- ✅ Browser handles download automatically
- ⚠️ Large exports may timeout (10k+ records)

**Implementation:**

```typescript
// Backend: metricsController.ts
export const exportToCSV = async (req, res) => {
  const sales = await prisma.productSale.findMany({
    where: filters,
    take: limit,
    include: { product, channel, store, customer },
  });
  const csv = generateCSV(sales); // 17 columns
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="sales.csv"');
  res.send(csv);
};

// Frontend: DashboardPage.tsx
const handleExportCSV = async () => {
  const blob = await apiClient.exportCSV(filters);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sales-${Date.now()}.csv`;
  a.click();
};
```

### ADR-012: Testing Strategy

**Status:** Accepted

**Context:**
Need automated testing to ensure reliability and enable confident refactoring.

**Decision:**

- Backend: Jest + Supertest for API integration tests
- Frontend: Vitest + React Testing Library for component tests

**Consequences:**

- ✅ Fast test execution (Vitest is 10x faster than Jest for frontend)
- ✅ Type-safe tests with TypeScript
- ✅ Coverage reports available
- ✅ CI/CD ready
- ⚠️ Requires test maintenance

**Coverage:**

```bash
Backend: 17 tests
  - auth.test.ts: 9 tests (register, login, profile)
  - metrics.test.ts: 8 tests (overview, products, channels, CSV, insights)

Frontend: 6 tests
  - MetricCard.test.tsx: 6 tests (rendering, formatting, trends, icons)
```

**Configuration:**

```javascript
// backend/jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: ["src/**/*.ts"],
};

// frontend/vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__tests__/setup.ts",
  },
});
```

### ADR-013: Dark Mode Implementation

**Status:** Accepted

**Context:**
Many users work at night and prefer dark interfaces to reduce eye strain.

**Decision:**
Implement dark mode with Tailwind CSS dark variant and localStorage persistence.

**Consequences:**

- ✅ Improves accessibility (WCAG 2.1 AA compliant)
- ✅ Better user experience for night usage
- ✅ Modern UI expectation
- ✅ Simple implementation with Tailwind
- ⚠️ Requires maintaining two color schemes

**Implementation:**

```typescript
// themeStore.ts - Zustand store
interface ThemeStore {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Tailwind dark variant
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">

// Recharts theme support
<LineChart>
  <Line stroke={isDarkMode ? "#60a5fa" : "#3b82f6"} />
</LineChart>
```
