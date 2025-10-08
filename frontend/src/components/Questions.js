import React from 'react';
import './Quiz.css';

function Question({ question, options, selectedOption, onSelectOption }) {
  return (
    <div
      className="quiz-container"
      style={{
        backgroundImage: "url('/studentimage.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      }}
    >
      <div className="question-card">
        <h3>{question}</h3>
        {options.map((option) => (
          <label key={option} className="option">
            <input
              type="radio"
              value={option}
              checked={selectedOption === option}
              onChange={() => onSelectOption(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

export default Question;
