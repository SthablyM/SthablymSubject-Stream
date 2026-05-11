from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import hashlib
import urllib.parse
import sqlite3
import uuid

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "https://sthablymsubject-stream.surge.sh"])

# ── CONFIG ────────────────────────────────────────────────────────────────────
PAYFAST_MERCHANT_ID  = "34129067"
PAYFAST_MERCHANT_KEY = "tgki9qvkzzhr1"
PAYFAST_PASSPHRASE   = "mmathapelo/1S"

FRONTEND_URL = "https://sthablymsubject-stream.surge.sh"
BACKEND_URL  = "https://YOUR-APP.onrender.com"   # ← your actual Render URL

PAYFAST_URL  = "https://www.payfast.co.za/eng/process"

PLAN_CONFIG = {
    "student_basic":   {"name": "Stablym Student",          "amount": "29.00"},
    "student_premium": {"name": "Stablym Premium",          "amount": "99.00"},
    "parent":          {"name": "Stablym Parent Plan",      "amount": "79.00"},
    "school_starter":  {"name": "Stablym School Starter",   "amount": "500.00"},
    "school_standard": {"name": "Stablym School Standard",  "amount": "1000.00"},
    "school_pro":      {"name": "Stablym School Pro",       "amount": "2000.00"},
    "uni_basic":       {"name": "Stablym University Listed","amount": "1000.00"},
    "uni_premium":     {"name": "Stablym University Featured","amount": "5000.00"},
    "pack_subject":    {"name": "Stablym Subject Pack",     "amount": "49.00"},
    "pack_aps":        {"name": "Stablym APS Report",       "amount": "149.00"},
}

# ── DATABASE ──────────────────────────────────────────────────────────────────
def init_db():
    conn = sqlite3.connect("subscriptions.db")
    conn.execute("""
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

def activate_subscription(email, plan="", payment_id=""):
    conn = sqlite3.connect("subscriptions.db")
    conn.execute("""
        INSERT INTO subscriptions (email, plan, status, payment_id)
        VALUES (?, ?, 'active', ?)
        ON CONFLICT(email) DO UPDATE SET
            status='active', plan=excluded.plan, payment_id=excluded.payment_id
    """, (email.lower().strip(), plan, payment_id))
    conn.commit()
    conn.close()

def is_subscribed(email):
    conn = sqlite3.connect("subscriptions.db")
    cur = conn.execute(
        "SELECT status FROM subscriptions WHERE email = ?",
        (email.lower().strip(),)
    )
    row = cur.fetchone()
    conn.close()
    return row and row[0] == "active"

# ── SIGNATURE — THE CRITICAL FUNCTION ────────────────────────────────────────
def generate_signature(data: dict) -> str:
    EXCLUDE = {"signature", "merchant_key"}   # ← add merchant_key here
    filtered = {
        k: v for k, v in data.items()
        if k not in EXCLUDE and v is not None and str(v).strip() != ""
    }
    query_string = urllib.parse.urlencode(sorted(filtered.items()))
    if PAYFAST_PASSPHRASE:
        query_string += "&passphrase=" + urllib.parse.quote_plus(PAYFAST_PASSPHRASE)
    return hashlib.md5(query_string.encode("utf-8")).hexdigest()

# ── ROUTES ────────────────────────────────────────────────────────────────────
@app.route("/")
def home():
    return "Sthablym API running ✅"

@app.route("/api/subscribe", methods=["GET", "POST"])
def subscribe():
    if request.method == "GET":
        args     = request.args
    else:
        args     = request.get_json(silent=True) or request.form

    plan_key = args.get("plan", "student_basic")
    email    = args.get("email", "").strip()
    first    = args.get("first", "").strip()
    last     = args.get("last", "").strip()
    phone    = args.get("phone", "").strip()

    plan = PLAN_CONFIG.get(plan_key)
    if not plan:
        return jsonify({"error": f"Unknown plan: {plan_key}"}), 400

    payment_id = f"STB-{plan_key.upper()}-{uuid.uuid4().hex[:8].upper()}"

    # ── Build params dict ──────────────────────────────────────────────────
    # IMPORTANT: Only include optional fields if they have a value.
    # An empty field included here but absent from PayFast's copy = mismatch.
    pf = {
        "merchant_id":  PAYFAST_MERCHANT_ID,
        "merchant_key": PAYFAST_MERCHANT_KEY,   # stays in form
        "return_url":   f"{FRONTEND_URL}?payment=success&email={urllib.parse.quote_plus(email)}",
        "cancel_url":   f"{FRONTEND_URL}?payment=cancelled",
        "notify_url":   f"{BACKEND_URL}/api/payfast/notify",
        "m_payment_id": payment_id,
        "amount":       plan["amount"],
        "item_name":    plan["name"],
    }
    if first:  pf["name_first"]    = first
    if last:   pf["name_last"]     = last
    if email:  pf["email_address"] = email

    pf["signature"] = generate_signature(pf)   # merchant_key excluded inside the function

    # ── Build auto-submit HTML form ────────────────────────────────────────
    hidden_fields = "\n".join(
        f'<input type="hidden" name="{k}" value="{v}">'
        for k, v in pf.items()
    )

    html = f"""<!DOCTYPE html>
<html>
<head><title>Redirecting to PayFast...</title></head>
<body style="font-family:sans-serif;text-align:center;padding-top:80px;background:#0a0e1a;color:#fff">
  <h2>Redirecting to secure payment...</h2>
  <p style="color:rgba(255,255,255,.5)">Please do not close this window.</p>
  <form id="pf" action="{PAYFAST_URL}" method="POST">
    {hidden_fields}
  </form>
  <script>document.getElementById('pf').submit();</script>
</body>
</html>"""

    return html, 200, {"Content-Type": "text/html"}


@app.route("/api/check-subscription", methods=["GET"])
def check_subscription():
    email = request.args.get("email", "").strip().lower()
    if not email:
        return jsonify({"error": "email required"}), 400
    return jsonify({"email": email, "active": is_subscribed(email)})


@app.route("/api/payfast/notify", methods=["POST"])
def payfast_notify():
    """PayFast ITN webhook — called server-to-server after payment."""
    try:
        data = request.form.to_dict()

        # Validate the signature PayFast sends us
        received  = data.get("signature", "")
        expected  = generate_signature(data)

        if received != expected:
            print(f"❌ ITN sig mismatch. Got: {received} | Expected: {expected}")
            return "Invalid signature", 400

        if data.get("payment_status") == "COMPLETE":
            activate_subscription(
                email      = data.get("email_address", ""),
                plan       = data.get("item_name", ""),
                payment_id = data.get("m_payment_id", ""),
            )
            print(f"✅ Activated: {data.get('email_address')}")

        return "OK", 200

    except Exception as e:
        print(f"ITN error: {e}")
        return str(e), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)