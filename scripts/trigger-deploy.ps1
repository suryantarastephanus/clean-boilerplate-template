# Trigger Easypanel Deploy Webhook
# Script ini HANYA dijalankan jika diminta oleh user.

$webhookUrl = "http://43.157.212.24:3000/api/deploy/a5552c860c2792106fbde40c8fb365116680437cdea0f597"

Write-Host "🚀 Mengirim trigger deploy ke Easypanel: $webhookUrl" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -ContentType 'application/json' -Body '{}' -TimeoutSec 30
    Write-Host "✅ Deploy trigger berhasil dikirim!" -ForegroundColor Green
    Write-Host "Status: $response" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Gagal mengirim deploy trigger: $_" -ForegroundColor Red
}
