/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectPersonalInfo } from "../redux/slices/profileSlice";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";

const subjectNames = {
  english: "English",
  mathematics: "Mathematics",
  physics: "Physics",
  biology: "Biology",
  chemistry: "Chemistry",
  commerce: "Commerce",
  accounting: "Accounting",
  economics: "Economics",
  government: "Government",
  literature: "Literature",
  crk: "CRK",
  irk: "IRK",
  geography: "Geography",
  civileducation: "Civic Education",
};

const ExamSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const personalInfo = useSelector(selectPersonalInfo);

  // Get exam data from navigation state
  const { examData, subjects } = location.state || {};

  // State management
  const [currentSubject, setCurrentSubject] = useState(
    subjects?.[0] || "english",
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Answer state format: { subject: [{ questionId, selectedOption }] }
  const [answers, setAnswers] = useState(() => {
    const initialAnswers = {};
    subjects?.forEach((subject) => {
      initialAnswers[subject] = [];
    });
    return initialAnswers;
  });
  const [skipped, setSkipped] = useState({});
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60); // 2 hours in seconds
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if no exam data
  useEffect(() => {
    if (!examData || !subjects) {
      navigate("/dashboard");
    }
  }, [examData, subjects, navigate]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() === "n") {
        handleNext();
      } else if (e.key.toLowerCase() === "p") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentSubject, currentQuestionIndex]);

  const getCurrentQuestions = () => {
    return examData?.[currentSubject] || [];
  };

  const getCurrentQuestion = () => {
    const questions = getCurrentQuestions();
    return questions[currentQuestionIndex];
  };

  const getQuestionKey = (subject, index) => {
    return `${subject}-${index}`;
  };

  const handleAnswerSelect = (optionLetter) => {
    const currentQuestion = getCurrentQuestion();
    const questionId = currentQuestion._id;

    setAnswers((prev) => {
      const subjectAnswers = [...(prev[currentSubject] || [])];
      const existingIndex = subjectAnswers.findIndex(
        (a) => a.questionId === questionId,
      );

      if (existingIndex >= 0) {
        // Update existing answer
        subjectAnswers[existingIndex] = {
          questionId,
          selectedOption: optionLetter,
        };
      } else {
        // Add new answer
        subjectAnswers.push({ questionId, selectedOption: optionLetter });
      }

      return {
        ...prev,
        [currentSubject]: subjectAnswers,
      };
    });

    // Remove from skipped if it was skipped
    const key = getQuestionKey(currentSubject, currentQuestionIndex);
    setSkipped((prev) => {
      const newSkipped = { ...prev };
      delete newSkipped[key];
      return newSkipped;
    });
  };

  const handleSkip = () => {
    const currentQuestion = getCurrentQuestion();
    const questionId = currentQuestion._id;
    const key = getQuestionKey(currentSubject, currentQuestionIndex);

    // Check if question is answered
    const isAnswered = answers[currentSubject]?.some(
      (a) => a.questionId === questionId,
    );

    if (!isAnswered) {
      setSkipped((prev) => ({
        ...prev,
        [key]: true,
      }));
    }
    handleNext();
  };

  const handleNext = () => {
    const questions = getCurrentQuestions();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionJump = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubjectChange = (subject) => {
    setCurrentSubject(subject);
    setCurrentQuestionIndex(0);
  };

  const handleAutoSubmit = () => {
    // Auto submit when time runs out
    submitExam();
  };

  const handleSubmit = () => {
    setShowSubmitModal(true);
  };

  const submitExam = async () => {
    setIsSubmitting(true);
    try {
      // Submit to API
      const response = await fetch("/api/v1/exam/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();

      if (data.status === "success") {
        // Navigate to results page with API response
        navigate("/jamb/exam/simulation/result", {
          state: {
            scores: data.data,
            subjects,
            timeSpent: 2 * 60 * 60 - timeLeft,
            answers,
          },
        });
      } else {
        throw new Error(data.message || "Failed to submit exam");
      }
    } catch (error) {
      console.error("Exam submission error:", error);
      alert("Failed to submit exam. Please try again.");
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getQuestionStatus = (subject, index) => {
    const questions = examData?.[subject] || [];
    const question = questions[index];
    const questionId = question?._id;
    const key = getQuestionKey(subject, index);

    const isAnswered = answers[subject]?.some(
      (a) => a.questionId === questionId,
    );
    if (isAnswered) return "answered";
    if (skipped[key]) return "skipped";
    return "unanswered";
  };

  const getSubjectStats = (subject) => {
    const questions = examData?.[subject] || [];
    let answered = 0;
    let skippedCount = 0;

    questions.forEach((question, index) => {
      const questionId = question._id;
      const key = getQuestionKey(subject, index);
      const isAnswered = answers[subject]?.some(
        (a) => a.questionId === questionId,
      );

      if (isAnswered) answered++;
      else if (skipped[key]) skippedCount++;
    });

    return { answered, skipped: skippedCount, total: questions.length };
  };

  if (!examData || !subjects) {
    return null;
  }

  const currentQuestion = getCurrentQuestion();
  const currentQuestions = getCurrentQuestions();
  const currentQuestionId = currentQuestion?._id;
  const selectedAnswer = answers[currentSubject]?.find(
    (a) => a.questionId === currentQuestionId,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#16956C] text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
              {personalInfo.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="font-medium">
              {personalInfo.fullName || "Student"}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div
              className={`px-4 py-2 rounded-lg font-bold text-lg ${
                timeLeft < 600 ? "bg-red-500 animate-pulse" : "bg-[#F39C12]"
              }`}
            >
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={handleSubmit}
              className="bg-[#8B4513] hover:bg-[#6B3410] px-6 py-2 rounded-lg font-bold transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-10">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {subjects.map((subject) => {
            const stats = getSubjectStats(subject);
            return (
              <button
                key={subject}
                onClick={() => handleSubjectChange(subject)}
                className={`flex-1 min-w-[150px] px-6 py-4 font-medium transition-all border-b-4 ${
                  currentSubject === subject
                    ? "bg-[#16956C] text-white border-[#16956C]"
                    : "bg-white text-gray-700 border-transparent hover:bg-gray-50"
                }`}
              >
                <div className="text-sm font-bold">{subjectNames[subject]}</div>
                <div className="text-xs mt-1">
                  {stats.answered}/{stats.total}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto p-6">
        <div className="grid grid-cols-5 gap-6">
          {/* Question Area */}
          <div className="col-span-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 font-medium">Question</span>
                  <span className="font-bold text-[#16956C]">
                    {currentQuestionIndex + 1}/{currentQuestions.length}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              {currentQuestion && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestionId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className="text-gray-800 mb-6 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(currentQuestion.question),
                      }}
                    />

                    {/* Options */}
                    <div className="space-y-3">
                      {currentQuestion.options?.map((option, index) => {
                        const optionLabel = String.fromCharCode(65 + index);
                        const isSelected =
                          selectedAnswer?.selectedOption === optionLabel;

                        return (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(optionLabel)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                              isSelected
                                ? "border-[#16956C] bg-[#E7F7F2]"
                                : "border-gray-200 hover:border-[#16956C]/50 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                                  isSelected
                                    ? "bg-[#16956C] text-white"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {optionLabel}
                              </div>
                              <div
                                className="flex-1 pt-1"
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(option.text),
                                }}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-end gap-6 items-center mt-8 pt-6 border-t">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {/* <button
                  onClick={handleSkip}
                  className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                >
                  Skip
                </button> */}

                <button
                  onClick={handleNext}
                  disabled={
                    currentQuestionIndex === currentQuestions.length - 1
                  }
                  className="px-6 py-2 bg-[#16956C] text-white rounded-lg font-medium hover:bg-[#138055] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Question Grid Sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-[200px]">
              <h3 className="font-bold text-gray-800 mb-4">
                Attempted {getSubjectStats(currentSubject).answered}/
                {currentQuestions.length}
              </h3>

              <div className="grid grid-cols-5 gap-2 mb-6">
                {currentQuestions.map((_, index) => {
                  const status = getQuestionStatus(currentSubject, index);
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuestionJump(index)}
                      className={`aspect-square rounded-lg font-bold text-sm transition-all ${
                        currentQuestionIndex === index
                          ? "ring-2 ring-[#16956C] ring-offset-2"
                          : ""
                      } ${
                        status === "answered"
                          ? "bg-[#16956C] text-white"
                          : status === "skipped"
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-[#16956C] rounded"></div>
                  <span className="text-gray-700">Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  <span className="text-gray-700">Not Answered</span>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-red-500 rounded"></div>
                  <span className="text-gray-700">Skipped</span>
                </div> */}
              </div>

              {/* Keyboard Shortcuts */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-bold text-gray-800 mb-2 text-sm">
                  Keyboard Shortcuts
                </h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Next Question:</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded font-mono">
                      N
                    </kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Previous Question:</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded font-mono">
                      P
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubmitModal(false)}
              className="absolute inset-0 bg-black/50"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Submit Exam?
              </h3>

              <div className="space-y-3 mb-6">
                {subjects.map((subject) => {
                  const stats = getSubjectStats(subject);
                  return (
                    <div
                      key={subject}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-700">
                        {subjectNames[subject]}
                      </span>
                      <span className="text-sm text-gray-600">
                        {stats.answered}/{stats.total} answered
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to submit your exam? You cannot change
                your answers after submission.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={submitExam}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-[#16956C] text-white rounded-lg font-medium hover:bg-[#138055] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Exam"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExamSimulation;
