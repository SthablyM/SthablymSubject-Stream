# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS



app = Flask(__name__)
CORS(app) 


score_map = {
    "Strongly Agree": 5,
    "Agree": 4,
    "Neutral": 3,
    "Disagree": 2,
    "Strongly Disagree": 1
}

# Categories mapping (for reference)
categories = [
    "Scientific Curiosity",
    "Numerical & Analytical Skills",
    "Business & Financial Interest",
    "Creativity & Expression",
    "Social Awareness & Communication",
    "Technical & Practical Skills",
    "History & Critical Thinking",
    "Maths Aptitude & Interest"
]

@app.route('/')
def home():
    return "SthablyMSUbject-Stream"

@app.route('/api/submit-quiz', methods=['POST'])
def submit_quiz():
    data = request.json  # Expected: { "answers": { category: [answer1, answer2, ...], ... } }
    scores = {}
    for category, answers in data.get('answers', {}).items():
        total = sum(score_map.get(ans, 3) for ans in answers)
        scores[category] = total

    # Determine recommended stream (excluding Maths category)
    stream_categories = {k: v for k, v in scores.items() if k != "Maths Aptitude & Interest"}
    max_score = max(stream_categories.values())
    recommended_streams = [k for k, v in stream_categories.items() if v == max_score]

    # Maths recommendation logic
    maths_score = scores.get("Maths Aptitude & Interest", 0)
    if maths_score >= 20:
        maths_recommendation = "Pure Maths"
    elif maths_score >= 15:
        maths_recommendation = "Technical Maths"
    else:
        maths_recommendation = "Maths Literacy"

    response = {
        "recommended_streams": recommended_streams,
        "maths_recommendation": maths_recommendation,
        "scores": scores
    }
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
