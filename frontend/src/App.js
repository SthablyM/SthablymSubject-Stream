import React, { useState } from "react";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import questions from "./components/Questions";

function App() {

  const [result, setResult] = useState(null);

  return (
    <div>

      {!result ? (
        <Quiz questions={questions} onFinish={setResult} />
      ) : (
        <Results result={result} />
      )}

    </div>
  );
}

export default App;