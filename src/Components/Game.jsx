import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [gameStarted, setGameStarted] = useState(false); // Game start state
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [category, setCategory] = useState(null);
  const [feedback, setFeedback] = useState(null); // Feedback state

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
  ];

  // Fetch quiz questions when the game starts and category is selected
  useEffect(() => {
    if (gameStarted && category !== null) {
      const fetchQuestions = async () => {
        const response = await axios.get(
          `https://opentdb.com/api.php?amount=5&category=${category}&difficulty=medium&type=multiple`
        );
        setQuestions(response.data.results);
      };
      fetchQuestions();
    }
  }, [gameStarted, category]);

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

    // Move to the next question after a short delay
    setTimeout(() => {
      setFeedback(null); // Reset feedback
      setCurrentQuestion(currentQuestion + 1);
    }, 2000);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      {!gameStarted ? (
        // Category Selection Screen
        <div className="text-center">
          <h1 className="mb-4">Choose a Quiz Category</h1>
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
        // Quiz Game Screen
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
                <button
                  onClick={() => setGameStarted(false)}
                  className="btn btn-primary"
                >
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
