@echo off
chcp 65001 >nul
echo Stopping Redis Server...

tasklist | findstr redis-server >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Redis is not running
    goto :end
)

taskkill /F /IM redis-server.exe >nul 2>&1

timeout /t 2 /nobreak >nul 2>&1

tasklist | findstr redis-server >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Redis stopped successfully
) else (
    echo Redis still running
)

:end