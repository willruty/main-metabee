#!/bin/bash
# Script para executar o script MongoDB via mongosh
# Uso: ./create_images_collection.sh [connection_string]

CONNECTION_STRING="${1:-mongodb://localhost:27017/metabee}"

echo "🔌 Conectando ao MongoDB..."
echo "📝 Executando script de criação da collection 'images'..."

mongosh "$CONNECTION_STRING" --file scripts/create_images_collection.js

if [ $? -eq 0 ]; then
    echo "✅ Script executado com sucesso!"
else
    echo "❌ Erro ao executar o script"
    exit 1
fi

