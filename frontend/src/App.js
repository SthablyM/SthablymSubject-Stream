// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Quiz from "./components/Quiz";
import Footer from "./components/Footer";
import SchoolPilot from "./components/SchoolPilot";
import AccessGate from "./components/AccessGate";

function App() {
  return (
    <AccessGate>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Quiz />} />
            <Route path="/school-pilot" element={<SchoolPilot />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AccessGate>
  );
}

export default App;