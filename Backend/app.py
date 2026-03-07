# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow React frontend to call API

# Map quiz answers to scores
score_map = {
    "Strongly Agree": 5,
    "Agree": 4,
    "Neutral": 3,
    "Disagree": 2,
    "Strongly Disagree": 1
}

@app.route('/')
def home():
    return "SthablyM Subject Stream API is running"

@app.route('/api/submit-quiz', methods=['POST'])
def submit_quiz():
    data = request.json  # { "answers": { category: [answers...] } }
    scores = {}

    # Calculate scores
    for category, answers in data.get('answers', {}).items():
        if not answers:
            scores[category] = 0
        else:
            total = 0
            for ans in answers:
                try:
                    # Numeric answers (from math challenge)
                    total += int(ans)
                except ValueError:
                    # Text answers (Strongly Agree → 5)
                    total += score_map.get(ans, 3)
            scores[category] = total

    # Recommended streams (exclude maths)
    stream_scores = {k: v for k, v in scores.items() if k != "Maths Aptitude & Interest"}
    if stream_scores:
        max_score = max(stream_scores.values())
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
        "recommended_streams": recommended_streams,
        "maths_recommendation": maths_recommendation,
        "scores": scores
    })

if __name__ == '__main__':
    app.run(debug=True)