@echo off
echo ==========================================
echo   Smart Campus Hub - Starting Servers
echo ==========================================

echo.
echo [1/2] Starting Frontend (port 5173)...
start "Frontend" cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo [2/2] Starting Backend (port 8081)...
echo   Clearing port 8081 if busy...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| find ":8081 "') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul
start "Backend" cmd /k "cd /d "%~dp0api" && mvnw spring-boot:run"

echo.
echo Both servers starting in separate windows!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8081
echo.
pause
