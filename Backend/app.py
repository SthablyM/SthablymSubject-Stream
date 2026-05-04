from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io
import hashlib
import urllib.parse

# ─────────────────────────────────────────────
# PDF IMPORT
# ─────────────────────────────────────────────
try:
    from generate_report import generate_pdf
    PDF_ENABLED = True
except ImportError:
    PDF_ENABLED = False
    print("⚠️ generate_report.py not found — PDF disabled")

app = Flask(__name__)
CORS(app)
active_subscriptions = set()
# ─────────────────────────────────────────────
# PAYFAST CONFIG
# ─────────────────────────────────────────────
PAYFAST_PASSPHRASE = "mmathapelo/1S"

# ─────────────────────────────────────────────
# SIGNATURE GENERATOR
# ─────────────────────────────────────────────
def generate_signature(data, passphrase=""):
    data = {k: v for k, v in data.items() if k != "signature"}
    sorted_items = sorted(data.items())
    query_string = urllib.parse.urlencode(sorted_items)

    if passphrase:
        query_string += f"&passphrase={passphrase}"

    return hashlib.md5(query_string.encode()).hexdigest()

# ─────────────────────────────────────────────
# SCORE MAP
# ─────────────────────────────────────────────
score_map = {
    "Strongly Agree": 5,
    "Agree": 4,
    "Neutral": 3,
    "Disagree": 2,
    "Strongly Disagree": 1
}

# ─────────────────────────────────────────────
# HOME
# ─────────────────────────────────────────────
@app.route("/")
def home():
    return "Sthablym Subject Stream API is running ✅"

# ─────────────────────────────────────────────
# QUIZ LOGIC
# ─────────────────────────────────────────────
@app.route("/api/submit-quiz", methods=["POST"])
def submit_quiz():
    data = request.json or {}
    scores = {}

    for category, answers in data.get("answers", {}).items():
        total = 0

        for ans in answers:
            try:
                total += int(ans)
            except:
                total += score_map.get(ans, 3)

        scores[category] = total

    stream_scores = {
        k: v for k, v in scores.items()
        if k != "Maths Aptitude & Interest"
    }

    recommended_streams = []
    if stream_scores:
        max_score = max(stream_scores.values())
        recommended_streams = [
            k for k, v in stream_scores.items() if v == max_score
        ]

    maths_score = scores.get("Maths Aptitude & Interest", 0)

    if maths_score >= 20:
        maths_recommendation = "PURE MATHS"
    elif maths_score >= 15:
        maths_recommendation = "TECHNICAL MATHS"
    else:
        maths_recommendation = "MATHS LITERACY"

    return jsonify({
        "scores": scores,
        "recommended_streams": recommended_streams,
        "maths_recommendation": maths_recommendation
    })

# ─────────────────────────────────────────────
# PDF GENERATION
# ─────────────────────────────────────────────
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

# ─────────────────────────────────────────────
# PAYFAST WEBHOOK (SECURE)
# ─────────────────────────────────────────────
@app.route("/api/payfast/notify", methods=["POST"])
def payfast_notify():
    data = request.form.to_dict() or request.json or {}

    print("💰 PAYFAST RAW DATA:", data)

    # ───── VERIFY SIGNATURE ─────
    received_signature = data.get("signature")
    calculated_signature = generate_signature(data, PAYFAST_PASSPHRASE)

    if received_signature != calculated_signature:
        print("❌ Invalid PayFast signature")
        return jsonify({"status": "invalid signature"}), 400

    # ───── CHECK PAYMENT STATUS ─────
    if data.get("payment_status") == "COMPLETE":
        print("✅ Payment completed for:", data.get("item_name"))

        # OPTIONAL: activate subscription
        email = data.get("email_address") or data.get("customer_email")

        if email:
            active_subscriptions.add(email)
            print(f"🎉 Subscription activated for {email}")

    return jsonify({"status": "ok"}), 200
# RUN APP
# ─────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True)