from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io
import hashlib
import urllib.parse
import sqlite3
import uuid

# PDF Generation Import
try:
    from generate_report import generate_pdf
    PDF_ENABLED = True
except ImportError:
    PDF_ENABLED = False
    print("⚠️ generate_report.py not found — PDF disabled")

app = Flask(__name__)
# Update origins to include your production frontend
CORS(app, origins=["http://localhost:3000", "https://sthablymsubject-stream.surge.sh"])

# ─────────────────────────────
# CONFIGURATION
# ─────────────────────────────
PAYFAST_MERCHANT_ID  = "34129067"
PAYFAST_MERCHANT_KEY = "tgki9qvkzzhr1"
PAYFAST_PASSPHRASE   = "mmathapelo/1S"

FRONTEND_URL = "https://sthablymsubject-stream.surge.sh"
BACKEND_URL  = "https://your-backend.railway.app"  # ← Update this to your actual Railway URL

SANDBOX = False  # Set to True for testing with PayFast Sandbox credentials
PAYFAST_BASE = (
    "https://sandbox.payfast.co.za/eng/process"
    if SANDBOX else "https://www.payfast.co.za/eng/process"
)

PLAN_CONFIG = {
    "student_plus":   {"name": "Stablym Student Plus",   "amount": "49.00"},
    "matric_booster": {"name": "Stablym Matric Booster", "amount": "69.00"},
    "student_basic":  {"name": "Stablym Student",         "amount": "29.00"},
    "student_premium":{"name": "Stablym Premium",        "amount": "99.00"},
    "parent":         {"name": "Stablym Parent Plan",    "amount": "79.00"},
    "school_starter": {"name": "Stablym School Starter", "amount": "500.00"},
    "school_standard":{"name": "Stablym School Standard","amount": "1000.00"},
    "school_pro":      {"name": "Stablym School Pro",     "amount": "2000.00"},
    "school":         {"name": "Stablym School",         "amount": "500.00"},
}

# ─────────────────────────────
# DATABASE HELPERS
# ─────────────────────────────
def init_db():
    conn = sqlite3.connect("subscriptions.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            plan TEXT,
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
    """, (email.lower().strip(), plan, payment_id))
    conn.commit()
    conn.close()

def is_subscribed(email):
    conn = sqlite3.connect("subscriptions.db")
    cursor = conn.cursor()
    cursor.execute("SELECT status FROM subscriptions WHERE email = ?", (email.lower().strip(),))
    result = cursor.fetchone()
    conn.close()
    return result and result[0] == "active"

# ─────────────────────────────
# SIGNATURE HELPER (The Fix)
# ─────────────────────────────
def generate_signature(data: dict, passphrase: str = "") -> str:
    """Builds MD5 signature. Filters empty values to prevent mismatches."""
    # 1. Filter out 'signature' and any empty/null values
    filtered = {k: v for k, v in data.items() if k != "signature" and v not in (None, "")}
    
    # 2. Sort alphabetically (Required by PayFast)
    sorted_items = sorted(filtered.items())
    
    # 3. URL Encode using quote_plus (converts spaces to +)
    query = urllib.parse.urlencode(sorted_items)
    
    # 4. Append Passphrase if it exists
    if passphrase:
        query += f"&passphrase={urllib.parse.quote_plus(passphrase)}"
    
    return hashlib.md5(query.encode("utf-8")).hexdigest()

# ─────────────────────────────
# ROUTES
# ─────────────────────────────

@app.route("/")
def home():
    return "Sthablym Subject Stream API is running ✅"

@app.route("/api/subscribe", methods=["GET", "POST"])
def subscribe():
    """Builds the PayFast form and handles the auto-POST redirect."""
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

    # Build base params
    pf_params = {
        "merchant_id":   PAYFAST_MERCHANT_ID,
        "merchant_key":  PAYFAST_MERCHANT_KEY,
        "return_url":    f"{FRONTEND_URL}?payment=success&plan={plan_key}&email={urllib.parse.quote(email)}",
        "cancel_url":    f"{FRONTEND_URL}?payment=cancelled",
        "notify_url":    f"{BACKEND_URL}/api/payfast/notify",
        "m_payment_id":  payment_id,
        "amount":        plan["amount"],
        "item_name":     plan["name"],
    }

    # IMPORTANT: Only add optional fields if they are NOT empty
    # This keeps the Signature and the HTML Form fields perfectly in sync
    if email: pf_params["email_address"] = email.strip()
    if first: pf_params["name_first"] = first.strip()
    if last:  pf_params["name_last"] = last.strip()

    # Generate the signature
    pf_params["signature"] = generate_signature(pf_params, PAYFAST_PASSPHRASE)

    # Build the auto-submit form
    fields = "".join(f'<input type="hidden" name="{k}" value="{v}">' for k, v in pf_params.items())
    
    html = f"""<!DOCTYPE html><html><body>
    <div style="text-align:center; margin-top:50px;">
        <h2>Redirecting to Secure Payment...</h2>
        <form id="pf" action="{PAYFAST_BASE}" method="POST">{fields}</form>
    </div>
    <script>document.getElementById('pf').submit();</script>
    </body></html>"""
    
    return html, 200, {"Content-Type": "text/html"}

@app.route("/api/check-subscription", methods=["GET"])
def check_subscription():
    email = request.args.get("email", "").strip().lower()
    if not email:
        return jsonify({"error": "email required"}), 400
    active = is_subscribed(email)
    return jsonify({"email": email, "active": active})

@app.route("/api/payfast/notify", methods=["POST"])
def payfast_notify():
    """Webhook for PayFast ITN."""
    try:
        data = request.form.to_dict()
        
        # Validate signature sent by PayFast
        received_sig = data.get("signature", "")
        calculated_sig = generate_signature(data, PAYFAST_PASSPHRASE)

        if received_sig != calculated_sig:
            print("❌ Webhook Signature Mismatch")
            return "Invalid signature", 400

        if data.get("payment_status") == "COMPLETE":
            email = data.get("email_address")
            plan = data.get("item_name")
            payment_id = data.get("m_payment_id")
            activate_subscription(email, plan, payment_id)
            
        return "OK", 200
    except Exception as e:
        return str(e), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)