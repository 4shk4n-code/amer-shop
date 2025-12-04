# PowerShell Script to Upload Files to VPS
# Run: .\scripts\upload-to-vps.ps1

$VPS_IP = "72.61.143.56"
$VPS_USER = "root"
$VPS_PATH = "/var/www/amer-shop"

Write-Host "🚀 Uploading AMER SHOP to VPS..." -ForegroundColor Green
Write-Host "VPS: $VPS_USER@$VPS_IP" -ForegroundColor Yellow
Write-Host "Path: $VPS_PATH" -ForegroundColor Yellow
Write-Host ""

# Check if SSH is available
if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ SSH not found. Install OpenSSH or use WinSCP/FileZilla" -ForegroundColor Red
    exit 1
}

# Create directory on VPS
Write-Host "📁 Creating directory on VPS..." -ForegroundColor Cyan
ssh $VPS_USER@$VPS_IP "mkdir -p $VPS_PATH"

# Upload files using SCP
Write-Host "📤 Uploading files (this may take a few minutes)..." -ForegroundColor Cyan

# Exclude unnecessary files
$exclude = @(
    "node_modules",
    ".next",
    ".git",
    "*.log",
    ".env.local"
)

# Build exclude string
$excludeStr = $exclude | ForEach-Object { "--exclude=$_" } | Out-String

# Use rsync if available, otherwise scp
if (Get-Command rsync -ErrorAction SilentlyContinue) {
    rsync -avz --exclude='node_modules' --exclude='.next' --exclude='.git' --exclude='*.log' --exclude='.env.local' ./ ${VPS_USER}@${VPS_IP}:${VPS_PATH}/
} else {
    Write-Host "⚠️  rsync not found. Using scp (slower)..." -ForegroundColor Yellow
    scp -r -o StrictHostKeyChecking=no . $VPS_USER@$VPS_IP:$VPS_PATH
}

Write-Host ""
Write-Host "✅ Upload complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps on VPS:" -ForegroundColor Yellow
Write-Host "   1. ssh $VPS_USER@$VPS_IP" -ForegroundColor White
Write-Host "   2. cd $VPS_PATH" -ForegroundColor White
Write-Host "   3. bash scripts/setup-vps-database.sh" -ForegroundColor White
Write-Host "   4. npm install" -ForegroundColor White
Write-Host "   5. npm run build" -ForegroundColor White
Write-Host "   6. node scripts/create-admin-vps.js" -ForegroundColor White
Write-Host "   7. pm2 start npm --name 'amer-shop' -- start" -ForegroundColor White
Write-Host ""

