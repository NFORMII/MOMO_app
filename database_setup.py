import sqlite3

# Connect to SQLite database (creates 'momo_data.db' if not found)
conn = sqlite3.connect("momo_data.db")
cursor = conn.cursor()

# Create the transactions table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_type TEXT NOT NULL,
        amount INTEGER NOT NULL,
        sender TEXT,
        receiver TEXT,
        date_time TEXT NOT NULL,
        transaction_id TEXT UNIQUE,
        details TEXT
    )
""")

# Commit changes and close connection
conn.commit()
conn.close()

print("Database and table created successfully!")

