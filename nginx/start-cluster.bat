@echo off
echo Starting URL Shortener Cluster...

REM Install PM2 globally if not installed
where pm2 >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing PM2...
    npm install -g pm2
)

REM Start PM2 cluster
echo Starting PM2 instances...
pm2 start ecosystem.config.js

REM Show status
pm2 status

echo.
echo Cluster started successfully!
echo Backend instances running on ports: 8828, 8829, 8830, 8831
echo.
echo Next steps:
echo 1. Install and start NGINX with the provided nginx.conf
echo 2. Configure NGINX to proxy to http://localhost:80
echo 3. Test load balancing: curl http://localhost/health
echo.
echo To stop cluster: pm2 stop all
echo To restart cluster: pm2 restart all
echo To view logs: pm2 logs