from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

# Function to query the database and fetch transaction data
def get_transactions():
    connection = sqlite3.connect('momo_data.db')
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM transactions')
    rows = cursor.fetchall()
    connection.close()
    
    # Convert rows to a list of dictionaries
    transactions = []
    for row in rows:
        transactions.append({
            'id': row[0],
            'date': row[1],
            'sender': row[2],
            'receiver': row[3],
            'amount': row[4],
            'currency': row[5],
            'transaction_type': row[6]
        })
    return transactions

# Define an endpoint for fetching transactions
@app.route('/transactions', methods=['GET'])
def transactions():
    transactions = get_transactions()
    return jsonify(transactions)

# Run the application
if __name__ == '__main__':
    app.run(debug=True)
