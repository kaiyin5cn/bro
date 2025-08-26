# NGINX Load Balancer Setup

## Overview
This configuration sets up NGINX as a reverse proxy load balancer for the URL shortener backend, distributing traffic across 4 Node.js instances running on ports 8828-8831.

## Features
- **Load Balancing**: Least-connection algorithm across 4 backend instances
- **Health Checks**: Automatic failover with health monitoring
- **Rate Limiting**: API protection with different limits per endpoint
- **Security Headers**: XSS protection, frame options, content type sniffing prevention
- **Compression**: Gzip compression for better performance
- **Monitoring**: NGINX status page on port 8080

## Quick Start

### 1. Start Backend Cluster
```bash
# From nginx directory
start-cluster.bat
```

### 2. Install NGINX (Windows)
Download from: https://nginx.org/en/download.html
Extract to `C:\nginx`

### 3. Configure NGINX
```bash
# Copy configuration
copy nginx.conf C:\nginx\conf\nginx.conf

# Start NGINX
C:\nginx\nginx.exe
```

### 4. Test Load Balancer
```bash
# Health check
curl http://localhost/health

# Test API
curl -X POST http://localhost/shorten -H "Content-Type: application/json" -d "{\"longURL\":\"https://example.com\"}"
```

## Configuration Details

### Backend Instances
- **Port 8828**: Primary instance
- **Port 8829**: Secondary instance  
- **Port 8830**: Tertiary instance
- **Port 8831**: Quaternary instance

### Rate Limits
- **General API**: 100 requests/second per IP
- **URL Shortening**: 10 requests/second per IP (stricter)
- **Burst Handling**: Allows temporary spikes

### Health Monitoring
- **Endpoint**: `/health`
- **Failover**: 3 failed attempts = 30s timeout
- **Recovery**: Automatic when instance becomes healthy

## Management Commands

### PM2 Cluster Management
```bash
pm2 status              # View all instances
pm2 logs                # View logs
pm2 restart all         # Restart all instances
pm2 stop all           # Stop all instances
pm2 delete all         # Remove all instances
```

### NGINX Management
```bash
# Windows
C:\nginx\nginx.exe -s reload    # Reload configuration
C:\nginx\nginx.exe -s stop      # Stop NGINX

# Check configuration
C:\nginx\nginx.exe -t
```

## Monitoring

### NGINX Status
- **URL**: http://localhost:8080/nginx_status
- **Access**: Localhost only
- **Metrics**: Active connections, requests, handled connections

### PM2 Monitoring
```bash
pm2 monit              # Real-time monitoring
pm2 logs --lines 100   # Recent logs
```

## Performance Expectations
- **Capacity**: 1,000-5,000 requests/second
- **Latency**: Sub-100ms response times
- **Availability**: High availability with automatic failover
- **Scalability**: Easy to add more backend instances

## Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure ports 8828-8831 are available
2. **NGINX not starting**: Check configuration with `nginx -t`
3. **Backend not responding**: Check PM2 status and logs
4. **Rate limiting**: Adjust limits in nginx.conf if needed

### Log Locations
- **PM2 logs**: `./logs/` directory
- **NGINX logs**: `C:\nginx\logs\` (default)
- **Application logs**: Console output via PM2