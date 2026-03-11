// src/App.js
import React from "react";
import Quiz from "./components/Quiz";
import Footer from "./components/Footer";

// ── NOTE: Results, StudentProfile, UniversityFinder are all managed
// internally by Quiz.js — you no longer need to import them here.
// The flow is: Welcome → Student Profile → Quiz → Enhanced Results
// All powered by a single <Quiz /> component.

function App() {
  return (
    <div className="app-container">
      <div className="main-content">
        <Quiz />
      </div>
      <Footer />
    </div>
  );
}

export default App;