# Restaurant Analytics Frontend

Frontend application for the Restaurant Analytics Platform - God Level Coder Challenge

## 🚀 Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **State Management**: Zustand
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Date Utilities**: date-fns

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── client.ts          # API client with all endpoints
│   ├── components/
│   │   ├── Layout.tsx          # Main layout with navbar
│   │   ├── MetricCard.tsx      # Reusable metric display card
│   │   └── FilterBar.tsx       # Date and filter controls
│   ├── pages/
│   │   ├── LoginPage.tsx       # Login/Register page
│   │   └── DashboardPage.tsx   # Main dashboard with charts
│   ├── store/
│   │   ├── authStore.ts        # Auth state management
│   │   └── filterStore.ts      # Filter state management
│   ├── App.tsx                 # Main app with routing
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## 🛠️ Setup

1. **Install dependencies**:

```bash
cd frontend
npm install
```

2. **Configure environment** (optional):

```bash
# Create .env file if you need custom API URL
echo "VITE_API_URL=http://localhost:3001/api" > .env
```

3. **Start development server**:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🎨 Features

### Authentication

- Login and registration forms
- JWT token management
- Protected routes
- Auto-redirect to dashboard when authenticated

### Dashboard

- **KPI Cards**: Total revenue, orders, average ticket, production time
- **Growth Indicators**: Compare with previous period
- **Interactive Charts**:
  - Revenue and orders trend over time (line charts)
  - Top 10 products by revenue (bar chart)
  - Sales distribution by channel (pie chart)
- **Data Table**: Channel performance with detailed metrics
- **Responsive Design**: Works on mobile, tablet, and desktop

### Filters

- Date range selection (start/end date)
- Channel filter (iFood, Rappi, etc.)
- Store filter (by location)
- Reset filters button
- Filters persist in URL (planned)

### State Management

- **Auth Store**: User authentication state
- **Filter Store**: Global filter state with date utilities
- Automatic token persistence in localStorage
- Reactive data loading on filter changes

## 🎯 Key Components

### MetricCard

Reusable component for displaying KPIs with:

- Icon
- Value with automatic formatting (currency, number, time)
- Optional trend indicator with percentage
- Subtitle support

### FilterBar

Centralized filter controls:

- Date range pickers
- Dropdown selects for channels and stores
- Fetches available options from API
- Connected to global filter store

### Layout

Main application layout:

- Responsive navbar with logo
- User profile display
- Logout button
- Mobile-friendly hamburger menu

## 📊 Charts

All charts use **Recharts** library:

- **LineChart**: Trends over time
- **BarChart**: Product comparisons
- **PieChart**: Distribution by category
- Fully responsive with `ResponsiveContainer`
- Custom tooltips and legends
- Configurable colors from theme

## 🔐 API Integration

The app connects to the backend API through the `apiClient`:

```typescript
// Example usage
const overview = await apiClient.getOverview({
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  channelId: "1",
});
```

All API calls automatically include:

- JWT token in Authorization header
- Proper error handling
- TypeScript types for responses

## 🎨 Styling

Uses **TailwindCSS** with custom utilities:

- `.card` - White card with shadow and border
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.input` - Form input style
- `.label` - Form label style

Custom color palette with primary color (red theme).

## 📱 Responsive Design

- **Mobile**: Single column layout, hamburger menu
- **Tablet**: 2-column grid for charts
- **Desktop**: 4-column KPIs, 2-column charts

## 🚢 Production Build

```bash
npm run build
```

Output will be in `dist/` directory, ready for deployment.

## 🌐 Deployment

Recommended platforms:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Use `vite-plugin-gh-pages`

## 🔧 Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:3001/api)

## 🧪 Development Tips

1. **Hot Module Replacement**: Vite provides instant updates
2. **TypeScript**: Strict mode enabled for type safety
3. **Linting**: ESLint configured for React and TypeScript
4. **Date Formatting**: Use `date-fns` for consistent date handling
5. **State Debugging**: Zustand DevTools available in browser

## 📝 Future Enhancements

- Custom dashboard builder (drag & drop widgets)
- Export charts as images/PDF
- Real-time data updates with WebSockets
- Advanced filters (product categories, customer segments)
- Dashboard sharing and templates
- Dark mode support
