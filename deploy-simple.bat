@echo off
echo === AMER SHOP - Quick Deploy ===
echo.

echo [1/4] Building project...
call npm run build
if errorlevel 1 (
    echo Build failed! Fix errors and try again.
    pause
    exit /b 1
)
echo Build successful!
echo.

echo [2/4] Files are ready for upload
echo.
echo Please upload these folders/files to VPS using WinSCP:
echo   - src/
echo   - public/
echo   - database/
echo   - scripts/
echo   - package.json
echo   - package-lock.json
echo   - ecosystem.config.js
echo   - next.config.js
echo   - postcss.config.js
echo   - tailwind.config.ts
echo   - tsconfig.json
echo.
echo VPS Details:
echo   Host: 72.61.143.56
echo   User: root
echo   Path: /var/www/amer-shop
echo.

pause

echo [3/4] After uploading, press any key to continue...
pause >nul

echo [4/4] Connecting to VPS to deploy...
echo You'll be prompted for your VPS password.
echo.

ssh root@72.61.143.56 "cd /var/www/amer-shop && npm install && npm run build && pm2 restart amer-shop"

if errorlevel 1 (
    echo.
    echo Deployment failed. Please SSH manually and run:
    echo   cd /var/www/amer-shop
    echo   npm install
    echo   npm run build
    echo   pm2 restart amer-shop
    pause
    exit /b 1
)

echo.
echo === Deployment Complete! ===
echo Your site is live at: http://72.61.143.56:3001
echo.
pause

