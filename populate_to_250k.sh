#!/bin/bash
# Script para popular banco com 250k vendas em batches pequenos
# Total atual: ~161k
# Faltam: ~89k vendas
# Cada batch de 10 meses gera ~30k vendas
# Precisamos de 3 batches de 10 meses

echo "========================================="
echo "Populating database to 250k sales"
echo "Current: ~161k sales"
echo "Target: 250k sales"
echo "Strategy: 3 batches of 10 months each"
echo "========================================="

DB_URL="postgresql://challenge:challenge_2024@postgres:5432/challenge_db"

for i in {1..3}; do
    echo ""
    echo "--- Batch $i/3 (10 months) ---"
    
    docker compose run --rm data-generator python generate_data.py \
        --db-url "$DB_URL" \
        --stores 150 \
        --products 1500 \
        --items 300 \
        --customers 30000 \
        --months 10
    
    echo "✅ Batch $i completed"
    
    # Check current count
    CURRENT=$(docker exec godlevel-db psql -U challenge -d challenge_db -t -c "SELECT COUNT(*) FROM sales;")
    echo "Current total: $CURRENT sales"
    
    # Wait 5 seconds between batches
    if [ $i -lt 3 ]; then
        echo "Waiting 5 seconds..."
        sleep 5
    fi
done

echo ""
echo "========================================="
echo "✅ Population complete!"
FINAL=$(docker exec godlevel-db psql -U challenge -d challenge_db -t -c "SELECT COUNT(*) FROM sales;")
echo "Final total: $FINAL sales"
echo "========================================="
