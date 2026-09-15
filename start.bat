@echo off
TITLE GARUDA // AWS INTELLIGENT WEATHER MONITOR
echo ======================================================================
echo   GARUDA // AWS INTELLIGENT WEATHER MONITOR (v2.0)
echo   Starting Backend and Frontend Services...
echo ======================================================================

start "GARUDA Backend API (Port 5000)" cmd /k "cd backend && npm.cmd start"
timeout /t 2 /nobreak >nul
start "GARUDA Frontend UI (Port 3000)" cmd /k "cd frontend && npm.cmd run dev"

echo.
echo All services launched!
echo Access the Dashboard at: http://localhost:3000
echo Access the Backend API at: http://localhost:5000
echo ======================================================================
pause
