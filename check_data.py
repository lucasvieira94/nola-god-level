#!/usr/bin/env python3
"""Script to check data in production database"""

import sys
import psycopg2
from urllib.parse import urlparse

def check_database(db_url):
    """Check the number of records in each table"""
    
    # Parse database URL
    result = urlparse(db_url)
    username = result.username
    password = result.password
    database = result.path[1:]
    hostname = result.hostname
    port = result.port or 5432

    print(f"🔍 Connecting to database: {database}")
    
    try:
        # Connect to database
        conn = psycopg2.connect(
            database=database,
            user=username,
            password=password,
            host=hostname,
            port=port
        )
        cursor = conn.cursor()
        
        # List of tables to check
        tables = [
            'brands',
            'stores', 
            'channels',
            'products',
            'customers',
            'sales'
        ]
        
        print("\n📊 Database Statistics:")
        print("-" * 50)
        
        total_records = 0
        for table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            total_records += count
            
            # Format with thousands separator
            count_str = f"{count:,}"
            print(f"  {table.ljust(15)}: {count_str.rjust(10)} records")
        
        print("-" * 50)
        print(f"  {'TOTAL'.ljust(15)}: {total_records:,} records")
        print()
        
        # Check if we have recent sales
        cursor.execute("""
            SELECT 
                MIN(created_at) as first_sale,
                MAX(created_at) as last_sale,
                COUNT(*) as total_sales
            FROM sales
        """)
        
        result = cursor.fetchone()
        if result[0]:
            print("📅 Sales Date Range:")
            print(f"  First Sale: {result[0]}")
            print(f"  Last Sale: {result[1]}")
            print(f"  Total Sales: {result[2]:,}")
        else:
            print("⚠️  No sales data found yet")
        
        cursor.close()
        conn.close()
        
        print("\n✅ Database check completed!")
        
    except Exception as e:
        print(f"\n❌ Error connecting to database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python check_data.py <database_url>")
        sys.exit(1)
    
    db_url = sys.argv[1]
    check_database(db_url)
