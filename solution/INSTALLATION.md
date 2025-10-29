# 📦 Installation Instructions

Complete guide to install and run the Restaurant Analytics Platform.

## System Requirements

- **OS**: Windows 10+, macOS 10.15+, or Linux
- **Node.js**: 18.0 or higher
- **RAM**: 4GB minimum (8GB recommended)
- **Disk**: 2GB free space
- **Docker**: Latest version with Docker Compose

## Step 1: Verify Prerequisites

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check Docker
docker --version
docker-compose --version
```

If any command fails, install the missing software:

- Node.js: https://nodejs.org/
- Docker: https://www.docker.com/products/docker-desktop/

## Step 2: Clone Repository

```bash
git clone <repository-url>
cd nola-god-level-solution
```

## Step 3: Database Setup

### Start PostgreSQL

```bash
# Start database container
docker-compose up -d

# Verify it's running
docker-compose ps

# Check logs if needed
docker-compose logs postgres
```

Expected output:

```
NAME                IMAGE           STATUS
godlevel-db         postgres:15     Up (healthy)
```

### Generate Sample Data

This creates 500,000 sales records with realistic data:

```bash
docker-compose run --rm data-generator
```

This will take 2-5 minutes. You'll see progress bars and a final summary.

## Step 4: Backend Installation

```bash
cd solution/backend
```

### Install Dependencies

```bash
npm install
```

This installs:

- express (web framework)
- @prisma/client (database ORM)
- jsonwebtoken (authentication)
- bcryptjs (password hashing)
- cors (cross-origin requests)
- And development tools (TypeScript, tsx, etc.)

### Configure Environment

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` if needed (defaults work for local development):

```env
DATABASE_URL="postgresql://challenge:challenge_2024@localhost:5432/challenge_db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3001
NODE_ENV=development
```

### Generate Prisma Client

```bash
npm run prisma:generate
```

This generates TypeScript types from your database schema.

### Start Backend Server

```bash
npm run dev
```

Expected output:

```
🚀 Server running on http://localhost:3001
📊 API Documentation: http://localhost:3001/health
```

**Keep this terminal open!**

## Step 5: Frontend Installation

Open a **new terminal window**:

```bash
cd solution/frontend
```

### Install Dependencies

```bash
npm install
```

This installs:

- react & react-dom (UI framework)
- react-router-dom (routing)
- recharts (charts)
- zustand (state management)
- tailwindcss (styling)
- vite (build tool)
- TypeScript and other tools

### Configure Environment (Optional)

If your backend is not on `localhost:3001`, create a `.env` file:

```bash
echo "VITE_API_URL=http://your-backend-url/api" > .env
```

### Start Frontend Server

```bash
npm run dev
```

Expected output:

```
  VITE v6.0.1  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Keep this terminal open too!**

## Step 6: Verify Installation

### Test Backend

In a new terminal:

```bash
# Health check
curl http://localhost:3001/health

# Expected: {"status":"ok","timestamp":"..."}
```

### Test Database

```bash
# Connect to PostgreSQL
docker exec -it godlevel-db psql -U challenge -d challenge_db

# Inside psql:
SELECT COUNT(*) FROM sales;
# Expected: ~500000

# Exit psql
\q
```

### Test Frontend

1. Open browser to `http://localhost:3000`
2. You should see the login page
3. Open DevTools (F12) - no errors in console

## Step 7: Create Test Account

1. Go to `http://localhost:3000`
2. Click "Don't have an account? Register"
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
4. Click "Create Account"
5. You should be redirected to the dashboard

## Common Installation Issues

### Issue: "Cannot find module '@prisma/client'"

**Solution:**

```bash
cd solution/backend
npm run prisma:generate
```

### Issue: "EADDRINUSE: Port 3001 already in use"

**Solution:**

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3001 | xargs kill
```

Or change port in `backend/.env`:

```env
PORT=3002
```

### Issue: "Cannot connect to database"

**Solution:**

```bash
# Restart Docker containers
docker-compose down
docker-compose up -d

# Check if database is ready
docker-compose ps
```

### Issue: "ERR_OSSL_EVP_UNSUPPORTED" (Node.js error)

**Solution:**

```bash
# Use legacy OpenSSL provider
export NODE_OPTIONS=--openssl-legacy-provider

# Or upgrade to Node.js 18+
```

### Issue: "Module not found" in frontend

**Solution:**

```bash
cd solution/frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Data generator fails

**Solution:**

```bash
# Check database is running
docker-compose ps

# Try running generator again with verbose output
docker-compose run --rm data-generator
```

## Package Details

### Backend Dependencies

| Package           | Version | Purpose                |
| ----------------- | ------- | ---------------------- |
| @prisma/client    | ^5.20.0 | Type-safe database ORM |
| express           | ^4.19.2 | Web framework          |
| jsonwebtoken      | ^9.0.2  | JWT authentication     |
| bcryptjs          | ^2.4.3  | Password hashing       |
| cors              | ^2.8.5  | Cross-origin requests  |
| dotenv            | ^16.4.5 | Environment variables  |
| express-validator | ^7.2.0  | Input validation       |

### Frontend Dependencies

| Package          | Version  | Purpose             |
| ---------------- | -------- | ------------------- |
| react            | ^18.3.1  | UI framework        |
| react-router-dom | ^6.28.0  | Client-side routing |
| zustand          | ^5.0.1   | State management    |
| recharts         | ^2.13.3  | Data visualization  |
| tailwindcss      | ^3.4.15  | Utility-first CSS   |
| date-fns         | ^4.1.0   | Date utilities      |
| lucide-react     | ^0.454.0 | Icon library        |

## Development Scripts

### Backend

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Run production build
npm run prisma:generate  # Generate Prisma client
npm run prisma:studio    # Open database GUI
```

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Docker Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker-compose logs -f

# Generate data
docker-compose run --rm data-generator

# Connect to database
docker exec -it godlevel-db psql -U challenge -d challenge_db

# Start PgAdmin (optional)
docker-compose --profile tools up -d pgadmin
# Access at http://localhost:5050
```

## Production Build

### Backend

```bash
cd solution/backend
npm run build
npm start
```

### Frontend

```bash
cd solution/frontend
npm run build
# Output in dist/ directory
```

## Optional Tools

### Prisma Studio (Database GUI)

```bash
cd solution/backend
npm run prisma:studio
# Opens at http://localhost:5555
```

### PgAdmin (PostgreSQL GUI)

```bash
docker-compose --profile tools up -d pgadmin
# Access at http://localhost:5050
# Email: admin@godlevel.com
# Password: admin
```

## Clean Up

To completely remove everything:

```bash
# Stop all containers
docker-compose down

# Remove all data (WARNING: irreversible!)
docker-compose down -v

# Remove node_modules
cd solution/backend && rm -rf node_modules
cd solution/frontend && rm -rf node_modules
```

## Next Steps

After successful installation:

1. ✅ Read [README.md](./README.md) for feature overview
2. ✅ Check [ARCHITECTURE.md](./ARCHITECTURE.md) for design decisions
3. ✅ Follow [QUICKSTART.md](./QUICKSTART.md) for testing guide
4. ✅ Explore the dashboard and try different filters
5. ✅ Check API documentation in README

## Support

If you encounter issues not covered here:

1. Check GitHub Issues
2. Review error logs carefully
3. Try the troubleshooting steps above
4. Contact via Discord (challenge channel)

---

**Installation Time:** ~10 minutes (including data generation)

**Need help?** Open an issue or contact via Discord!
