import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectPersonalInfo } from "../redux/slices/profileSlice";
import { useExamSimulation } from "../hooks/api/useFeatures";
import { BeatLoader } from "react-spinners";
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

const ExamConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const personalInfo = useSelector(selectPersonalInfo);
  const { fetchExamQuestions } = useExamSimulation();
  const [loading, setLoading] = useState(false);

  // Get selected subjects from URL params
  const subject1 = searchParams.get("subject1");
  const subject2 = searchParams.get("subject2");
  const subject3 = searchParams.get("subject3");

  const selectedSubjects = ["english", subject1, subject2, subject3].filter(
    Boolean
  );

  useEffect(() => {
    // Redirect if subjects are not properly selected
    if (selectedSubjects.length !== 4) {
      navigate("/dashboard");
    }
  }, [selectedSubjects, navigate]);

  const handleStartExam = async () => {
    setLoading(true);
    try {
      const examData = await fetchExamQuestions(selectedSubjects);
      // Navigate to exam page with data
      navigate("/jamb/exam/simulation", {
        state: {
          examData,
          subjects: selectedSubjects,
        },
      });
    } catch (error) {
      console.error("Failed to load exam:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E7F7F2] to-white p-6 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8"
      >
        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-[#16956C] to-[#138055] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
            {personalInfo.avatarUrl ? (
              <img
                src={personalInfo.avatarUrl}
                alt={personalInfo.fullName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              personalInfo.fullName?.charAt(0).toUpperCase() || "U"
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {personalInfo.fullName || "Student"}
          </h2>
          <p className="text-gray-600">{personalInfo.email}</p>
        </div>

        {/* Exam Details */}
        <div className="bg-[#E7F7F2] rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-[#16956C] mb-4">
            JAMB Exam Simulation
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Duration:</span>
              <span className="text-gray-900 font-bold">2 Hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Total Questions:</span>
              <span className="text-gray-900 font-bold">180</span>
            </div>
            <div className="border-t border-[#16956C]/20 pt-3 mt-3">
              <p className="text-gray-700 font-medium mb-2">Subjects:</p>
              <div className="grid grid-cols-2 gap-2">
                {selectedSubjects.map((subject) => (
                  <div
                    key={subject}
                    className="bg-white rounded-lg px-3 py-2 text-sm font-medium text-gray-800"
                  >
                    {subjectNames[subject]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 className="font-bold text-yellow-800 mb-2">⚠️ Important:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• You have 2 hours to complete all subjects</li>
            <li>• You can switch between subjects anytime</li>
            <li>• Questions can be skipped and revisited</li>
            <li>• Exam will auto-submit when time expires</li>
          </ul>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartExam}
          disabled={loading}
          className="w-full bg-[#16956C] hover:bg-[#138055] text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <BeatLoader color="#ffffff" size={10} />
          ) : (
            "Start Exam"
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default ExamConfirmation;

