import React from 'react';

function Results({ result }) {
  return (
    <div>
      <h2>Recommended Stream(s):</h2>
      <ul>
        {result.recommended_streams.map((stream) => (
          <li key={stream}>{stream}</li>
        ))}
      </ul>
      <h3>Recommended Maths Option: {result.maths_recommendation}</h3>
      <h4>Scores:</h4>
      <ul>
        {Object.entries(result.scores).map(([category, score]) => (
          <li key={category}>{category}: {score}</li>
        ))}
      </ul>
    </div>
  );
}
export default Results;
