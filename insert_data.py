import sqlite3

def insert_transaction(transaction_type, amount, sender, receiver, transaction_id, date, extra_info):
    conn = sqlite3.connect("momo_data.db")
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO transactions (transaction_type, amount, sender, receiver, transaction_id, date, extra_info)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (transaction_type, amount, sender, receiver, transaction_id, date, extra_info))
    conn.commit()
    conn.close()

# Example data insertion
insert_transaction("Incoming Money", 5000, "modestine", "You", "123456", "2024-01-01 10:00:00", "MTN MoMo")
print("test transaction entered successfully!")
