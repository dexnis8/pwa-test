/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectInterests } from "../redux/slices/profileSlice";
import { motion, AnimatePresence } from "framer-motion";

// Mock topics data - in a real app, this would be fetched from an API
const TOPICS_BY_SUBJECT = {
  english: [
    "Comprehension",
    "Grammar",
    "Vocabulary",
    "Literature",
    "Oral English",
  ],
  mathematics: [
    "Algebra",
    "Geometry",
    "Calculus",
    "Statistics",
    "Trigonometry",
  ],
  physics: ["Mechanics", "Electricity", "Optics", "Waves", "Thermodynamics"],
  biology: [
    "Cell Biology",
    "Genetics",
    "Ecology",
    "Human Anatomy",
    "Evolution",
  ],
  chemistry: [
    "Organic Chemistry",
    "Inorganic Chemistry",
    "Physical Chemistry",
    "Analytical Chemistry",
    "Biochemistry",
  ],
};

const subjects = {
  english: { name: "English", icon: "📝" },
  mathematics: { name: "Mathematics", icon: "🔢" },
  physics: { name: "Physics", icon: "🔭" },
  biology: { name: "Biology", icon: "🧬" },
  chemistry: { name: "Chemistry", icon: "🧪" },
};

const PracticeConfigModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const userInterests = useSelector(selectInterests);

  const [mode, setMode] = useState("practice");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [topic, setTopic] = useState("random");
  const [examType, setExamType] = useState("UTME");
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(10);

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setMode("practice");
      setSelectedSubjects(userInterests.length > 0 ? [userInterests[0]] : []);
      setTopic("random");
      setExamType("UTME");
      setQuestionCount(10);
      setTimeLimit(10);
    }
  }, [isOpen, userInterests]);

  // Modified to only allow one subject at a time (radio button behavior)
  const handleSubjectToggle = (subjectId) => {
    // Don't allow deselecting the currently selected subject
    if (selectedSubjects.includes(subjectId) && selectedSubjects.length === 1) {
      return;
    }
    // Set only the clicked subject
    setSelectedSubjects([subjectId]);
  };

  const handleQuestionCountChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setQuestionCount(1);
    } else {
      setQuestionCount(Math.min(Math.max(value, 1), 50));
    }
  };

  const handleTimeLimitChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setTimeLimit(1);
    } else {
      setTimeLimit(Math.min(Math.max(value, 1), 60));
    }
  };

  const handleStartPractice = () => {
    // Use the selected subject
    const subject = selectedSubjects[0] || "english";

    // In a real app, you'd make an API call or set up Redux state
    // For now, we'll navigate with query params
    navigate(
      `/practice/session?mode=${mode}&subject=${subject}&topic=${topic}&examType=${examType}&questionCount=${questionCount}&timeLimit=${timeLimit}`
    );
    onClose();
  };

  const availableTopics = TOPICS_BY_SUBJECT[selectedSubjects[0]] || [];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-[360px] relative z-10 shadow-xl mx-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  Practice Setup
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-6">
                {/* Practice Mode */}
                <div>
                  <label className="text-gray-700 font-medium mb-2 block">
                    Select Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMode("practice")}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center border transition-all ${
                        mode === "practice"
                          ? "border-[#16956C] bg-[#E7F7F2] text-[#16956C]"
                          : "border-gray-200 text-gray-700"
                      }`}
                    >
                      <svg
                        className="w-6 h-6 mb-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 6V12L16 14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                      <span className="text-sm font-medium">Practice</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode("time-based")}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center border transition-all ${
                        mode === "time-based"
                          ? "border-[#16956C] bg-[#E7F7F2] text-[#16956C]"
                          : "border-gray-200 text-gray-700"
                      }`}
                    >
                      <svg
                        className="w-6 h-6 mb-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="3"
                          y="6"
                          width="18"
                          height="15"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M3 10H21"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M8 3V7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M16 3V7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="text-sm font-medium">Time-based</span>
                    </button>

                    <button
                      type="button"
                      disabled
                      className="p-3 rounded-lg flex flex-col items-center justify-center border border-gray-200 text-gray-400 relative cursor-not-allowed"
                    >
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        Soon
                      </div>
                      <svg
                        className="w-6 h-6 mb-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M8 12L11 15L16 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm font-medium">1v1</span>
                    </button>

                    <button
                      type="button"
                      disabled
                      className="p-3 rounded-lg flex flex-col items-center justify-center border border-gray-200 text-gray-400 relative cursor-not-allowed"
                    >
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        Soon
                      </div>
                      <svg
                        className="w-6 h-6 mb-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 8v4l3 3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.05 11a9 9 0 1 1 .5 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        Exam Simulation
                      </span>
                    </button>
                  </div>
                </div>

                {/* Subject Selection */}
                <div>
                  <label className="text-gray-700 font-medium mb-2 block">
                    Select Subject
                  </label>
                  <div className="border border-gray-200 rounded-lg p-2">
                    {userInterests.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {userInterests.map((interestId) => {
                          const subjectInfo = subjects[interestId] || {
                            name: interestId,
                            icon: "📚",
                          };
                          return (
                            <label
                              key={interestId}
                              className={`flex items-center p-2 cursor-pointer rounded-lg ${
                                selectedSubjects.includes(interestId)
                                  ? "bg-[#E7F7F2]"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <input
                                type="radio"
                                name="subject"
                                checked={selectedSubjects.includes(interestId)}
                                onChange={() => handleSubjectToggle(interestId)}
                                className="h-4 w-4 border-gray-300 text-[#16956C] focus:ring-[#16956C]"
                              />
                              <span className="mx-2 flex-shrink-0">
                                {subjectInfo.icon}
                              </span>
                              <span className="font-medium text-sm truncate">
                                {subjectInfo.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <p>No subjects selected in your profile.</p>
                        <p className="text-sm mt-1">
                          Please add subjects in your profile first.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Topic Selection */}
                <div>
                  <label className="text-gray-700 font-medium mb-2 block">
                    Select Topic
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#16956C] focus:border-transparent"
                  >
                    <option value="random">Random (All Topics)</option>
                    {availableTopics.map((t) => (
                      <option
                        key={t}
                        value={t.toLowerCase().replace(/\s+/g, "-")}
                      >
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time-based specific options */}
                {mode === "time-based" && (
                  <>
                    <div>
                      <label className="text-gray-700 font-medium mb-2 block">
                        Number of Questions
                      </label>
                      <div className="flex">
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={questionCount}
                          onChange={handleQuestionCountChange}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16956C] focus:border-transparent"
                        />
                        <div className="ml-2 text-gray-500 self-center">
                          <span className="text-xs">Max: 50</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-700 font-medium mb-2 block">
                        Time Limit (minutes)
                      </label>
                      <div className="flex">
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={timeLimit}
                          onChange={handleTimeLimitChange}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16956C] focus:border-transparent"
                        />
                        <div className="ml-2 text-gray-500 self-center">
                          <span className="text-xs">Max: 60</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Exam Type */}
                <div>
                  <label className="text-gray-700 font-medium mb-2 block">
                    Exam Type
                  </label>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setExamType("UTME")}
                      className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                        examType === "UTME"
                          ? "border-[#16956C] bg-[#E7F7F2] text-[#16956C]"
                          : "border-gray-200 text-gray-700"
                      }`}
                    >
                      UTME
                    </button>
                    <button
                      type="button"
                      onClick={() => setExamType("WAEC")}
                      className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                        examType === "WAEC"
                          ? "border-[#16956C] bg-[#E7F7F2] text-[#16956C]"
                          : "border-gray-200 text-gray-700"
                      }`}
                    >
                      WAEC
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t">
                <button
                  type="button"
                  onClick={handleStartPractice}
                  className="w-full py-3 px-4 bg-[#16956C] text-white rounded-full font-medium hover:bg-[#138055] transition-colors"
                >
                  Start Practice
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PracticeConfigModal;
