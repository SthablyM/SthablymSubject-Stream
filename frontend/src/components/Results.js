import React from "react";
import "./Results.css";

function Results({ result }) {

  if (!result) {
    return <h2>Loading results...</h2>;
  }

  return (
    <div className="results-container">

      <h1>🎓 Subject Stream Recommendation</h1>

      <p className="intro-text">
        Based on your responses, the system analysed your interests,
        strengths, and learning preferences to recommend the most
        suitable subject streams for you.
      </p>

      <div className="recommendation-section">
        <h2>Recommended Stream(s)</h2>

        <ul className="stream-list">
          {result.recommended_streams.map((stream, index) => (
            <li key={index} className="stream-item">
              {stream}
            </li>
          ))}
        </ul>
      </div>

      <div className="maths-section">
        <h2>Maths Recommendation</h2>

        <p className="maths-recommendation">
          {result.maths_recommendation}
        </p>

        <p className="maths-explanation">
          This recommendation is based on both your interest in mathematics
          and your performance in the maths challenge questions.
        </p>
      </div>

      <div className="scores-section">
        <h2>Your Category Scores</h2>

        <div className="score-grid">
          {Object.entries(result.scores).map(([category, score]) => (
            <div key={category} className="score-card">

              <h3>{category}</h3>

              <p className="score-number">
                {score} / 25
              </p>

              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{ width: `${(score / 25) * 100}%` }}
                ></div>
              </div>

            </div>
          ))}
        </div>
      </div>

      <div className="action-section">

        <p className="final-advice">
          Use these results as guidance when selecting your subjects.
          Choose subjects that match both your strengths and interests
          to succeed academically and in your future career.
        </p>

        <button
          className="retake-button"
          onClick={() => window.location.reload()}
        >
          Retake Quiz
        </button>

      </div>

    </div>
  );
}

export default Results;