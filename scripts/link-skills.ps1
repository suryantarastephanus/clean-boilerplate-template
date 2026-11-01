# scripts/link-skills.ps1
# Hubungkan project lokal ke AI Skills Global via NTFS Directory Junction (Symlink instan)

$ErrorActionPreference = "Stop"

$globalSkills = "$HOME\.agents\skills"
$globalClaudeSkills = "$HOME\.claude\skills"

if (-not (Test-Path $globalSkills)) {
    Write-Warning "Global skills belum ditemukan di $globalSkills. Menjalankan sinkronisasi..."
    $syncScript = Join-Path $PSScriptRoot "sync-global-skills.ps1"
    if (Test-Path $syncScript) {
        & $syncScript
    } else {
        Write-Error "Global skills belum terpasang. Jalankan sync-global-skills.ps1 terlebih dahulu."
        exit 1
    }
}

# 1. Hubungkan ke .agents/skills
$localAgentsDir = Join-Path (Get-Location) ".agents"
$localAgentsSkills = Join-Path $localAgentsDir "skills"

if (-not (Test-Path $localAgentsDir)) {
    New-Item -ItemType Directory -Path $localAgentsDir -Force | Out-Null
}

if (Test-Path $localAgentsSkills) {
    $item = Get-Item $localAgentsSkills
    if ($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) {
        Write-Host "ℹ️ .agents/skills sudah terhubung sebagai Junction." -ForegroundColor Cyan
    } else {
        Write-Host "⚠️ .agents/skills sudah ada sebagai direktori fisik. Tidak diubah." -ForegroundColor Yellow
    }
} else {
    New-Item -ItemType Junction -Path $localAgentsSkills -Target $globalSkills | Out-Null
    Write-Host "🔗 Berhasil membuat Junction: .agents/skills -> $globalSkills" -ForegroundColor Green
}

# 2. Hubungkan ke .claude/skills
$localClaudeDir = Join-Path (Get-Location) ".claude"
$localClaudeSkills = Join-Path $localClaudeDir "skills"

if (-not (Test-Path $localClaudeDir)) {
    New-Item -ItemType Directory -Path $localClaudeDir -Force | Out-Null
}

if (Test-Path $localClaudeSkills) {
    $item = Get-Item $localClaudeSkills
    if ($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) {
        Write-Host "ℹ️ .claude/skills sudah terhubung sebagai Junction." -ForegroundColor Cyan
    } else {
        Write-Host "⚠️ .claude/skills sudah ada sebagai direktori fisik. Tidak diubah." -ForegroundColor Yellow
    }
} else {
    New-Item -ItemType Junction -Path $localClaudeSkills -Target $globalClaudeSkills | Out-Null
    Write-Host "🔗 Berhasil membuat Junction: .claude/skills -> $globalClaudeSkills" -ForegroundColor Green
}

Write-Host "🎉 AI Skills Global berhasil terhubung ke project ini!" -ForegroundColor Green

