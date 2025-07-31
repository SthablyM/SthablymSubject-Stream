import React from 'react';

function Question({ question, options, selectedOption, onSelectOption }) {
  return (
    <div className="question-card">
      <h3>{question}</h3>
      {options.map((option) => (
        <div key={option}>
          <input
            type="radio"
            value={option}
            checked={selectedOption === option}
            onChange={() => onSelectOption(option)}
          />
          {option}
        </div>
      ))}
    </div>
  );
}

export default Question;
