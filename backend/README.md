# URL Shortener Backend

## Quick Start

```bash
npm install      # Install dependencies
npm run dev      # Start development server
```

## Features

### Core URL Shortening
- ✅ Base62 short code generation (7 characters)
- ✅ MongoDB with connection pooling
- ✅ Redis caching layer
- ✅ Collision detection & retry mechanism
- ✅ Access count tracking
- ✅ Duplicate URL detection

### Admin Panel
- ✅ JWT authentication
- ✅ Paginated URL management (25/50/100 per page)
- ✅ Sortable columns (URL, shortCode, accessCount, createdAt)
- ✅ CRUD operations (Create, Read, Update, Delete)

### Blockchain Integration
- ✅ Ethereum donation tracking
- ✅ NFT minting for donations ≥ $100 USD
- ✅ Transaction history

### Performance & Testing
- ✅ Comprehensive test suite
- ✅ Load testing (Artillery + custom stress tests)
- ✅ Performance monitoring

## API Endpoints

### URL Shortening
**`POST /shorten`** - Create short URL
- Body: `{ "longURL": "https://example.com" }`
- Response: `{ "shortURL": "http://localhost:8828/abc1234" }`

**`GET /:shortCode`** - Redirect to original URL
- Redirects with 302 status code
- Increments access count

### Admin Panel
**`GET /admin/urls`** - Get paginated URLs (requires auth)
- Query: `?page=1&limit=25&sortField=createdAt&sortOrder=desc`

**`PUT /admin/urls/:id`** - Update URL (requires auth)
**`DELETE /admin/urls/:id`** - Delete URL (requires auth)

### Authentication
**`POST /auth/login`** - Admin login
**`POST /auth/register`** - Create admin user

### Donations
**`POST /donation/track`** - Track blockchain donation
**`GET /donation/history/:address`** - Get donation history

## Testing

```bash
# Unit & Integration tests
npm test
npm run test:controller
npm run test:shortcode

# Performance testing
npm run stress-test      # High RPS test
npm run load-test        # Artillery load test
npm run workflow-test    # End-to-end workflow
```

## Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Required variables:
MONGODB_URI=mongodb://localhost:27017/urlshortener
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
BASE_URL=http://localhost:8828
```

## Prerequisites

- Node.js 18+
- MongoDB running on localhost:27017
- Redis running on localhost:6379 (optional, graceful fallback)
- MetaMask for donation features (frontend)