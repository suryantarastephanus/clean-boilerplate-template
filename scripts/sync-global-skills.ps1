# scripts/sync-global-skills.ps1
# Synchronize all 62 AI skills from this repository to global user directories

$ErrorActionPreference = "Stop"

$sourceSkills = Join-Path $PSScriptRoot "..\.agents\skills"
if (-not (Test-Path $sourceSkills)) {
    Write-Error "Source skills directory not found: $sourceSkills"
    exit 1
}

$targetAgents = "$HOME\.agents\skills"
$targetClaude = "$HOME\.claude\skills"

# Ensure target directories exist
if (-not (Test-Path $targetAgents)) {
    New-Item -ItemType Directory -Path $targetAgents -Force | Out-Null
}
if (-not (Test-Path $targetClaude)) {
    New-Item -ItemType Directory -Path $targetClaude -Force | Out-Null
}

Write-Host "Menginisialisasi sinkronisasi 62 AI Skills ke direktori global..." -ForegroundColor Cyan

$skills = Get-ChildItem -Path $sourceSkills -Directory
$count = 0

foreach ($skill in $skills) {
    $src = $skill.FullName
    $destAgents = Join-Path $targetAgents $skill.Name
    $destClaude = Join-Path $targetClaude $skill.Name

    Copy-Item -Path $src -Destination $destAgents -Recurse -Force
    Copy-Item -Path $src -Destination $destClaude -Recurse -Force
    $count++
}

Write-Host "Berhasil mensinkronkan $count AI Skills ke:" -ForegroundColor Green
Write-Host "Target Agents: $targetAgents" -ForegroundColor Yellow
Write-Host "Target Claude: $targetClaude" -ForegroundColor Yellow
