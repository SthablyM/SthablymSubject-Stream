from flask import Flask, request, jsonify, send_file, redirect
from flask_cors import CORS
import io
import hashlib
import urllib.parse
import sqlite3
import uuid

try:
    from generate_report import generate_pdf
    PDF_ENABLED = True
except ImportError:
    PDF_ENABLED = False
    print("⚠️  generate_report.py not found — PDF disabled")

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "https://sthablymsubject-stream.surge.sh"])

# ─────────────────────────────
# CONFIG  (move to .env in production)
# ─────────────────────────────
PAYFAST_MERCHANT_ID  = "34129067"
PAYFAST_MERCHANT_KEY = "tgki9qvkzzhr1"
PAYFAST_PASSPHRASE   = "mmathapelo/1S"

# Your deployed frontend URL — PayFast will redirect back here after payment
FRONTEND_URL = "https://sthablymsubject-stream.surge.sh"

# Your deployed backend URL — PayFast will POST the ITN webhook here
BACKEND_URL = "https://your-backend.railway.app"   # ← update this

# Set to True to use PayFast sandbox for testing
SANDBOX = False

PAYFAST_BASE = (
    "https://sandbox.payfast.co.za/eng/process"
    if SANDBOX
    else "https://www.payfast.co.za/eng/process"
)

PLAN_CONFIG = {
    "student_plus":   {"name": "Stablym Student Plus",   "amount": "49.00"},
    "matric_booster": {"name": "Stablym Matric Booster", "amount": "69.00"},
    "student_basic":  {"name": "Stablym Student",        "amount": "29.00"},
    "student_premium":{"name": "Stablym Premium",        "amount": "99.00"},
    "parent":         {"name": "Stablym Parent Plan",    "amount": "79.00"},
    "school_starter": {"name": "Stablym School Starter", "amount": "500.00"},
    "school_standard":{"name": "Stablym School Standard","amount": "1000.00"},
    "school_pro":     {"name": "Stablym School Pro",     "amount": "2000.00"},
    "school":         {"name": "Stablym School",         "amount": "500.00"},
}

# ─────────────────────────────
# DATABASE
# ─────────────────────────────
def init_db():
    conn = sqlite3.connect("subscriptions.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            plan  TEXT,
            status TEXT,
            payment_id TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

def activate_subscription(email, plan="unknown", payment_id=""):
    conn = sqlite3.connect("subscriptions.db")
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO subscriptions (email, plan, status, payment_id)
        VALUES (?, ?, 'active', ?)
        ON CONFLICT(email) DO UPDATE SET status='active', plan=excluded.plan, payment_id=excluded.payment_id
    """, (email, plan, payment_id))
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
# SIGNATURE HELPER
# ─────────────────────────────
def generate_signature(data: dict, passphrase: str = "") -> str:
    """Build the MD5 signature PayFast requires.
    Keys must be sorted alphabetically, 'signature' excluded."""
    filtered = {k: v for k, v in data.items() if k != "signature" and v not in (None, "")}
    query = urllib.parse.urlencode(sorted(filtered.items()))
    if passphrase:
        query += f"&passphrase={urllib.parse.quote_plus(passphrase)}"
    return hashlib.md5(query.encode("utf-8")).hexdigest()

# ─────────────────────────────
# HOME
# ─────────────────────────────
@app.route("/")
def home():
    return "Sthablym Subject Stream API is running ✅"

# ─────────────────────────────
# SUBSCRIBE  (called by frontend — builds PayFast form data)
# ─────────────────────────────
@app.route("/api/subscribe", methods=["GET", "POST"])
def subscribe():
    """
    Accepts plan name + optional user details.
    Returns a JSON payload the frontend can use to POST directly to PayFast,
    or (for server-side redirect) redirects the browser straight to PayFast.
    """
    if request.method == "GET":
        plan_key = request.args.get("plan", "student_basic")
        email    = request.args.get("email", "")
        first    = request.args.get("first", "")
        last     = request.args.get("last", "")
    else:
        body     = request.get_json(silent=True) or request.form.to_dict()
        plan_key = body.get("plan", "student_basic")
        email    = body.get("email", "")
        first    = body.get("first", "")
        last     = body.get("last", "")

    plan = PLAN_CONFIG.get(plan_key)
    if not plan:
        return jsonify({"error": f"Unknown plan: {plan_key}"}), 400

    payment_id = f"STB-{plan_key.upper()}-{uuid.uuid4().hex[:8].upper()}"

    pf_params = {
        "merchant_id":   PAYFAST_MERCHANT_ID,
        "merchant_key":  PAYFAST_MERCHANT_KEY,
        "return_url":    f"{FRONTEND_URL}?payment=success&plan={plan_key}&email={urllib.parse.quote(email)}",
        "cancel_url":    f"{FRONTEND_URL}?payment=cancelled",
        "notify_url":    f"{BACKEND_URL}/api/payfast/notify",
        "name_first":    first or "Stablym",
        "name_last":     last  or "User",
        "email_address": email,
        "m_payment_id":  payment_id,
        "amount":        plan["amount"],
        "item_name":     plan["name"],
    }

    pf_params["signature"] = generate_signature(pf_params, PAYFAST_PASSPHRASE)

    # Build an auto-submitting HTML form so the browser POSTs to PayFast
    fields = "".join(
        f'<input type="hidden" name="{k}" value="{v}">'
        for k, v in pf_params.items()
    )
    html = f"""<!DOCTYPE html><html><body>
    <form id="pf" action="{PAYFAST_BASE}" method="POST">{fields}</form>
    <script>document.getElementById('pf').submit();</script>
    </body></html>"""
    return html, 200, {"Content-Type": "text/html"}


# ─────────────────────────────
# CHECK SUBSCRIPTION STATUS
# ─────────────────────────────
@app.route("/api/check-subscription", methods=["GET"])
def check_subscription():
    email = request.args.get("email", "").strip().lower()
    if not email:
        return jsonify({"error": "email required"}), 400
    active = is_subscribed(email)
    return jsonify({"email": email, "active": active})

# ─────────────────────────────
# QUIZ API
# ─────────────────────────────
@app.route("/api/submit-quiz", methods=["POST"])
def submit_quiz():
    data = request.json or {}
    return jsonify({"status": "ok", "data": data})

# ─────────────────────────────
# PDF GENERATION
# ─────────────────────────────
@app.route("/api/generate-report", methods=["POST"])
def generate_report():
    if not PDF_ENABLED:
        return jsonify({"error": "PDF disabled"}), 500
    data         = request.get_json()
    student      = data.get("student", {})
    stream_scores = data.get("streamScores", {})
    math_results  = data.get("mathResults")
    try:
        pdf_bytes = generate_pdf(student, stream_scores, math_results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    name     = student.get("name", "Student")
    surname  = student.get("surname", "")
    filename = f"Sthablym_Report_{name}_{surname}.pdf".replace(" ", "_")
    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name=filename,
    )

# ─────────────────────────────
# PAYFAST ITN WEBHOOK
# ─────────────────────────────
@app.route("/api/payfast/notify", methods=["GET", "POST"])
def payfast_notify():
    if request.method == "GET":
        return "PayFast webhook is live ✅", 200

    try:
        data = request.form.to_dict() if request.form else {}
        data.update(request.get_json(silent=True) or {})
        print("💰 PAYFAST ITN:", data)

        if not data:
            return jsonify({"status": "no data received"}), 400

        received_sig   = data.get("signature", "")
        calculated_sig = generate_signature(data, PAYFAST_PASSPHRASE)

        if received_sig != calculated_sig:
            print(f"❌ Signature mismatch. got={received_sig} expected={calculated_sig}")
            return jsonify({"status": "invalid signature"}), 400

        if data.get("payment_status", "").upper() == "COMPLETE":
            email      = data.get("email_address") or data.get("customer_email", "")
            plan       = data.get("item_name", "unknown")
            payment_id = data.get("m_payment_id", "")
            if email:
                activate_subscription(email, plan, payment_id)
                print(f"✅ Activated subscription for {email} — {plan}")

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print("🔥 WEBHOOK ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)