@echo off
chcp 65001 >nul
echo Starting NGINX Load Balancer...

start /B "" "C:\nginx\nginx.exe" -c "C:\Users\IT\Downloads\ky\bro\nginx\nginx.conf"

timeout /t 2 /nobreak >nul 2>&1

tasklist | findstr nginx >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo NGINX started successfully
    echo Load balancer running on http://localhost
    echo Status page: http://localhost:8080/nginx_status
) else (
    echo NGINX failed to start
)

echo.
echo To stop NGINX: stop-nginx.bat