# Quick Deploy Script for AMER SHOP (with password)
# Usage: .\deploy-with-password.ps1

$VPS_IP = "72.61.143.56"
$VPS_USER = "root"
$VPS_PATH = "/var/www/amer-shop"
$VPS_PASSWORD = "Amna1234567890@"

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
# Copy .next build folder if it exists
if (Test-Path .next) { Copy-Item -Recurse -Force .next $tempDir\ }

Write-Host "Files prepared!" -ForegroundColor Green
Write-Host ""

# Step 3: Upload to VPS using sshpass or plink
Write-Host "[3/5] Uploading to VPS..." -ForegroundColor Cyan

# Try using plink (PuTTY) if available, otherwise use scp with expect
$uploadSuccess = $false

# Method 1: Try using plink (PuTTY)
if (Get-Command plink -ErrorAction SilentlyContinue) {
    Write-Host "Using plink for upload..." -ForegroundColor Gray
    $plinkCmd = "echo y | plink -ssh -pw `"$VPS_PASSWORD`" ${VPS_USER}@${VPS_IP} `"mkdir -p ${VPS_PATH}`""
    Invoke-Expression $plinkCmd | Out-Null
    
    # Upload files using pscp
    if (Get-Command pscp -ErrorAction SilentlyContinue) {
        $pscpCmd = "pscp -pw `"$VPS_PASSWORD`" -r `"$tempDir\*`" ${VPS_USER}@${VPS_IP}:${VPS_PATH}/"
        Invoke-Expression $pscpCmd
        if ($LASTEXITCODE -eq 0) {
            $uploadSuccess = $true
        }
    }
}

# Method 2: Use scp with sshpass (if available)
if (-not $uploadSuccess -and (Get-Command sshpass -ErrorAction SilentlyContinue)) {
    Write-Host "Using sshpass for upload..." -ForegroundColor Gray
    $scpCmd = "sshpass -p `"$VPS_PASSWORD`" scp -r -o StrictHostKeyChecking=no `"$tempDir\*`" ${VPS_USER}@${VPS_IP}:${VPS_PATH}/"
    Invoke-Expression $scpCmd
    if ($LASTEXITCODE -eq 0) {
        $uploadSuccess = $true
    }
}

# Method 3: Manual instructions if automated methods fail
if (-not $uploadSuccess) {
    Write-Host ""
    Write-Host "Automated upload failed. Please upload manually:" -ForegroundColor Yellow
    Write-Host "  - Use WinSCP to upload everything from: $tempDir" -ForegroundColor Gray
    Write-Host "  - To: ${VPS_USER}@${VPS_IP}:${VPS_PATH}/" -ForegroundColor Gray
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
$deployCmd = 'cd /var/www/amer-shop && npm install && npm run build && pm2 restart amer-shop'

# Try using plink or sshpass for SSH
$deploySuccess = $false

if (Get-Command plink -ErrorAction SilentlyContinue) {
    $sshCmd = "plink -ssh -pw `"$VPS_PASSWORD`" ${VPS_USER}@${VPS_IP} `"$deployCmd`""
    Invoke-Expression $sshCmd
    if ($LASTEXITCODE -eq 0) {
        $deploySuccess = $true
    }
} elseif (Get-Command sshpass -ErrorAction SilentlyContinue) {
    $sshCmd = "sshpass -p `"$VPS_PASSWORD`" ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} `"$deployCmd`""
    Invoke-Expression $sshCmd
    if ($LASTEXITCODE -eq 0) {
        $deploySuccess = $true
    }
}

if (-not $deploySuccess) {
    Write-Host ""
    Write-Host "Automated deployment failed. Please SSH manually and run:" -ForegroundColor Yellow
    Write-Host "  ssh ${VPS_USER}@${VPS_IP}" -ForegroundColor Cyan
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
Write-Host "Don't forget to run this SQL on VPS:" -ForegroundColor Yellow
Write-Host "  mysql -u amer_shop_user -p'AmerShop2024' amer_shop < database/add_reviews_table.sql" -ForegroundColor Cyan
Write-Host ""

