# scripts/init-new-project.ps1
# Interactive Wizard to initialize a new project from this Master Boilerplate

param (
    [string]$AppName = "",
    [string]$DbName = ""
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 INITIALIZING NEW PROJECT FROM MASTER BOILERPLATE 🚀" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not $AppName) {
    $AppName = Read-Host "Masukkan nama project baru (contoh: MySaaSApp)"
    if (-not $AppName) { $AppName = "MyProject" }
}

$slug = ($AppName.ToLower() -replace '[^a-z0-9]', '_').Trim('_')
if (-not $DbName) {
    $DbName = Read-Host "Masukkan nama database PostgreSQL [default: $slug]"
    if (-not $DbName) { $DbName = $slug }
}

Write-Host "`n1. Menyiapkan file konfigurasi .env..." -ForegroundColor Yellow
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "   -> .env dibuat dari .env.example" -ForegroundColor Green
}

# Update APP_NAME and DB_DATABASE in .env
(Get-Content .env) | ForEach-Object {
    $_ -replace '^APP_NAME=.*', "APP_NAME=`"$AppName`"" `
       -replace '^VITE_APP_NAME=.*', "VITE_APP_NAME=`"${APP_NAME}`"" `
       -replace '^DB_DATABASE=.*', "DB_DATABASE=$DbName"
} | Set-Content .env

Write-Host "2. Menghasilkan Application Key (php artisan key:generate)..." -ForegroundColor Yellow
php artisan key:generate --ansi

Write-Host "`n3. Menghubungkan 62 AI Skills Global ke project baru..." -ForegroundColor Yellow
$linkScript = Join-Path $PSScriptRoot "link-skills.ps1"
if (Test-Path $linkScript) {
    & $linkScript
}

Write-Host "`n4. Mengoptimalkan autoloader & Wayfinder routes..." -ForegroundColor Yellow
php artisan wayfinder:generate 2>$null

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "🎉 PROJECT '$AppName' SIAP DIGUNAKAN!" -ForegroundColor Green
Write-Host "   - Database PostgreSQL: $DbName" -ForegroundColor Cyan
Write-Host "   - AI Skills Global: Terhubung" -ForegroundColor Cyan
Write-Host "`nJalankan perintah ini untuk memulai dev server:" -ForegroundColor White
Write-Host "   composer run dev" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green

