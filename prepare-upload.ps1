# Prepare files for upload
$tempDir = "deploy-temp"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

Write-Host "Preparing files..." -ForegroundColor Cyan

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
if (Test-Path .next) { Copy-Item -Recurse -Force .next $tempDir\ }

Write-Host "Files prepared in: $tempDir" -ForegroundColor Green
Write-Host ""
Write-Host "Now run:" -ForegroundColor Yellow
Write-Host "  scp -r deploy-temp\* root@72.61.143.56:/var/www/amer-shop/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Password: Amna1234567890@" -ForegroundColor Gray

