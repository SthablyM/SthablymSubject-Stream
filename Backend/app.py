from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io
import hashlib
import urllib.parse
import sqlite3

# ─────────────────────────────
# PDF IMPORT
# ─────────────────────────────
try:
    from generate_report import generate_pdf
    PDF_ENABLED = True
except ImportError:
    PDF_ENABLED = False
    print("⚠️ generate_report.py not found — PDF disabled")

app = Flask(__name__)
CORS(app)

# ─────────────────────────────
# PAYFAST CONFIG
# ─────────────────────────────
PAYFAST_PASSPHRASE = "mmathapelo/1S"

# ─────────────────────────────
# DATABASE SETUP
# ─────────────────────────────
def init_db():
    conn = sqlite3.connect("subscriptions.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            status TEXT
        )
    """)

    conn.commit()
    conn.close()

init_db()

def activate_subscription(email):
    conn = sqlite3.connect("subscriptions.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT OR REPLACE INTO subscriptions (email, status)
        VALUES (?, ?)
    """, (email, "active"))

    conn.commit()
    conn.close()

def is_subscribed(email):
    conn = sqlite3.connect("subscriptions.db")
    cursor = conn.cursor()

    cursor.execute("SELECT status FROM subscriptions WHERE email = ?", (email,))
    result = cursor.fetchone()

    conn.close()
    return result and result[0] == "active"

# ─────────────────────────────
# SIGNATURE GENERATOR
# ─────────────────────────────
def generate_signature(data, passphrase=""):
    data = {k: v for k, v in data.items() if k != "signature"}
    sorted_items = sorted(data.items())
    query_string = urllib.parse.urlencode(sorted_items)

    if passphrase:
        query_string += f"&passphrase={passphrase}"

    return hashlib.md5(query_string.encode()).hexdigest()

# ─────────────────────────────
# HOME
# ─────────────────────────────
@app.route("/")
def home():
    return "Sthablym Subject Stream API is running ✅"

# ─────────────────────────────
# QUIZ
# ─────────────────────────────
@app.route("/api/submit-quiz", methods=["POST"])
def submit_quiz():
    data = request.json or {}
    return jsonify({"status": "ok", "data": data})

# ─────────────────────────────