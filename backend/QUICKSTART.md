# URL Shortener - Quick Start

## One-Command Setup

```bash
npm run setup
```

This single command will:
- ✅ Install all dependencies
- ✅ Create .env file from template
- ✅ Setup MongoDB user and indexes
- ✅ Run tests to verify everything works

## Start Development

```bash
npm run dev
```

## Test the API

```bash
# Shorten a URL
curl -X POST http://localhost:8828/shorten \
  -H "Content-Type: application/json" \
  -d '{"longURL": "https://www.google.com"}'

# Use the returned short URL (will redirect)
curl -L http://localhost:8828/abc1234
```

## Prerequisites

- Node.js 18+
- MongoDB running on localhost:27017

That's it! 🚀