# Load Testing

This folder contains performance and load testing tools for the URL shortener.

## Files

- `stress-test.js` - Simple stress test with configurable RPS
- `run-load-test.js` - Advanced load test runner
- `load-test.yml` - Load test configuration
- `test-urls.csv` - URL dataset for testing

## Usage

```bash
# Run stress test
npm run stress-test

# Run load test
npm run load-test
```

## Configuration

Edit the constants in `stress-test.js`:
- `REQUESTS_PER_SECOND` - Number of requests per second
- `DURATION_SECONDS` - Test duration
- `testUrls` - Array of URLs to test with

## Test URLs

The stress test now includes 25 common websites to provide realistic testing scenarios.