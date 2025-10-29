# 🚀 Quick Start Guide

Get the Restaurant Analytics Platform running in 5 minutes!

## Prerequisites

Make sure you have these installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)

## Step-by-Step Setup

### 1. Clone and Navigate

```bash
git clone <your-repo-url>
cd nola-god-level-solution
```

### 2. Start PostgreSQL Database

```bash
# Start the database container
docker-compose up -d

# Wait for it to be healthy (about 10 seconds)
docker-compose ps
```

You should see:

```
NAME                IMAGE               STATUS
godlevel-db        postgres:15         Up (healthy)
```

### 3. Generate Sample Data

This creates 500,000 sales records (takes 2-5 minutes):

```bash
docker-compose run --rm data-generator
```

You should see progress updates and a final summary.

### 4. Setup Backend

Open a new terminal:

```bash
cd solution/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Generate Prisma client
npm run prisma:generate

# Start the server
npm run dev
```

You should see:

```
🚀 Server running on http://localhost:3001
```

### 5. Setup Frontend

Open another terminal:

```bash
cd solution/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

You should see:

```
  VITE ready in X ms

  ➜  Local:   http://localhost:3000/
```

### 6. Access the Application

1. Open your browser to `http://localhost:3000`
2. Click "Don't have an account? Register"
3. Create an account:
   - Name: Maria Silva
   - Email: maria@restaurant.com
   - Password: 123456
4. Click "Create Account"
5. You'll be redirected to the dashboard! 🎉

## What You'll See

### Dashboard Features:

- **4 KPI Cards** - Revenue, Orders, Avg Ticket, Production Time
- **Growth Indicators** - Compare with previous period
- **Revenue Trend Chart** - Line chart over time
- **Orders Trend Chart** - Track order volume
- **Top 10 Products** - Best sellers by revenue
- **Sales by Channel** - Pie chart (iFood, Rappi, etc.)
- **Channel Performance Table** - Detailed breakdown

### Try These Filters:

- Change date range (top of page)
- Filter by channel (iFood, Rappi, WhatsApp)
- Filter by store location
- Click "Reset" to clear filters

## Verify Everything Works

### Check Backend Health

```bash
curl http://localhost:3001/health
```

Should return:

```json
{ "status": "ok", "timestamp": "2024-10-28T..." }
```

### Check Database

```bash
docker exec -it godlevel-db psql -U challenge -d challenge_db -c "SELECT COUNT(*) FROM sales;"
```

Should show around 500,000 rows.

### Check Frontend

Open browser DevTools (F12), go to Console. You should see no errors.

## Troubleshooting

### Database Connection Failed

**Problem:** Backend can't connect to PostgreSQL

**Solution:**

```bash
# Stop everything
docker-compose down

# Start fresh
docker-compose up -d

# Check status
docker-compose ps
```

### Port Already in Use

**Problem:** "Port 3000 already in use"

**Solution:**

```bash
# Find what's using the port (Windows)
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or change the port in vite.config.ts:
# server: { port: 3002 }
```

### Prisma Client Not Generated

**Problem:** "Cannot find module '@prisma/client'"

**Solution:**

```bash
cd solution/backend
npm run prisma:generate
```

### Missing Dependencies

**Problem:** "Cannot find module '...'"

**Solution:**

```bash
# Backend
cd solution/backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd solution/frontend
rm -rf node_modules package-lock.json
npm install
```

### Data Generator Fails

**Problem:** "Error generating data"

**Solution:**

```bash
# Make sure database is healthy
docker-compose ps

# Try again with logs
docker-compose run --rm data-generator
```

## Quick Test Checklist

- [ ] Database running (`docker-compose ps`)
- [ ] 500k sales records in database
- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] Can register new account
- [ ] Dashboard loads with charts
- [ ] Filters work (date, channel, store)
- [ ] No errors in browser console

## Next Steps

Once everything is running:

1. **Explore the data** - Try different date ranges and filters
2. **Check the API** - Visit `http://localhost:3001/health`
3. **Read the docs** - Check `README.md` for detailed documentation
4. **Watch the demo** - [Link to demo video]
5. **Deploy it** - Follow deployment guide in README

## Need Help?

- Check the full [README.md](./README.md)
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for design decisions
- Open an issue on GitHub
- Contact via Discord (challenge channel)

## Clean Up

To stop everything and free up disk space:

```bash
# Stop all containers
docker-compose down

# Remove volumes (WARNING: deletes all data!)
docker-compose down -v

# Stop frontend and backend
# Press Ctrl+C in both terminal windows
```

---

**Time to Working Dashboard:** ~5 minutes 🚀

**Have fun exploring your restaurant data!** 🍔📊
