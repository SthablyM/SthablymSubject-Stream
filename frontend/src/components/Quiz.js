// src/components/Quiz.js

import React, { useState } from "react";
import Questions from "./Questions";
import Results from "./Results";
import axios from "axios";

const questionsData = [
  {
    category: "Scientific Curiosity",
    questions: [
      "I enjoy doing experiments or investigations.",
      "I’m curious about how natural things work.",
      "I like subjects like Biology, Physics, or Chemistry.",
      "I enjoy solving science-related problems.",
      "I’m interested in discovering new scientific facts."
    ]
  },
  {
    category: "Numerical & Analytical Skills",
    questions: [
      "I enjoy solving math problems and number puzzles.",
      "I like analyzing data and finding patterns.",
      "I’m confident working with statistics and graphs.",
      "I enjoy logical reasoning and problem-solving tasks.",
      "I like calculating and comparing numbers."
    ]
  },
  {
    category: "Business & Financial Interest",
    questions: [
      "I’m interested in how money and business work.",
      "I want to learn about entrepreneurship.",
      "I enjoy thinking about investments.",
      "I like business studies or economics.",
      "I’m curious how companies grow."
    ]
  },
  {
    category: "Creativity & Expression",
    questions: [
      "I enjoy drawing or writing.",
      "I like expressing ideas creatively.",
      "I think of creative ways to solve problems.",
      "I enjoy art or design subjects.",
      "I like storytelling."
    ]
  },
  {
    category: "Social Awareness & Communication",
    questions: [
      "I enjoy helping people.",
      "I’m interested in social issues.",
      "I communicate my ideas easily.",
      "I like working in groups.",
      "I enjoy leading discussions."
    ]
  },
  {
    category: "Technical & Practical Skills",
    questions: [
      "I enjoy building or fixing things.",
      "I like working with tools.",
      "I enjoy practical tasks.",
      "I’m interested in engineering or IT.",
      "I like hands-on learning."
    ]
  },
  {
    category: "History & Critical Thinking",
    questions: [
      "I enjoy learning about history.",
      "I like discussing historical events.",
      "I enjoy debating topics.",
      "I analyze situations deeply.",
      "I’m curious about cultures."
    ]
  },
  {
    category: "Maths Aptitude & Interest",
    questions: [
      "I enjoy solving complex maths problems.",
      "I feel confident with numbers.",
      "I like algebra and geometry.",
      "I apply maths in real life.",
      "I want to improve my maths skills."
    ]
  }
];

const extraMathQuestions = [
  { question: "What is 12 × 8?", answer: "96" },
  { question: "Solve: 2x + 3 = 11", answer: "4" },
  { question: "Third angle of triangle with 50° and 60°?", answer: "70" },
  { question: "Square root of 144?", answer: "12" },
  { question: "15% of 200?", answer: "30" }
];

const options = ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"];

function Quiz() {
  const [answers, setAnswers] = useState({});
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [showMathChallenge, setShowMathChallenge] = useState(false);
  const [mathIndex, setMathIndex] = useState(0);
  const [mathAnswer, setMathAnswer] = useState("");
  const [mathCorrectCount, setMathCorrectCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [showResults, setShowResults] = useState(false);
  const [resultData, setResultData] = useState(null);

  const currentCategory = questionsData[categoryIndex];
  const currentQuestion = currentCategory.questions[questionIndex];

  // Handle normal questionnaire answers
  const handleAnswer = (option) => {
    const key = `${currentCategory.category}-${questionIndex}`;
    const newAnswers = { ...answers, [key]: option };
    setAnswers(newAnswers);

    if (questionIndex < currentCategory.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else if (currentCategory.category === "Maths Aptitude & Interest") {
      // Check if student likes math
      const mathAnswers = Object.keys(newAnswers)
        .filter(k => k.startsWith("Maths Aptitude"))
        .map(k => newAnswers[k]);
      const likesMath = mathAnswers.some(a => a === "Agree" || a === "Strongly Agree");

      if (likesMath) {
        setShowMathChallenge(true);
      } else {
        submitQuiz(newAnswers, 0);
      }
    } else {
      // Move to next category
      setCategoryIndex(categoryIndex + 1);
      setQuestionIndex(0);
    }
  };

  // Handle Math Challenge answer
  const submitMathAnswer = () => {
    if (mathAnswer.trim() === "") {
      alert("Please enter an answer");
      return;
    }

    const correct = extraMathQuestions[mathIndex].answer;
    const isRight = mathAnswer.trim() === correct;

    if (isRight) setMathCorrectCount(mathCorrectCount + 1);

    setIsCorrect(isRight);
    setShowFeedback(true);

    // Show feedback for 1.5s, then move next
    setTimeout(() => {
      setShowFeedback(false);
      setMathAnswer("");

      if (mathIndex < extraMathQuestions.length - 1) {
        setMathIndex(mathIndex + 1);
      } else {
        // Last math question → submit all quiz
        submitQuiz(answers, mathCorrectCount + (isRight ? 1 : 0));
      }
    }, 1500);
  };

  // Submit quiz to backend
  const submitQuiz = async (finalAnswers, finalMathScore) => {
    try {
      const groupedAnswers = {};
      Object.keys(finalAnswers).forEach(key => {
        const [category] = key.split("-");
        if (!groupedAnswers[category]) groupedAnswers[category] = [];
        groupedAnswers[category].push(finalAnswers[key]);
      });

      const res = await axios.post("http://127.0.0.1:5000/api/submit-quiz", {
        answers: groupedAnswers
      });

      const data = res.data;

      // Add math challenge results
      if (showMathChallenge) {
        const percent = (finalMathScore / extraMathQuestions.length) * 100;
        data.maths_recommendation =
          percent >= 60
            ? "PURE MATHS"
            : "TECHNICAL MATHS OR MATHS LITERACY";
      }

      setResultData(data);
      setShowResults(true);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Failed to submit quiz. Check backend is running.");
    }
  };

  if (showResults) return <Results result={resultData} />;

  return (
    <div className="quiz-container">
      <h2>{showMathChallenge ? "Math Challenge" : currentCategory.category}</h2>

      {showMathChallenge ? (
        <div>
          <p>{extraMathQuestions[mathIndex].question}</p>

          {!showFeedback ? (
            <>
              <input
                type="text"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                placeholder="Type your answer"
              />
              <button onClick={submitMathAnswer}>Submit</button>
            </>
          ) : (
            <>
              <p>{isCorrect ? "✅ Correct!" : "❌ Incorrect"}</p>
              <p>Correct Answer: {extraMathQuestions[mathIndex].answer}</p>
            </>
          )}
        </div>
      ) : (
        <Questions
          question={currentQuestion}
          options={options}
          onSelectOption={handleAnswer}
          selectedOption={answers[`${currentCategory.category}-${questionIndex}`] || ""}
        />
      )}
    </div>
  );
}

export default Quiz;