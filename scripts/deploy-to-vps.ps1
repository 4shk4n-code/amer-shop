# PowerShell script to deploy to VPS
$VPS_IP = "72.61.143.56"
$VPS_USER = "root"
$VPS_PATH = "/var/www/amer-shop"

Write-Host "=== Deploying to VPS ===" -ForegroundColor Green
Write-Host "VPS: $VPS_IP" -ForegroundColor Yellow
Write-Host "Path: $VPS_PATH" -ForegroundColor Yellow
Write-Host ""

# Files and directories to upload (excluding node_modules and .next)
$exclude = @("node_modules", ".next", ".git", "*.log")

Write-Host "Uploading files..." -ForegroundColor Cyan

# Use scp to upload files
scp -r -o StrictHostKeyChecking=no `
    --exclude=node_modules `
    --exclude=.next `
    --exclude=.git `
    src/ `
    public/ `
    database/ `
    scripts/ `
    *.json `
    *.ts `
    *.js `
    *.md `
    ecosystem.config.js `
    next.config.js `
    postcss.config.js `
    tailwind.config.ts `
    tsconfig.json `
    "${VPS_USER}@${VPS_IP}:${VPS_PATH}/"

Write-Host ""
Write-Host "=== Deployment Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps on VPS:" -ForegroundColor Yellow
Write-Host "1. ssh ${VPS_USER}@${VPS_IP}" -ForegroundColor Cyan
Write-Host "2. cd ${VPS_PATH}" -ForegroundColor Cyan
Write-Host "3. npm install" -ForegroundColor Cyan
Write-Host "4. npm run build" -ForegroundColor Cyan
Write-Host "5. pm2 restart amer-shop" -ForegroundColor Cyan

