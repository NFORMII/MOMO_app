from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

# Function to fetch transactions from the database
def get_transactions():
    conn = sqlite3.connect("momo_data.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions")
    data = cursor.fetchall()
    conn.close()
    return data

# API route to get all transactions
@app.route("/transactions", methods=["GET"])
def transactions():
    data = get_transactions()
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
    