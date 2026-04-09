import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

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

const ExamSimulationResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { results, totalScore, totalQuestions, subjects, timeSpent } =
    location.state || {};

  if (!results) {
    navigate("/dashboard");
    return null;
  }

  const percentage = Math.round((totalScore / totalQuestions) * 100);
  const passed = percentage >= 50;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E7F7F2] to-white p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div
            className={`p-8 text-white text-center ${
              passed
                ? "bg-gradient-to-r from-[#16956C] to-[#138055]"
                : "bg-gradient-to-r from-red-500 to-red-600"
            }`}
          >
            <div className="text-6xl mb-4">
              {passed ? "🎉" : "📚"}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {passed ? "Congratulations!" : "Keep Practicing!"}
            </h1>
            <p className="text-lg opacity-90">
              You scored {totalScore} out of {totalQuestions}
            </p>
            <div className="text-5xl font-bold mt-4">{percentage}%</div>
          </div>

          {/* Stats */}
          <div className="p-8">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-gray-600 text-sm mb-1">Time Spent</div>
                <div className="text-2xl font-bold text-gray-800">
                  {formatTime(timeSpent)}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-gray-600 text-sm mb-1">Accuracy</div>
                <div className="text-2xl font-bold text-gray-800">
                  {percentage}%
                </div>
              </div>
            </div>

            {/* Subject Breakdown */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Subject Breakdown
            </h2>
            <div className="space-y-4">
              {subjects.map((subject) => {
                const result = results[subject];
                const subjectPercentage = Math.round(
                  (result.score / result.total) * 100
                );

                return (
                  <div
                    key={subject}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-800">
                        {subjectNames[subject]}
                      </span>
                      <span className="text-gray-600">
                        {result.score}/{result.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          subjectPercentage >= 50
                            ? "bg-[#16956C]"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${subjectPercentage}%` }}
                      />
                    </div>
                    <div className="text-right text-sm text-gray-600 mt-1">
                      {subjectPercentage}%
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate("/practice")}
                className="flex-1 px-6 py-3 bg-[#16956C] text-white rounded-lg font-medium hover:bg-[#138055] transition-colors"
              >
                Practice More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExamSimulationResult;

