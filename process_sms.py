import sqlite3
import xml.etree.ElementTree as ET
import re

# Function to extract transaction details
def parse_transaction(body):
    patterns = {
        "Incoming Money": r"You have received (\d+) RWF from (.+?)\. Transaction ID: (\d+)",
        "Payments": r"Your payment of (\d+) RWF to (.+?) has been completed\. Transaction ID: (\d+)",
        "Airtime Purchase": r"You have purchased an internet bundle of .* for (\d+) RWF",
        "Withdrawals": r"withdrawn (\d+) RWF on (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})"
    }

    for category, pattern in patterns.items():
        match = re.search(pattern, body)
        if match:
            amount = int(match.group(1))
            transaction_id = match.group(3) if len(match.groups()) >= 3 else None
            return {
                "transaction_type": category,
                "amount": amount,
                "sender": match.group(2) if category == "Incoming Money" else None,
                "receiver": match.group(2) if category == "Payments" else None,
                "date_time": match.group(2) if category == "Withdrawals" else "Unknown",
                "transaction_id": transaction_id,
                "details": body
            }
    return None  # No match found

# Function to parse XML and extract SMS data
def parse_xml(file_path):
    try:
        tree = ET.parse(file_path)
    except Exception as e:
        print(f"Error parsing XML file: {e}")
        return []
    
    root = tree.getroot()
    transactions = []

    for sms in root.findall('sms'):
        body_elem = sms.find('body')
        if body_elem is None:
            print("Warning: Found an <sms> element without a <body> tag. Skipping this entry.")
            print("Element content:", ET.tostring(sms, encoding='unicode'))
            continue  # Skip if no <body> tag
        
        if body_elem.text is None:
            print("Warning: Found an <sms> element with an empty <body> tag. Skipping this entry.")
            print("Element content:", ET.tostring(sms, encoding='unicode'))
            continue  # Skip if <body> exists but is empty

        body = body_elem.text
        transaction = parse_transaction(body)
        if transaction:
            transactions.append(transaction)
    
    return transactions

# Function to insert transactions into  database
def insert_into_db(transactions):
    conn = sqlite3.connect('momo_data.db')
    cursor = conn.cursor()

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

    for txn in transactions:
        try:
            cursor.execute("""
                INSERT INTO transactions (transaction_type, amount, sender, receiver, date_time, transaction_id, details)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (txn['transaction_type'], txn['amount'], txn['sender'], txn['receiver'], txn['date_time'], txn['transaction_id'], txn['details']))
        except sqlite3.IntegrityError:
            print(f"Duplicate entry for transaction ID: {txn['transaction_id']}")

    conn.commit()
    conn.close()

# Main function
def main():
    transactions = parse_xml("momo_sms.xml")  # to ensure that the momo_sms.xml is in my project folder
    insert_into_db(transactions)
    print("Data successfully processed and inserted into the database.")

if __name__ == "__main__":
    main()
