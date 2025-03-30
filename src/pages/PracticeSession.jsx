import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import questionsData from "../data/questions.json";

// Helper to parse query parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const PracticeSession = () => {
  const navigate = useNavigate();
  const query = useQuery();

  // Get query parameters
  const mode = query.get("mode") || "practice";
  const subject = query.get("subject") || "english";
  const topic = query.get("topic") || "random";
  const examType = query.get("examType") || "UTME";

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Load questions based on selected subject, topic and exam type
  useEffect(() => {
    let filteredQuestions = [];

    // Check if subject exists in our data
    if (questionsData[subject]) {
      // If random topic is selected, get questions from all topics
      if (topic === "random") {
        // Flatten all topics for the subject
        Object.values(questionsData[subject]).forEach((topicQuestions) => {
          const matchingQuestions = topicQuestions.filter(
            (q) => q.examType === examType
          );
          filteredQuestions = [...filteredQuestions, ...matchingQuestions];
        });
      } else {
        // Convert topic slug to key (e.g., "organic-chemistry" to "organic-chemistry")
        const topicKey = Object.keys(questionsData[subject]).find(
          (t) => t.toLowerCase().replace(/\s+/g, "-") === topic
        );

        if (topicKey && questionsData[subject][topicKey]) {
          const matchingQuestions = questionsData[subject][topicKey].filter(
            (q) => q.examType === examType
          );
          filteredQuestions = [...filteredQuestions, ...matchingQuestions];
        }
      }
    }

    // If we have no questions, use all available questions
    if (filteredQuestions.length === 0) {
      Object.values(questionsData).forEach((subjectData) => {
        Object.values(subjectData).forEach((topicQuestions) => {
          const matchingQuestions = topicQuestions.filter(
            (q) => q.examType === examType
          );
          filteredQuestions = [...filteredQuestions, ...matchingQuestions];
        });
      });
    }

    // Shuffle the questions
    filteredQuestions.sort(() => 0.5 - Math.random());

    // Limit to 10 questions for this practice session
    setQuestions(filteredQuestions.slice(0, 10));
  }, [subject, topic, examType]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return; // Prevent selecting answer during feedback

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion?.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }

    setShowFeedback(true);

    // Auto-advance after showing feedback for 1.5 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setQuizCompleted(true);
      }
    }, 1500);
  };

  const handleReturnToDashboard = () => {
    navigate("/dashboard");
  };

  // Show loading state if questions haven't loaded yet
  if (questions.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-white p-6 justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#16956C]"></div>
        <p className="mt-4 text-gray-600">Loading questions...</p>
      </div>
    );
  }

  // Show quiz completed screen
  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="flex flex-col min-h-screen bg-white p-6">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 rounded-full bg-[#E7F7F2] flex items-center justify-center mb-6">
            <span className="text-[#16956C] text-4xl font-bold">
              {percentage}%
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-2">Practice Completed!</h1>
          <p className="text-gray-600 mb-4">
            You scored {score} out of {questions.length} questions
          </p>

          {percentage >= 70 ? (
            <p className="text-green-600 font-medium mb-8">
              Great job! Keep it up!
            </p>
          ) : percentage >= 40 ? (
            <p className="text-yellow-600 font-medium mb-8">
              Good effort! Try again to improve.
            </p>
          ) : (
            <p className="text-red-600 font-medium mb-8">
              More practice needed. Don't give up!
            </p>
          )}

          <button
            onClick={handleReturnToDashboard}
            className="px-6 py-3 bg-[#16956C] text-white rounded-full font-medium hover:bg-[#138055] transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#16956C] p-6">
        <div className="flex justify-between items-center">
          <button onClick={handleReturnToDashboard} className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div className="text-white text-center">
            <h1 className="font-bold">
              {subject.charAt(0).toUpperCase() + subject.slice(1)}
            </h1>
            <p className="text-xs opacity-80">
              {examType} {mode}
            </p>
          </div>
          <div className="w-6"></div> {/* Empty div for flex spacing */}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full bg-gray-200">
        <div
          className="h-2 bg-[#16956C]"
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
          }}
        ></div>
      </div>

      {/* Question count */}
      <div className="p-4 text-center">
        <span className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Question */}
      <div className="p-6">
        <p className="text-lg font-medium mb-6">{currentQuestion?.question}</p>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full p-4 rounded-lg border text-left transition-colors ${
                selectedAnswer === option
                  ? showFeedback
                    ? isCorrect
                      ? "bg-green-100 border-green-500 text-green-800"
                      : "bg-red-100 border-red-500 text-red-800"
                    : "bg-[#E7F7F2] border-[#16956C] text-[#16956C]"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 mr-3 flex-shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>

              {showFeedback && selectedAnswer === option && (
                <div className="mt-2 flex items-center">
                  {isCorrect ? (
                    <>
                      <svg
                        className="w-5 h-5 text-green-600 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-green-600 text-sm">Correct!</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 text-red-600 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-red-600 text-sm">
                        Incorrect. The correct answer is{" "}
                        {currentQuestion.correctAnswer}.
                      </span>
                    </>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticeSession;
