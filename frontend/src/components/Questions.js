import React from "react";
import "./Quiz.css";

function Questions({ question, options, selectedOption, onSelectOption }) {
  return (
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
  );
}

export default Questions;