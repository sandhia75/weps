@echo off
echo.
echo ========================================
echo Shopify Page Speed Optimizer - Setup
echo ========================================
echo.

echo [1] Starting Backend Server...
start "Backend - Port 3000" cmd /k "cd /d c:\Users\01\Desktop\es\shopify-page-speed-app\web\backend && node index.ts"

timeout /t 3 /nobreak

echo [2] Starting Frontend Server...
start "Frontend - Port 3001" cmd /k "cd /d c:\Users\01\Desktop\es\shopify-page-speed-app\web\frontend && npm run dev"

timeout /t 3 /nobreak

echo [3] Starting ngrok Tunnel...
start "ngrok - Tunnel" cmd /k "ngrok http 3000"

timeout /t 5 /nobreak

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Access Points:
echo - Frontend Dashboard: http://localhost:3001
echo - Backend API: http://localhost:3000
echo - Health Check: http://localhost:3000/health
echo - ngrok Status: http://127.0.0.1:4040
echo.
echo Wait for ngrok to show your tunnel URL
echo (should look like: https://xxxx-xx-xxx-xxx.ngrok.io)
echo.
echo Then update your .env file with that URL
echo.
pause
