@echo off
TITLE GARUDA // PRODUCTION DEPLOYMENT
echo ======================================================================
echo   GARUDA // AWS INTELLIGENT WEATHER MONITOR (v2.0)
echo   DEPLOYING PRODUCTION SYSTEM (MINIMALISTIC 3D EDITION)
echo ======================================================================
echo.
echo [1/3] Building Optimized 3D Production Frontend...
cd frontend
call npm.cmd run build
if %errorlevel% neq 0 (
    echo Error during frontend build!
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo [2/3] Verifying Backend Server Dependencies...
cd backend
call npm.cmd install --omit=dev
cd ..

echo.
echo [3/3] Launching Unified Production Server on Port 5000...
echo.
echo ======================================================================
echo   PRODUCTION DEPLOYMENT SUCCESSFUL!
echo   Open your browser at: http://localhost:5000
echo   Both the Minimalist 3D UI and REST API are running simultaneously.
echo ======================================================================
echo.
node backend\src\server.js
pause
