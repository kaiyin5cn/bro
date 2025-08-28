# URL Shortener with Blockchain Integration

## Abstract

A full-stack URL shortener application that combines web technologies with blockchain functionality. The system provides URL shortening services with an administrative dashboard, enhanced by Ethereum blockchain integration for donation tracking and NFT rewards. Features analytics, caching, and testing suites.

**Key Features:**
- **URL Shortening**: Link shortening with collision detection
- **Admin Dashboard**: CRUD operations with pagination and sorting
- **Blockchain Integration**: Ethereum donations with NFT minting
- **Performance**: Redis caching, connection pooling, load testing
- **Security**: JWT authentication, input validation, XSS protection

## Functionality & Tools

### Backend Architecture
| Component | Technology | Purpose |
|-----------|------------|----------|
| **Web Framework** | Express.js | RESTful API server with middleware support |
| **Database** | MongoDB + Mongoose | Document storage with ODM for URL data |
| **Caching** | Redis | Caching for frequent lookups |
| **Authentication** | JWT + bcryptjs | Token-based admin authentication |
| **Blockchain** | Ethers.js | Ethereum integration for donations and NFTs |
| **Testing** | Jest + Supertest | Unit, integration, and API testing |
| **Load Testing** | Artillery + Custom Scripts | Performance testing and analysis |
| **Logging** | Winston | Structured logging with multiple transports |

### Frontend Architecture
| Component | Technology | Purpose |
|-----------|------------|----------|
| **Framework** | React 19 + TypeScript | UI with type safety |
| **Build Tool** | Vite | Development and builds |
| **Routing** | React Router DOM | Client-side navigation |
| **HTTP Client** | Axios | API communication with error handling |
| **Web3 Integration** | Ethers.js + MetaMask | Blockchain wallet connectivity |
| **Icons** | React Icons | Iconography |
| **Styling** | CSS Modules | Component-scoped styling |

### Core Functionalities

#### 1. URL Shortening Engine
- **Algorithm**: Base62 encoding (7-character codes)
- **Collision Detection**: Batch generation with database validation
- **Duplicate Prevention**: Existing URL detection and reuse
- **Analytics**: Access count tracking with Redis caching

#### 2. Admin Management System
- **Authentication**: JWT-based secure login
- **CRUD Operations**: Create, read, update, delete URLs
- **Data Visualization**: Paginated tables with sorting
- **Real-time Updates**: Live data synchronization

#### 3. Blockchain Integration
- **Smart Contracts**: Ethereum donation contract
- **NFT Rewards**: Automatic minting for donations ≥ $100 USD
- **Transaction Tracking**: Real-time status monitoring
- **Wallet Integration**: MetaMask connectivity

## Quick Start

```bash
# Backend setup
cd backend
npm run setup        # Install deps + configure + test
npm run dev          # Start server on port 8828

# Frontend setup (new terminal)
cd frontend
npm run setup        # Install deps + configure
npm run dev          # Start server on port 5173
```

**Access:** http://localhost:5173 | **Admin:** http://localhost:5173/admin

## Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0.0
- npm >= 8.0.0
- MetaMask (for blockchain features)

## Detailed Setup

### Backend Setup

#### 1. Automated Setup
```bash
cd backend
npm run setup        # Install dependencies + configure environment + run tests
# OR
npm run setup:auth   # Install dependencies + create admin user
```

#### 2. Manual Environment Configuration (if needed)
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
nano .env
```

**Required Environment Variables:**
```env
# Server Configuration
PORT=8828
BASE_URL=http://localhost:8828

# Database
MONGODB_URI=mongodb://localhost:27017/urlshortener

# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Redis (Optional - graceful fallback if unavailable)
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=true

# Blockchain (Optional)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
NFT_CONTRACT_ADDRESS=0xYourContractAddress
MINTER_PRIVATE_KEY=your-private-key-for-minting
```

#### 3. Start Backend Server
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start

# Verify server is running
curl http://localhost:8828/health
```

### Frontend Setup

#### 1. Automated Setup
```bash
cd frontend
npm run setup        # Install dependencies + configure environment
```

#### 2. Manual Environment Configuration (if needed)
```bash
# Copy environment template
cp .env.example .env

# Edit .env file
nano .env
```

**Required Environment Variables:**
```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8828

# Development server port
PORT=5173
```

#### 3. Start Frontend Server
```bash
# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Verification & Testing

#### 1. Access Applications
```bash
# Frontend application
open http://localhost:5173

# Admin dashboard
open http://localhost:5173/admin

# Backend API health check
curl http://localhost:8828/health
```

#### 2. Test Core Functionality
```bash
# Backend tests
cd backend
npm test                    # Unit tests
npm run test:controller     # Controller tests
npm run stress-test         # Performance test

# Frontend functionality
cd frontend
npm run build              # Verify build works
npm run lint               # Code quality check
```

#### 3. Test API Endpoints
```bash
# Shorten a URL
curl -X POST http://localhost:8828/shorten \
  -H "Content-Type: application/json" \
  -d '{"longURL": "https://www.google.com"}'

# Test redirect (replace 'abc1234' with actual short code)
curl -I http://localhost:8828/abc1234
```

### Production Deployment

#### Environment Setup
```bash
# Backend production environment
NODE_ENV=production
PORT=8828
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/urlshortener
REDIS_URL=redis://your-redis-instance:6379
JWT_SECRET=your-production-secret-key
BASE_URL=https://your-domain.com

# Frontend production build
npm run build
# Deploy dist/ folder to your hosting service
```

#### Performance Optimization
```bash
# Backend clustering
PM2_INSTANCES=max npm start

# Frontend CDN deployment
# Upload build files to CDN
```

### Troubleshooting

#### Common Issues
```bash
# MongoDB connection failed
mongosh $MONGODB_URI

# Redis connection failed (non-critical)
redis-cli ping

# Port already in use
npx kill-port 8828  # Backend
npx kill-port 5173  # Frontend

# Clear dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Performance Issues
```bash
# Run load tests
cd backend
npm run load-test
npm run stress-test

# Monitor MongoDB
mongosh --eval "db.runCommand({serverStatus: 1})"

# Check Redis
redis-cli info stats
```

### Available Scripts

#### Backend
- `npm run setup` - Full setup (deps + env + MongoDB + tests)
- `npm run setup:auth` - Setup + create admin user
- `npm run dev` - Development server with hot reload
- `npm test` - Run unit tests
- `npm run load-test` - Performance testing

#### Frontend
- `npm run setup` - Install dependencies + configure environment
- `npm run dev` - Development server with hot reload
- `npm run build` - Production build
- `npm run preview` - Preview production build

### Default Credentials

- **Admin Username**: `admin`
- **Admin Password**: `admin123`
- **Change in production**

### Application URLs

- **Frontend**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5173/admin
- **Backend API**: http://localhost:8828
- **Health Check**: http://localhost:8828/health