import React from 'react';
import Quiz from './components/Quiz';

function App() {
  return (
    <div
      className="App"
      style={{
        backgroundImage: "url('/student2.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        minHeight: '100vh',
        padding: '2rem'
      }}
    >
      <h1>Subject Stream Self-Assessment Quiz</h1>
      <Quiz />
    </div>
  );
}

export default App;
