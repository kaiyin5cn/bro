# URL Shortener Backend - Phase 1 ✅

## Quick Start

```bash
npm run setup    # One-command setup (installs deps, configures DB, runs tests)
npm run dev      # Start development server
```

## Features

- ✅ Base62 short code generation (7 characters)
- ✅ MongoDB with user authentication & validation
- ✅ Collision detection & retry mechanism
- ✅ Access count tracking
- ✅ Duplicate URL detection
- ✅ Comprehensive error handling
- ✅ Full test suite

## API Endpoints

**`POST /shorten`** - Create short URL
- Body: `{ "longURL": "https://example.com" }`
- Response: `{ "shortURL": "http://localhost:8828/abc1234" }`

**`GET /:shortCode`** - Redirect to original URL
- Redirects with 302 status code
- Increments access count
- Cache prevention headers

## Testing

```bash
# Unit tests
npm test

# Load testing
npm run load-test

# Manual API test
curl -X POST http://localhost:8828/shorten \
  -H "Content-Type: application/json" \
  -d '{"longURL": "https://www.google.com"}'
```

## Prerequisites

- Node.js 18+
- MongoDB running on localhost:27017