import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [category, setCategory] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5); // Default to 5 questions
  const [feedback, setFeedback] = useState(null);

  const categories = [
    { id: 9, name: "General Knowledge" },
    { id: 18, name: "Science: Computers" },
    { id: 11, name: "Entertainment: Film" },
    { id: 21, name: "Sports" },
    { id: 22, name: "Geography" },
    { id: 23, name: "History" },
    { id: 24, name: "Art" },
    { id: 25, name: "Animals" },
    { id: 17, name: "Science: Nature" },
    { id: 12, name: "Music" },
    { id: 14, name: "Entertainment: Video Games" },
  ];

  useEffect(() => {
    if (gameStarted && category !== null) {
      const fetchQuestions = async () => {
        const response = await axios.get(
          `https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=medium&type=multiple`
        );
        setQuestions(response.data.results);
      };
      fetchQuestions();
    }
  }, [gameStarted, category, numQuestions]);

  const handleCategorySelect = (categoryId) => {
    setCategory(categoryId);
    setGameStarted(true);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleAnswer = (selectedAnswer, correctAnswer) => {
    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
      setFeedback({ type: "success", message: "Correct Answer! 🎉" });
    } else {
      setFeedback({
        type: "danger",
        message: `Wrong Answer! 😢 The correct answer was: ${correctAnswer}`,
      });
    }

    // Delay for feedback, then move to the next question
    setTimeout(() => {
      setFeedback(null);
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // End the quiz and show score when all questions are answered
        setGameStarted(false);
      }
    }, 2000);
  };

  const handleRestartGame = () => {
    // Reset game-related states to allow replaying the quiz
    setGameStarted(false);
    setCategory(null);
    setScore(0);
    setQuestions([]);
    setCurrentQuestion(0);
    setFeedback(null);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      {!gameStarted ? (
        <div className="text-center">
          <h1 className="mb-4">Choose a Quiz Category</h1>
          <div className="row mb-3">
            <label htmlFor="questionCount" className="form-label">
              Number of Questions
            </label>
            <select
              className="form-select"
              id="questionCount"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>
          <div className="row">
            {categories.map((category) => (
              <div key={category.id} className="col-6 mb-3">
                <button
                  onClick={() => handleCategorySelect(category.id)}
                  className="btn btn-outline-primary w-100"
                  style={{ padding: "15px", fontSize: "18px" }}
                >
                  {category.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="card p-4 shadow-lg"
          style={{ width: "100%", maxWidth: "600px" }}
        >
          {questions.length > 0 ? (
            currentQuestion < questions.length ? (
              <div>
                <h3
                  dangerouslySetInnerHTML={{
                    __html: questions[currentQuestion].question,
                  }}
                ></h3>

                <div className="mt-4">
                  {[
                    ...questions[currentQuestion].incorrect_answers,
                    questions[currentQuestion].correct_answer,
                  ]
                    .sort(() => Math.random() - 0.5)
                    .map((answer, index) => (
                      <button
                        key={index}
                        className="btn btn-outline-dark d-block w-100 my-2"
                        onClick={() =>
                          handleAnswer(
                            answer,
                            questions[currentQuestion].correct_answer
                          )
                        }
                      >
                        {answer}
                      </button>
                    ))}
                </div>

                {feedback && (
                  <div
                    className={`alert alert-${feedback.type} mt-4`}
                    role="alert"
                  >
                    {feedback.message}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <h2 className="mb-4">
                  Your final score is {score} / {questions.length}
                </h2>
                <button onClick={handleRestartGame} className="btn btn-primary">
                  Go Back to Category Selection
                </button>
              </div>
            )
          ) : (
            <p>Loading questions...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
