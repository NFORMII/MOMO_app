import os
import re
import xml.etree.ElementTree as ET
from datetime import datetime
import logging
import uuid

from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy

# Setup logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

basedir = os.path.abspath(os.path.dirname(__file__))

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///momo_transactions.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define Transaction model
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.String(50), unique=True, nullable=True)  # Changed to nullable=True
    date = db.Column(db.DateTime, nullable=False)
    type = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    balance = db.Column(db.Integer, nullable=False)
    fee = db.Column(db.Integer, nullable=False)
    sender = db.Column(db.String(100), nullable=False)
    recipient = db.Column(db.String(100), nullable=False)

def parse_date(date_str):
    try:
        return datetime.strptime(date_str, '%d %b %Y %I:%M:%S %p')
    except ValueError:
        logger.error(f"Date parsing error for date: {date_str}")
        return None

def parse_amount(amount_str):
    try:
        return int(amount_str.replace(',', '').strip())
    except (ValueError, AttributeError):
        return 0

def parse_transaction_type(body):
    body_lower = body.lower()
    if "received" in body_lower or "bank deposit" in body_lower or "cash deposit" in body_lower:
        return "deposit"
    elif "payment" in body_lower:
        return "payment"
    elif "transferred to" in body_lower:
        return "transfer"
    return "other"

def generate_fallback_transaction_id():
    return f"GEN-{str(uuid.uuid4())[:8]}"

def parse_xml_to_db():
    xml_path = os.path.join(basedir, 'data', 'transactions.xml')
    if not os.path.exists(xml_path):
        logger.error(f"Error: XML file not found at {xml_path}")
        return

    logger.debug(f"Parsing XML file from: {xml_path}")

    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()
    except ET.ParseError as e:
        logger.error(f"XML ParseError: {e}")
        return

    for sms in root.findall('sms'):
        try:
            body = sms.get('body')
            date_str = sms.get('readable_date')
            date = parse_date(date_str)
            
            if not date:
                logger.error(f"Skipping SMS due to invalid date: {date_str}")
                continue

            txn_id_match = re.search(r'TxId:?[\s*]*(\d+)', body)
            amount_match = re.search(r'(\d+,?\d*)\s*RWF', body)
            balance_match = re.search(r'new balance:?[\s*]*(\d+,?\d*)\s*RWF', body, re.IGNORECASE)
            fee_match = re.search(r'Fee\s*was:?[\s*]*(\d+,?\d*)\s*RWF', body, re.IGNORECASE)
            sender_match = re.search(r'from\s+(.*?)(?:\s*\(\*+|\son)', body, re.IGNORECASE)
            recipient_match = re.search(r'to\s+(.*?)(?:\s*\d+|\sat)', body, re.IGNORECASE)

            # Generate a transaction ID if none is found
            transaction_id = txn_id_match.group(1) if txn_id_match else generate_fallback_transaction_id()
            
            transaction = Transaction(
                transaction_id=transaction_id,
                date=date,
                type=parse_transaction_type(body),
                amount=parse_amount(amount_match.group(1)) if amount_match else 0,
                balance=parse_amount(balance_match.group(1)) if balance_match else 0,
                fee=parse_amount(fee_match.group(1)) if fee_match else 0,
                sender=sender_match.group(1).strip() if sender_match else 'Unknown',
                recipient=recipient_match.group(1).strip() if recipient_match else 'Unknown'
            )

            db.session.add(transaction)
            logger.debug(f"Added transaction: {transaction.transaction_id}")
        except Exception as e:
            logger.error(f"Error processing SMS: {e}")
            continue

    try:
        db.session.commit()
        logger.info("Successfully committed transactions to database")
    except Exception as e:
        logger.error(f"Error committing to database: {e}")
        db.session.rollback()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/test')
def test():
    return "Test route works!"

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

@app.route('/api/dashboard-data', methods=['GET'])
@app.route('/api/dashboard-data/', methods=['GET'])
def dashboard_data():
    transactions = Transaction.query.all()

    total_transactions = len(transactions)
    total_amount = sum(tx.amount for tx in transactions)
    type_distribution = {}
    recent_transactions = []

    for tx in transactions:
        type_distribution[tx.type] = type_distribution.get(tx.type, 0) + 1
        recent_transactions.append({
            "id": tx.id,
            "recipient": tx.recipient,
            "type": tx.type,
            "amount": tx.amount,
            "status": "completed"
        })

    return jsonify({
        "totalTransactions": total_transactions,
        "totalAmount": total_amount,
        "typeDistribution": type_distribution,
        "recentTransactions": recent_transactions
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        parse_xml_to_db()
        logger.info("App finished execution")
        app.run(debug=True)