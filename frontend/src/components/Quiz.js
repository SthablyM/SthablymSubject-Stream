// src/components/Quiz.js
import React, { useState } from 'react';
import Questions from './Questions';
import axios from 'axios';
import Results from './Results';

const questionsData  = [
  {
    category: 'Scientific Curiosity',
    questions: [
      "I enjoy doing experiments or investigations.",
      "I’m curious about how natural things work.",
      "I like subjects like Biology, Physics, or Chemistry.",
      "I enjoy solving science-related problems.",
      "I’m interested in discovering new scientific facts."
    ]
  },
  {
    category: 'Numerical & Analytical Skills',
    questions: [
      "I enjoy solving math problems and number puzzles.",
      "I like analyzing data and finding patterns.",
      "I’m confident working with statistics and graphs.",
      "I enjoy logical reasoning and problem-solving tasks.",
      "I like calculating and comparing numbers."
    ]
  },
  {
    category: 'Business & Financial Interest',
    questions: [
      "I’m interested in how money, trade, and business work.",
      "I want to learn about entrepreneurship and investments.",
      "I like thinking of ways to make or manage money.",
      "I enjoy business studies or economics.",
      "I’m curious about how companies grow and succeed."
    ]
  },
  {
    category: 'Creativity & Expression',
    questions: [
      "I enjoy drawing, painting, writing, or performing.",
      "I love expressing my ideas creatively.",
      "I often think of creative ways to solve problems.",
      "I feel confident when I create art or stories.",
      "I’m passionate about creative subjects like art, design, or drama."
    ]
  },
  {
    category: 'Social Awareness & Communication',
    questions: [
      "I like helping people and making a difference.",
      "I’m interested in social issues and community work.",
      "I’m good at expressing myself and communicating with others.",
      "I enjoy working with different kinds of people.",
      "I feel comfortable leading group discussions or projects."
    ]
  },
  {
    category: 'Technical & Practical Skills',
    questions: [
      "I like working with tools, machines, or hands-on projects.",
      "I enjoy fixing things or building models.",
      "I’m interested in technical subjects like Engineering or IT.",
      "I prefer practical tasks over theoretical ones.",
      "I’m curious about how things are built or made."
    ]
  },
  {
    category: 'History & Critical Thinking',
    questions: [
      "I enjoy learning about past events and history.",
      "I like discussing how history affects the present.",
      "I’m interested in analyzing situations from different angles.",
      "I enjoy debating social or historical topics.",
      "I’m curious about different cultures and historical events."
    ]
  },
  {
    category: 'Maths Aptitude & Interest',
    questions: [
      "I enjoy solving complex math problems.",
      "I feel confident when working with numbers.",
      "I like abstract math topics like algebra and geometry.",
      "I enjoy applying math in real-life situations.",
      "I’m interested in improving my math skills."
    ]
  }
];


const options = ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"];

function Quiz() {
  const [answers, setAnswers] = useState({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);

  const currentCategory = questionsData[currentCategoryIndex];
  const currentQuestion = currentCategory.questions[currentQuestionIndex];

  const handleAnswer = (option) => {
    const key = `${currentCategory.category}-${currentQuestionIndex}`;
    setAnswers({ ...answers, [key]: option });

    if (currentQuestionIndex < currentCategory.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentCategoryIndex < questionsData.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    const groupedAnswers = {};
    Object.keys(answers).forEach((key) => {
      const [category, qIndex] = key.split('-');
      if (!groupedAnswers[category]) groupedAnswers[category] = [];
      groupedAnswers[category].push(answers[key]);
    });

    try {
      const res = await axios.post('http://localhost:5000/api/submit-quiz', { answers: groupedAnswers });
      setResultData(res.data);
      setShowResult(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (showResult) return <Results result={resultData} />;

  return (
    <div className="quiz-container">
      <h2>{currentCategory.category}</h2>
      <Questions
        question={currentQuestion}
        options={options}
        selectedOption={answers[`${currentCategory.category}-${currentQuestionIndex}`] || ""}
        onSelectOption={handleAnswer}
      />
    </div>
  );
}

export default Quiz;
