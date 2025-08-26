@echo off
chcp 65001 >nul
echo Starting Redis Server...

REM Check if Redis is already running
tasklist | findstr redis-server >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Redis is already running
    goto :end
)

REM Start Redis (assuming Redis is installed via Chocolatey or MSI)
if exist "C:\Program Files\Redis\redis-server.exe" (
    start /B "" "C:\Program Files\Redis\redis-server.exe"
    goto :check
)

if exist "C:\redis\redis-server.exe" (
    start /B "" "C:\redis\redis-server.exe"
    goto :check
)

REM Try Redis from PATH
redis-server --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    start /B "" redis-server
    goto :check
)

echo Redis not found. Please install Redis:
echo 1. Download from: https://github.com/microsoftarchive/redis/releases
echo 2. Or install via Chocolatey: choco install redis-64
goto :end

:check
timeout /t 3 /nobreak >nul 2>&1

tasklist | findstr redis-server >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Redis started successfully
    echo Redis running on localhost:6379
) else (
    echo Redis failed to start
)

:end
echo.
echo To stop Redis: stop-redis.bat