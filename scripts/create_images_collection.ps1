# Script PowerShell para executar o script MongoDB via mongosh
# Uso: .\create_images_collection.ps1 [connection_string]

param(
    [string]$ConnectionString = "mongodb://localhost:27017/metabee"
)

Write-Host "🔌 Conectando ao MongoDB..." -ForegroundColor Cyan
Write-Host "📝 Executando script de criação da collection 'images'..." -ForegroundColor Yellow

mongosh $ConnectionString --file scripts/create_images_collection.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Script executado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao executar o script" -ForegroundColor Red
    exit 1
}

