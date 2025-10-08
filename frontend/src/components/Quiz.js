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


const extraMathQuestions = [
  { question: "What is 12 × 8?", answer: "96" },
  { question: "Solve for x: 2x + 3 = 11", answer: "4" },
  { question: "If a triangle has angles 50° and 60°, what is the third angle?", answer: "70" },
  { question:  "what is the square root of 144?", answer: "12"},
  { question:   "what is 15% of 200?", answer: "30"}
];
const options = ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"];

function Quiz() {
  const [answers, setAnswers] = useState({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExtraMath, setShowExtraMath] = useState(false);
  const [extraMathIndex, setExtraMathIndex] = useState(0);
  const [extraMathAnswer, setExtraMathAnswer] = useState("");
  const [extraMathCorrectCount, setExtraMathCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);

  const currentCategory = questionsData[currentCategoryIndex];
  const currentQuestionText = showExtraMath
    ? extraMathQuestions[extraMathIndex].question
    : currentCategory.questions[currentQuestionIndex];

  const handleAnswer = (option) => {
    const key = `${currentCategory.category}-${currentQuestionIndex}`;
    setAnswers({ ...answers, [key]: option });

    if (currentQuestionIndex < currentCategory.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentCategory.category === "Maths Aptitude & Interest") {
      const mathsAnswers = [
        ...Object.keys(answers)
          .filter(k => k.startsWith("Maths Aptitude & Interest"))
          .map(k => answers[k]),
        option
      ];

      const strongMath = mathsAnswers.some(ans => ans === "Strongly Agree" || ans === "Agree");

      if (strongMath) {
        setShowExtraMath(true);
        setExtraMathIndex(0);
      } else {
        // They are weak in math → skip extra math → no need to force Pure Maths
        submitQuiz();
      }
    } else if (currentCategoryIndex < questionsData.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      submitQuiz();
    }
  };

  const handleExtraMathSubmit = () => {
    const key = `ExtraMath-${extraMathIndex}`;
    setAnswers({ ...answers, [key]: extraMathAnswer });

    if (extraMathAnswer === extraMathQuestions[extraMathIndex].answer) {
      setExtraMathCorrectCount(extraMathCorrectCount + 1);
    }

    setExtraMathAnswer("");

    if (extraMathIndex < extraMathQuestions.length - 1) {
      setExtraMathIndex(extraMathIndex + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    const groupedAnswers = {};
    Object.keys(answers).forEach((key) => {
      if (key.startsWith("ExtraMath")) {
        if (!groupedAnswers["ExtraMath"]) groupedAnswers["ExtraMath"] = [];
        groupedAnswers["ExtraMath"].push(answers[key]);
      } else {
        const [category] = key.split('-');
        if (!groupedAnswers[category]) groupedAnswers[category] = [];
        groupedAnswers[category].push(answers[key]);
      }
    });

    try {
      const res = await axios.post('http://localhost:5000/api/submit-quiz', { answers: groupedAnswers });
      const finalData = res.data;

      // Extra math grading logic
      if (showExtraMath) {
        const total = extraMathQuestions.length;
        const scorePercent = (extraMathCorrectCount / total) * 100;

        // ✅ Vice versa: ≥50% correct → Maths Literacy, <50% → Pure Maths
        if (scorePercent != 100) {
          finalData.maths_recommendation = "MATHS LITARACY OR TECHNICAL MATHS";
        } else {
          finalData.maths_recommendation = "PURE MATHS";
        }
      }

      setResultData(finalData);
      setShowResult(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (showResult) return <Results result={resultData} />;

  return (
    <div className="quiz-container">
      <h2>{showExtraMath ? "Math Challenge" : currentCategory.category}</h2>

      {showExtraMath ? (
        <div className="numeric-question">
          <p>{currentQuestionText}</p>
          <input
            type="text"
            value={extraMathAnswer}
            onChange={(e) => setExtraMathAnswer(e.target.value)}
            placeholder="Type your answer"
          />
          <button onClick={handleExtraMathSubmit}>Next</button>
        </div>
      ) : (
        <Questions
          question={currentQuestionText}
          options={options}
          selectedOption={answers[`${currentCategory.category}-${currentQuestionIndex}`] || ""}
          onSelectOption={handleAnswer}
        />
      )}
    </div>
  );
}

export default Quiz;