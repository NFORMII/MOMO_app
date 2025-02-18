from flask import Flask, jsonify, send_from_directory
import sqlite3
import os

app = Flask(__name__)

# Enable CORS for development
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Function to query the database and fetch transaction data
def get_transactions():
    try:
        connection = sqlite3.connect('momo_data.db')
        cursor = connection.cursor()
        
        # Check if table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='transactions'")
        if not cursor.fetchone():
            # Return empty list if table doesn't exist
            return []
        
        cursor.execute('SELECT * FROM transactions')
        rows = cursor.fetchall()
        
        # Get column names
        cursor.execute('PRAGMA table_info(transactions)')
        columns = [col[1] for col in cursor.fetchall()]
        
        connection.close()
        
        # Convert rows to a list of dictionaries
        transactions = []
        for row in rows:
            transaction = {}
            for i, column in enumerate(columns):
                if i < len(row):
                    transaction[column] = row[i]
            transactions.append(transaction)
        
        return transactions
    
    except Exception as e:
        print(f"Error fetching transactions: {e}")
        return []

# Define an endpoint for fetching transactions
@app.route('/transactions', methods=['GET'])
def transactions():
    transactions = get_transactions()
    return jsonify(transactions)

# Serve static files
@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def serve_static(path):
    if path != "" and os.path.exists(path):
        return send_from_directory('.', path)
    else:
        return send_from_directory('.', 'index.html')

# Run the application
if __name__ == '__main__':
    app.run(debug=True)
