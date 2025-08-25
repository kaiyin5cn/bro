# URL Shortener Backend - Phase 1

## Setup

1. Install MongoDB locally
2. Install dependencies: `npm install`
3. Start the server: `npm run dev`

## API Endpoints

- `POST /shorten` - Create short URL
  - Body: `{ "longURL": "https://example.com" }`
  - Response: `{ "shortURL": "http://localhost:3000/abc123" }`

- `GET /:shortURL` - Redirect to original URL
  - Redirects with 301 status code

## Testing

```bash
# Shorten a URL
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"longURL": "https://www.google.com"}'

# Access the short URL (will redirect)
curl -L http://localhost:3000/1
```