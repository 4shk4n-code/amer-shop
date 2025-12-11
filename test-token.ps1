# Test GitHub Token for Repository Sync
# Replace YOUR_TOKEN with your actual GitHub Personal Access Token

param(
    [Parameter(Mandatory=$true)]
    [string]$Token
)

Write-Host "Testing GitHub token..." -ForegroundColor Cyan

# Test if token can access the destination repository
$repoUrl = "https://api.github.com/repos/KaZeML0L/ecommerece"
$headers = @{
    "Authorization" = "token $Token"
    "Accept" = "application/vnd.github.v3+json"
}

try {
    $response = Invoke-RestMethod -Uri $repoUrl -Headers $headers -Method Get
    Write-Host "✓ Token is valid!" -ForegroundColor Green
    Write-Host "✓ Repository exists: $($response.full_name)" -ForegroundColor Green
    Write-Host "✓ Repository is $($response.visibility)" -ForegroundColor Green
    
    # Check if token has repo scope by trying to get repo permissions
    $userUrl = "https://api.github.com/user"
    $userResponse = Invoke-RestMethod -Uri $userUrl -Headers $headers -Method Get
    Write-Host "✓ Token belongs to: $($userResponse.login)" -ForegroundColor Green
    
    Write-Host "`nToken appears to have correct permissions!" -ForegroundColor Green
    Write-Host "You can now update the DESTINATION_TOKEN secret in GitHub." -ForegroundColor Yellow
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401) {
        Write-Host "✗ Token is invalid or expired" -ForegroundColor Red
        Write-Host "Please create a new token at: https://github.com/settings/tokens/new" -ForegroundColor Yellow
    } elseif ($statusCode -eq 403) {
        Write-Host "✗ Token doesn't have 'repo' scope" -ForegroundColor Red
        Write-Host "Please create a new token with 'repo' permission at: https://github.com/settings/tokens/new" -ForegroundColor Yellow
    } elseif ($statusCode -eq 404) {
        Write-Host "✗ Repository not found: KaZeML0L/ecommerece" -ForegroundColor Red
        Write-Host "Please create the repository first at: https://github.com/new" -ForegroundColor Yellow
    } else {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
    }
    exit 1
}

