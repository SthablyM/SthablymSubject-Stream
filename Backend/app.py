# backend/app.py
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io

# Import the PDF generator (place generate_report.py in the same folder as app.py)
try:
    from generate_report import generate_pdf
    PDF_ENABLED = True
except ImportError:
    PDF_ENABLED = False
    print("⚠️  generate_report.py not found — PDF download will be disabled.")

app = Flask(__name__)
CORS(app)

# Map quiz answers to scores
score_map = {
    "Strongly Agree": 5,
    "Agree": 4,
    "Neutral": 3,
    "Disagree": 2,
    "Strongly Disagree": 1
}

# ─── HOME ─────────────────────────────────────────────────────────────────────
@app.route("/")
def home():
    return "Stablym Subject Stream API is running ✅"

# ─── SUBMIT QUIZ ──────────────────────────────────────────────────────────────
@app.route("/api/submit-quiz", methods=["POST"])
def submit_quiz():
    data   = request.json  # { "answers": { category: [answers...] } }
    scores = {}

    for category, answers in data.get("answers", {}).items():
        if not answers:
            scores[category] = 0
        else:
            total = 0
            for ans in answers:
                try:
                    total += int(ans)
                except (ValueError, TypeError):
                    total += score_map.get(ans, 3)
            scores[category] = total

    # Recommended streams (exclude Maths Aptitude category)
    stream_scores = {k: v for k, v in scores.items() if k != "Maths Aptitude & Interest"}
    if stream_scores:
        max_score          = max(stream_scores.values())
        recommended_streams = [k for k, v in stream_scores.items() if v == max_score]
    else:
        recommended_streams = []

    # Maths recommendation
    maths_score = scores.get("Maths Aptitude & Interest", 0)
    if maths_score >= 20:
        maths_recommendation = "PURE MATHS"
    elif maths_score >= 15:
        maths_recommendation = "TECHNICAL MATHS"
    else:
        maths_recommendation = "MATHS LITERACY"

    return jsonify({
        "recommended_streams":  recommended_streams,
        "maths_recommendation": maths_recommendation,
        "scores":               scores
    })

# ─── GENERATE PDF REPORT ──────────────────────────────────────────────────────
@app.route("/api/generate-report", methods=["POST"])
def generate_report_route():
    """
    Expects JSON body:
    {
      "student": {
          "name": "Thabo",
          "surname": "Nkosi",
          "school": "Soweto High School",
          "grade": "9",
          "province": "Gauteng",
          "aps": 31,
          "mathsLevel": "Pure Mathematics",
          "marks": { "english": 72, "maths": 68, "science": 65, ... }
      },
      "streamScores": {
          "Science Stream": 74,
          "Commerce Stream": 52,
          "Humanities Stream": 44,
          "Engineering / Technical Stream": 61
      },
      "mathResults": {
          "correct": 5,
          "total": 7,
          "pct": 71
      }
    }
    Returns: PDF file as a download
    """
    if not PDF_ENABLED:
        return jsonify({
            "error": "PDF generation is not available. "
                     "Make sure generate_report.py is in the same folder as app.py "
                     "and run: pip install reportlab"
        }), 500

    data          = request.get_json()
    student       = data.get("student",      {})
    stream_scores = data.get("streamScores", {})
    math_results  = data.get("mathResults",  None)

    try:
        pdf_bytes = generate_pdf(student, stream_scores, math_results)
    except Exception as e:
        return jsonify({"error": f"PDF generation failed: {str(e)}"}), 500

    name     = student.get("name",    "Student")
    surname  = student.get("surname", "")
    filename = f"Stablym_Report_{name}_{surname}.pdf".replace(" ", "_")

    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name=filename
    )

# ─── RUN ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True)