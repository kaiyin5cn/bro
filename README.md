# URL Shortener

A full-stack URL shortener application built with Node.js, Express.js, MongoDB, and React/TypeScript.

## Development Server Deployment

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v6.0 or higher)
- **npm** (comes with Node.js)

### Quick Start (Automated Setup)

#### Option 1: Full Setup with Authentication
```bash
# Clone and navigate to project
cd bro

# Backend setup with admin user creation
cd backend
npm run setup:auth    # Installs dependencies + creates admin user
npm run dev          # Starts backend server on port 8828

# Frontend setup (in new terminal)
cd ../frontend
npm run setup        # Installs dependencies + configures environment
npm run dev         # Starts frontend server on port 5173
```

#### Option 2: Basic Setup
```bash
# Backend
cd backend
npm run setup       # Installs dependencies + configures MongoDB
npm run dev

# Frontend (new terminal)
cd frontend
npm run setup
npm run dev
```

### Manual Setup (Step-by-Step)

#### Backend Configuration
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file:
```env
PORT=8828
MONGODB_URI=mongodb://localhost:27017/urlshortener
BASE_URL=http://localhost:8828
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

```bash
# Create admin user (optional)
node scripts/create-admin.js

# Start development server
npm run dev
```

#### Frontend Configuration
```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8828
PORT=5173
```

```bash
# Start development server
npm run dev
```

### Development Server URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8828
- **Admin Dashboard**: http://localhost:5173/admin

### Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

### Available Scripts

#### Backend Scripts
- `npm run setup` - Full development setup
- `npm run setup:auth` - Setup with admin user creation
- `npm run dev` - Start development server with hot reload
- `npm run start` - Start production server
- `npm test` - Run unit tests
- `npm run load-test` - Run performance tests

#### Frontend Scripts
- `npm run setup` - Install dependencies and configure environment
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Variables

#### Backend (.env)
- `PORT` - Server port (default: 8828)
- `MONGODB_URI` - MongoDB connection string
- `BASE_URL` - Base URL for shortened links
- `JWT_SECRET` - Secret key for JWT token generation
- `DB_NAME` - Database name (default: urlshortener)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password

#### Frontend (.env)
- `VITE_API_BASE_URL` - Backend API URL
- `PORT` - Frontend development server port (default: 5173)

### Troubleshooting

#### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh --eval "db.runCommand('ping')"

# Start MongoDB (if installed locally)
mongod --dbpath /path/to/your/db
```

#### Port Already in Use
```bash
# Kill process on port 8828 (backend)
npx kill-port 8828

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

#### Clear Node Modules
```bash
# Backend
cd backend && rm -rf node_modules package-lock.json && npm install

# Frontend
cd frontend && rm -rf node_modules package-lock.json && npm install
```

### Development Features

- **Hot Reload** - Both frontend and backend support hot reloading
- **CORS Enabled** - Cross-origin requests configured for development
- **JWT Authentication** - Secure admin authentication system
- **MongoDB TTL** - Automatic URL expiration (7 days)
- **Load Testing** - Built-in performance testing with Artillery
- **Error Handling** - Comprehensive error responses and logging