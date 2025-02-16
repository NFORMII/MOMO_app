import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
connection = sqlite3.connect('momo_data.db')
cursor = connection.cursor()

# Drop the table if it exists (to avoid conflicts)
cursor.execute('DROP TABLE IF EXISTS transactions')

# Create table for transactions
cursor.execute('''
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        sender TEXT,
        receiver TEXT,
        amount REAL,
        currency TEXT,
        transaction_type TEXT
    )
''')

# Commit and close connection
connection.commit()
connection.close()

print("Database and table created successfully!")
