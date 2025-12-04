# Quick Deploy Script for AMER SHOP
# Usage: .\deploy.ps1

$VPS_IP = "72.61.143.56"
$VPS_USER = "root"
$VPS_PATH = "/var/www/amer-shop"

Write-Host ""
Write-Host "=== AMER SHOP - Quick Deploy ===" -ForegroundColor Green
Write-Host ""

# Step 1: Build locally
Write-Host "[1/5] Building project..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Fix errors and try again." -ForegroundColor Red
    exit 1
}
Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Create deployment package
Write-Host "[2/5] Preparing files..." -ForegroundColor Cyan
$tempDir = "deploy-temp"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy necessary files
Copy-Item -Recurse -Force src $tempDir\
Copy-Item -Recurse -Force public $tempDir\
Copy-Item -Recurse -Force database $tempDir\
Copy-Item -Recurse -Force scripts $tempDir\
Copy-Item package.json $tempDir\
Copy-Item package-lock.json $tempDir\
if (Test-Path ecosystem.config.js) { Copy-Item ecosystem.config.js $tempDir\ }
Copy-Item next.config.js $tempDir\
Copy-Item postcss.config.js $tempDir\
Copy-Item tailwind.config.ts $tempDir\
Copy-Item tsconfig.json $tempDir\
# Copy .next build folder if it exists (from local build)
if (Test-Path .next) { Copy-Item -Recurse -Force .next $tempDir\ }

Write-Host "Files prepared!" -ForegroundColor Green
Write-Host ""

# Step 3: Upload to VPS
Write-Host "[3/5] Uploading to VPS..." -ForegroundColor Cyan
Write-Host "You'll be prompted for your VPS password." -ForegroundColor Yellow
Write-Host ""

# Try using scp
$uploadCommand = "scp -r -o StrictHostKeyChecking=no `"$tempDir\*`" ${VPS_USER}@${VPS_IP}:${VPS_PATH}/"
Write-Host "Running upload..." -ForegroundColor Gray
Invoke-Expression $uploadCommand

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Upload failed. Please upload manually using WinSCP:" -ForegroundColor Yellow
    Write-Host "  - Copy everything from: $tempDir" -ForegroundColor Gray
    Write-Host "  - To VPS: ${VPS_USER}@${VPS_IP}:${VPS_PATH}/" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Then SSH and run:" -ForegroundColor Yellow
    Write-Host "  cd $VPS_PATH" -ForegroundColor Cyan
    Write-Host "  npm install" -ForegroundColor Cyan
    Write-Host "  npm run build" -ForegroundColor Cyan
    Write-Host "  pm2 restart amer-shop" -ForegroundColor Cyan
    Remove-Item -Recurse -Force $tempDir
    exit 1
}

Write-Host "Upload successful!" -ForegroundColor Green
Write-Host ""

# Step 4: Deploy on VPS
Write-Host "[4/5] Deploying on VPS..." -ForegroundColor Cyan
$deployCmd = 'cd /var/www/amer-shop && npm install && npm run build && (pm2 restart amer-shop || /root/.nvm/versions/node/*/bin/pm2 restart amer-shop || npx pm2 restart amer-shop)'
$sshCmd = "ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} `"$deployCmd`""

Write-Host "Running deployment commands on VPS..." -ForegroundColor Gray
Invoke-Expression $sshCmd

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Deployment failed. Please SSH manually and run:" -ForegroundColor Yellow
    Write-Host "  cd $VPS_PATH" -ForegroundColor Cyan
    Write-Host "  npm install" -ForegroundColor Cyan
    Write-Host "  npm run build" -ForegroundColor Cyan
    Write-Host "  pm2 restart amer-shop" -ForegroundColor Cyan
    Remove-Item -Recurse -Force $tempDir
    exit 1
}

Write-Host "Deployment successful!" -ForegroundColor Green
Write-Host ""

# Step 5: Cleanup
Write-Host "[5/5] Cleaning up..." -ForegroundColor Cyan
Remove-Item -Recurse -Force $tempDir
Write-Host "Cleanup complete!" -ForegroundColor Green
Write-Host ""

# Success!
Write-Host "=== Deployment Complete! ===" -ForegroundColor Green
Write-Host "Your site is live at: http://72.61.143.56:3001" -ForegroundColor Cyan
Write-Host ""
