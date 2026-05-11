from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
import urllib.parse
import uuid

app = Flask(__name__)
CORS(app, origins=["*"])

PAYFAST_MERCHANT_ID  = "34129067"
PAYFAST_MERCHANT_KEY = "tgki9qvkzzhr1"
PAYFAST_PASSPHRASE   = "mmathapelo/1S"

FRONTEND_URL = "https://sthablymsubject-stream.surge.sh"
BACKEND_URL  = "https://sthablymsubject-stream.onrender.com"
PAYFAST_URL  = "https://www.payfast.co.za/eng/process"

PLAN_CONFIG = {
    "student_plus":    {"name": "Stablym Student Plus",   "amount": "29.00"},
    "matric_booster":  {"name": "Stablym Matric Booster", "amount": "69.00"},
    "student_basic":   {"name": "Stablym Student",        "amount": "29.00"},
    "student_premium": {"name": "Stablym Premium",        "amount": "99.00"},
    "school_starter":  {"name": "Stablym School Starter", "amount": "500.00"},
    "school_standard": {"name": "Stablym School Standard","amount": "1000.00"},
    "school_pro":      {"name": "Stablym School Pro",     "amount": "2000.00"},
}


def generate_signature(data: dict, debug: bool = False) -> str:
    """
    PayFast signature — merchant_key is EXCLUDED from the hash.
    Only non-empty values, sorted alphabetically, quote_plus encoded,
    then passphrase appended.
    """
    EXCLUDE = {"signature", "merchant_key"}

    filtered = {
        k: v for k, v in data.items()
        if k not in EXCLUDE
        and v is not None
        and str(v).strip() != ""
    }

    # Sort alphabetically
    sorted_items = sorted(filtered.items())

    # urlencode uses quote_plus (spaces → +)
    query_string = urllib.parse.urlencode(sorted_items)

    # Append passphrase (also quote_plus encoded)
    passphrase_encoded = urllib.parse.quote_plus(PAYFAST_PASSPHRASE)
    query_string_with_pass = query_string + "&passphrase=" + passphrase_encoded

    sig = hashlib.md5(query_string_with_pass.encode("utf-8")).hexdigest()

    if debug:
        print("\n========== PAYFAST SIGNATURE DEBUG ==========")
        print(f"EXCLUDED keys: {EXCLUDE}")
        print(f"\nFILTERED params ({len(filtered)} keys):")
        for k, v in sorted_items:
            print(f"  {k} = {repr(v)}")
        print(f"\nQUERY STRING (before passphrase):\n  {query_string}")
        print(f"\nPASSPHRASE raw:     {repr(PAYFAST_PASSPHRASE)}")
        print(f"PASSPHRASE encoded: {repr(passphrase_encoded)}")
        print(f"\nFULL STRING TO SIGN:\n  {query_string_with_pass}")
        print(f"\nMD5 SIGNATURE: {sig}")
        print("=============================================\n")

    return sig


@app.route("/api/subscribe", methods=["GET", "POST"])
def subscribe():
    args = request.args if request.method == "GET" else (request.get_json(silent=True) or request.form)

    plan_key = args.get("plan", "student_basic")
    email    = args.get("email", "").strip()
    first    = args.get("first", "").strip()
    last     = args.get("last", "").strip()

    plan = PLAN_CONFIG.get(plan_key)
    if not plan:
        return jsonify({"error": f"Unknown plan: {plan_key}"}), 400

    payment_id = f"STB-{plan_key.upper()}-{uuid.uuid4().hex[:8].upper()}"

    pf = {
        "merchant_id":  PAYFAST_MERCHANT_ID,
        "merchant_key": PAYFAST_MERCHANT_KEY,
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

    # Generate with debug logging — remove debug=True once it works
    pf["signature"] = generate_signature(pf, debug=True)

    hidden_fields = "\n".join(
        f'<input type="hidden" name="{k}" value="{v}">'
        for k, v in pf.items()
    )

    html = f"""<!DOCTYPE html>
<html>
<head><title>Redirecting to PayFast...</title></head>
<body style="font-family:sans-serif;text-align:center;padding-top:80px;background:#0a0e1a;color:#fff">
  <h2>Redirecting to secure payment...</h2>

  <!-- DEBUG TABLE — remove before go-live -->
  <details style="margin:20px auto;max-width:600px;text-align:left;background:#1e293b;padding:16px;border-radius:8px">
    <summary style="cursor:pointer;color:#7dd3fc;font-size:13px">🔍 Debug: params being sent to PayFast</summary>
    <table style="width:100%;font-size:12px;font-family:monospace;margin-top:12px;border-collapse:collapse">
      {"".join(f'<tr><td style="color:#94a3b8;padding:3px 8px;border-bottom:1px solid #334155">{k}</td><td style="color:#e2e8f0;padding:3px 8px;border-bottom:1px solid #334155;word-break:break-all">{v}</td></tr>' for k, v in pf.items())}
    </table>
  </details>

  <form id="pf" action="{PAYFAST_URL}" method="POST">
    {hidden_fields}
  </form>

  <button onclick="document.getElementById('pf').submit()"
    style="margin-top:20px;padding:12px 28px;background:#0ea5e9;color:#fff;border:none;border-radius:8px;font-size:15px;cursor:pointer">
    Continue to PayFast →
  </button>
  <p style="color:rgba(255,255,255,.4);font-size:12px;margin-top:8px">
    Check the debug table above — expand it before clicking to verify all fields
  </p>
</body>
</html>"""

    return html, 200, {"Content-Type": "text/html"}


@app.route("/api/test-signature")
def test_signature():
    """
    Hit /api/test-signature to see exactly what your signature looks like
    with a known set of params — useful for comparing against PayFast's sandbox.
    """
    test_params = {
        "merchant_id":  PAYFAST_MERCHANT_ID,
        "merchant_key": PAYFAST_MERCHANT_KEY,
        "return_url":   f"{FRONTEND_URL}?payment=success",
        "cancel_url":   f"{FRONTEND_URL}?payment=cancelled",
        "notify_url":   f"{BACKEND_URL}/api/payfast/notify",
        "m_payment_id": "STB-TEST-00000001",
        "amount":       "29.00",
        "item_name":    "Stablym Student Plus",
        "name_first":   "Test",
        "name_last":    "User",
        "email_address":"test@example.com",
    }

    EXCLUDE = {"signature", "merchant_key"}
    filtered = {k: v for k, v in test_params.items() if k not in EXCLUDE and v}
    sorted_items = sorted(filtered.items())
    query_string = urllib.parse.urlencode(sorted_items)
    passphrase_encoded = urllib.parse.quote_plus(PAYFAST_PASSPHRASE)
    full_string = query_string + "&passphrase=" + passphrase_encoded
    sig = hashlib.md5(full_string.encode("utf-8")).hexdigest()

    return jsonify({
        "params_signed": dict(sorted_items),
        "params_excluded": list(EXCLUDE),
        "query_string": query_string,
        "passphrase_raw": PAYFAST_PASSPHRASE,
        "passphrase_encoded": passphrase_encoded,
        "full_string_to_sign": full_string,
        "signature": sig,
        "tip": "Compare 'full_string_to_sign' against PayFast's own signature generator at https://sandbox.payfast.co.za/eng/process"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)