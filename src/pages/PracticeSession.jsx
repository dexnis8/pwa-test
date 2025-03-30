/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import questionsData from "../data/questions.json";
import { motion, AnimatePresence } from "framer-motion";

// Custom hook to get query parameters
const useQuery = () => {
  return new URLSearchParams(window.location.search);
};

const PracticeSession = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const mode = query.get("mode") || "practice";
  const subject = query.get("subject") || "english";
  const topic = query.get("topic") || "random";
  const examType = query.get("examType") || "UTME";
  const questionCount = parseInt(query.get("questionCount") || "10");
  const timeLimit = parseInt(query.get("timeLimit") || "10");

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert minutes to seconds
  const [timerActive, setTimerActive] = useState(mode === "time-based");
  const [showQuitModal, setShowQuitModal] = useState(false);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Load questions based on subject and topic
  useEffect(() => {
    let filteredQuestions = [];

    // Check if the subject exists in our data
    if (questionsData[subject]) {
      if (topic === "random") {
        // Get all topics for this subject
        Object.keys(questionsData[subject]).forEach((topicKey) => {
          // Filter by exam type if specified
          const topicQuestions = questionsData[subject][topicKey].filter(
            (q) => q.examType === examType
          );
          filteredQuestions = [...filteredQuestions, ...topicQuestions];
        });
      } else {
        // Convert topic slug to key (e.g., "organic-chemistry" to "organic-chemistry")
        const topicKey = topic.toLowerCase();

        // Find most closely matching topic
        const matchingTopic = Object.keys(questionsData[subject]).find(
          (key) => key.toLowerCase() === topicKey
        );

        if (matchingTopic) {
          // Filter by exam type if specified
          filteredQuestions = questionsData[subject][matchingTopic].filter(
            (q) => q.examType === examType
          );
        }
      }
    }

    // Fallback if no questions match criteria
    if (filteredQuestions.length === 0) {
      // Get all questions across all subjects and topics as fallback
      Object.keys(questionsData).forEach((subj) => {
        Object.keys(questionsData[subj]).forEach((top) => {
          filteredQuestions = [
            ...filteredQuestions,
            ...questionsData[subj][top],
          ];
        });
      });
    }

    // Shuffle questions and limit to specified count (or 10 by default)
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, questionCount));
  }, [subject, topic, examType, questionCount]);

  // Timer countdown only for time-based mode
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      setQuizCompleted(true);
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return; // Prevent selecting another answer during feedback

    setSelectedAnswer(answer);
    setShowFeedback(true);

    const currentQuestion = questions[currentIndex];
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore((prevScore) => prevScore + 1);
    }

    // Remove auto-advance - let users control when to go to next question
  };

  const handleEndPractice = () => {
    navigate("/dashboard");
  };

  const handleEndClick = () => {
    setShowQuitModal(true);
  };

  const handleConfirmQuit = () => {
    setShowQuitModal(false);
    setQuizCompleted(true);
    setTimerActive(false);
  };

  const handleCancelQuit = () => {
    setShowQuitModal(false);
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16956C] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    let feedback = "";
    let feedbackColor = "";

    if (percentage >= 80) {
      feedback = "Excellent! You've mastered this topic.";
      feedbackColor = "text-green-600";
    } else if (percentage >= 60) {
      feedback = "Good job! Keep practicing to improve further.";
      feedbackColor = "text-blue-600";
    } else {
      feedback = "Keep practicing! You'll get better with time.";
      feedbackColor = "text-yellow-600";
    }

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-[#16956C] p-5 text-white">
              <h1 className="text-2xl font-bold text-center">
                Practice Complete!
              </h1>
            </div>

            <div className="p-6 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#E7F7F2] mb-4">
                  <span className="text-2xl font-bold text-[#16956C]">
                    {percentage}%
                  </span>
                </div>
                <h2 className="text-lg font-semibold mb-2">
                  You scored {score} out of {questions.length}
                </h2>
                <p className={`${feedbackColor} font-medium`}>{feedback}</p>
              </div>

              <button
                onClick={handleEndPractice}
                className="w-full py-3 px-4 bg-[#16956C] text-white rounded-full font-medium hover:bg-[#138055] transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#16956C] p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white capitalize">
          {subject}
          {mode === "time-based" && (
            <span className="ml-2 text-xs bg-white text-[#16956C] px-2 py-0.5 rounded-full">
              Timed
            </span>
          )}
        </h1>
        <button
          onClick={handleEndClick}
          className="px-4 py-1 bg-white rounded-full text-[#16956C] text-sm font-medium"
        >
          End
        </button>
      </div>

      {/* Timer - Only show for time-based mode */}
      {mode === "time-based" && (
        <div className="flex justify-center items-center py-4 bg-white">
          <div className="flex items-center text-[#E74C3C]">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-2xl font-semibold">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="bg-white px-4 py-2 border-b">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-600">
            {currentQuestion.examType} {currentQuestion.examYear}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-[#16956C] h-1.5 rounded-full"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="p-5">
        <div className="bg-[#1D7A8C] text-white p-5 rounded-xl mb-4">
          <div className="text-center mb-4">
            {currentQuestion.image && (
              <div className="mb-4 flex justify-center">
                <img
                  src={currentQuestion.image}
                  alt="Question visual"
                  className="max-w-full rounded-lg max-h-48 object-contain bg-white p-2"
                />
              </div>
            )}
            <p className="text-center font-medium">
              {currentQuestion.question}
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full text-left p-4 rounded-lg border-2 flex items-center transition-colors ${
                selectedAnswer === option
                  ? showFeedback
                    ? isCorrect
                      ? "bg-green-100 border-green-500 text-green-800"
                      : option === currentQuestion.correctAnswer
                      ? "bg-green-100 border-green-500 text-green-800"
                      : "bg-red-100 border-red-500 text-red-800"
                    : "bg-[#E7F7F2] border-[#16956C] text-[#16956C]"
                  : "bg-white border-gray-200 hover:border-[#16956C] hover:bg-gray-50"
              }`}
              disabled={showFeedback}
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center mr-3 font-medium">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
              {showFeedback && selectedAnswer === option && (
                <span className="ml-auto">
                  {isCorrect ? (
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </span>
              )}
              {showFeedback &&
                selectedAnswer !== option &&
                option === currentQuestion.correctAnswer && (
                  <span className="ml-auto">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                )}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showFeedback && currentQuestion.explanation && (
          <div
            className={`mt-5 p-4 rounded-lg ${
              isCorrect
                ? "bg-green-50 border border-green-200"
                : "bg-yellow-50 border border-yellow-200"
            }`}
          >
            <h3 className="text-sm font-semibold mb-1">
              {isCorrect ? "Correct! Here's why:" : "Explanation:"}
            </h3>
            <p className="text-sm text-gray-700">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Next button */}
      <div className="mt-auto p-5">
        <button
          onClick={() => {
            if (currentIndex < questions.length - 1) {
              setCurrentIndex((prevIndex) => prevIndex + 1);
              setSelectedAnswer(null);
              setShowFeedback(false);
            } else {
              setQuizCompleted(true);
              setTimerActive(false);
            }
          }}
          disabled={!showFeedback && selectedAnswer === null}
          className={`w-full py-3 px-4 rounded-full font-medium transition-colors ${
            !showFeedback && selectedAnswer === null
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-[#16956C] text-white hover:bg-[#138055]"
          }`}
        >
          Next
        </button>
      </div>

      {/* Quit Confirmation Modal */}
      <AnimatePresence>
        {showQuitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-xs"
            >
              {/* Modal Header */}
              <div className="bg-[#16956C] p-4 text-white text-center">
                <h2 className="font-bold text-xl">
                  Are you sure you want to quit?
                </h2>
              </div>

              {/* Modal Body */}
              <div className="p-4 text-center text-gray-600">
                <p className="mb-1">You will lose all point.</p>
                <p className="text-sm">
                  Also pratice questions increase your chance of partipating in
                  LIVE GAMES.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="p-4 flex space-x-3">
                <button
                  onClick={handleConfirmQuit}
                  className="flex-1 py-2 px-4 rounded border border-[#16956C] text-[#16956C] font-medium hover:bg-gray-50 transition-colors"
                >
                  End Pratice
                </button>
                <button
                  onClick={handleCancelQuit}
                  className="flex-1 py-2 px-4 rounded bg-[#16956C] text-white font-medium hover:bg-[#138055] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PracticeSession;
