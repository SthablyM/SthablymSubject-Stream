import React from 'react';
import './Results.css'; 

function Results({ result }) {
  return (
    <div
  className="results-container"
  style={{
    backgroundImage: "url('/studentimage.png')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
  }}
>

      <h1>Your Recommended Stream(s)</h1>
      <ul className="stream-list">
        {result.recommended_streams.map((stream, index) => (
          <li key={index} className="stream-item">{stream}</li>
        ))}
      </ul>

      <h2>Maths Recommendation</h2>
      <p className="maths-recommendation">{result.maths_recommendation}</p>

      <h2>Category Scores</h2>
      <div className="score-grid">
        {Object.entries(result.scores).map(([category, score]) => (
          <div key={category} className="score-card">
            <h3>{category}</h3>
            <p>{score} / 25</p>
          </div>
        ))}
      </div>

      <button className="retake-button" onClick={() => window.location.reload()}>
        Retake Quiz
      </button>
    </div>
  );
}

export default Results;
