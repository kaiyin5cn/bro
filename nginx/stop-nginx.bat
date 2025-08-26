@echo off
chcp 65001 >nul
echo Stopping NGINX...

"C:\nginx\nginx.exe" -s quit -c "C:\Users\IT\Downloads\ky\bro\nginx\nginx.conf"

timeout /t 2 /nobreak >nul 2>&1

tasklist | findstr nginx >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo NGINX stopped successfully
) else (
    echo NGINX still running, force killing...
    taskkill /F /IM nginx.exe >nul 2>&1
    echo NGINX force stopped
)