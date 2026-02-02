# Zeromade - Start everything
# Prerequisite: MongoDB must be running (mongodb://127.0.0.1:27017)

Write-Host "Starting Zeromade..." -ForegroundColor Cyan

# 1. Seed admin (if not exists)
Write-Host "`n[1/3] Seeding admin..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\backend"
node seedAdmin.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Seed failed. Is MongoDB running?" -ForegroundColor Red
    exit 1
}

# 2. Start backend
Write-Host "`n[2/3] Starting backend on port 5000..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "$PSScriptRoot\backend" -WindowStyle Normal

Start-Sleep -Seconds 2

# 3. Start frontend
Write-Host "`n[3/3] Starting frontend on port 3001..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\frontend"
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "$PSScriptRoot\frontend" -WindowStyle Normal

Write-Host "`nDone. Open http://localhost:3001" -ForegroundColor Green
Write-Host "Admin: admin@zeromade.com / Admin@123" -ForegroundColor Gray
