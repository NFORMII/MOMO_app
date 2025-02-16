import sqlite3
import xml.etree.ElementTree as ET

# Connect to SQLite database
connection = sqlite3.connect('momo_data.db')
cursor = connection.cursor()

print("Connected to database...")

# Parse the MoMo SMS XML file
try:
    tree = ET.parse('momo_sms.xml')  # Ensure this file is in the same directory
    root = tree.getroot()
    print("XML file loaded successfully...")
except Exception as e:
    print(f"Error loading XML file: {e}")
    exit()

# Track inserted transactions
transaction_count = 0

# Loop through each SMS entry in the XML file
for sms in root.findall('sms'):
    message_body = sms.get('body')  # Get SMS content
    date = sms.get('date')          # Get date of transaction

    print(f"Processing SMS: {message_body[:50]}...")  # Print first 50 chars for context

    # Example: Extract transaction details from the message body
    transaction_type = "unknown"
    if "sent" in message_body.lower():
        transaction_type = "sent"
    elif "received" in message_body.lower():
        transaction_type = "received"

    # Extract amount
    words = message_body.split()
    amount = 0
    currency = "FCFA"
    sender = "Unknown"
    receiver = "Unknown"

    for i, word in enumerate(words):
        if word.lower() == "amount:":
            try:
                amount = float(words[i+1])
                currency = words[i+2] if len(words) > i+2 else "FCFA"
            except ValueError:
                amount = 0

    # Insert transaction into database
    cursor.execute('''
        INSERT INTO transactions (date, sender, receiver, amount, currency, transaction_type)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (date, sender, receiver, amount, currency, transaction_type))

    transaction_count += 1

# Commit and close connection
connection.commit()
connection.close()

print(f"Transactions imported successfully! ({transaction_count} transactions inserted)")
