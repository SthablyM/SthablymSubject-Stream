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
# SIGNATURE GENERATOR (FIXED)
# ─────────────────────────────
def generate_signature(data, passphrase=""):
    data = {
        k: v for k, v in data.items()
        if k != "signature" and v is not None and v != ""
    }

    sorted_items = sorted(data.items())
    query_string = urllib.parse.urlencode(sorted_items, doseq=True)

    if passphrase:
        query_string += f"&passphrase={passphrase}"

    return hashlib.md5(query_string.encode("utf-8")).hexdigest()

# ─────────────────────────────
# HOME
# ─────────────────────────────
@app.route("/")
def home():
    return "Sthablym Subject Stream API is running ✅"

# ─────────────────────────────
# QUIZ API
# ─────────────────────────────
@app.route("/api/submit-quiz", methods=["POST"])
def submit_quiz():
    data = request.json or {}

    return jsonify({
        "status": "ok",
        "data": data
    })

# ─────────────────────────────
# PDF GENERATION
# ─────────────────────────────
@app.route("/api/generate-report", methods=["POST"])
def generate_report():
    if not PDF_ENABLED:
        return jsonify({"error": "PDF disabled"}), 500

    data = request.get_json()

    student = data.get("student", {})
    stream_scores = data.get("streamScores", {})
    math_results = data.get("mathResults")

    try:
        pdf_bytes = generate_pdf(student, stream_scores, math_results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    name = student.get("name", "Student")
    surname = student.get("surname", "")
    filename = f"Sthablym_Report_{name}_{surname}.pdf".replace(" ", "_")

    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name=filename
    )

# ─────────────────────────────
# PAYFAST WEBHOOK (FINAL FIXED VERSION)
# ─────────────────────────────
@app.route("/api/payfast/notify", methods=["GET", "POST"])
def payfast_notify():
    if request.method == "GET":
        return "PayFast webhook is live ✅", 200

    try:
        data = request.form.to_dict() if request.form else {}
        data.update(request.get_json(silent=True) or {})

        print("💰 PAYFAST RAW DATA:", data)

        if not data:
            return jsonify({"status": "no data received"}), 400

        received_signature = data.get("signature", "")
        calculated_signature = generate_signature(data, PAYFAST_PASSPHRASE)

        if received_signature != calculated_signature:
            print("❌ Invalid PayFast signature")
            return jsonify({"status": "invalid signature"}), 400

        payment_status = data.get("payment_status", "").upper()

        if payment_status == "COMPLETE":
            print("✅ Payment completed")

            email = data.get("email_address") or data.get("customer_email")

            if email:
                activate_subscription(email)
                print(f"🎉 Subscription activated for {email}")

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("🔥 WEBHOOK ERROR:", str(e))
        return jsonify({"error": str(e)}), 500
# ─────────────────────────────
# RUN APP
# ─────────────────────────────
if __name__ == "__main__":
    app.run(debug=True)