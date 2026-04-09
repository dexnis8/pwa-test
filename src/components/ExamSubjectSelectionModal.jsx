import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const subjects = {
  english: { name: "English", icon: "📝", required: true },
  mathematics: { name: "Mathematics", icon: "🔢" },
  physics: { name: "Physics", icon: "🔭" },
  biology: { name: "Biology", icon: "🧬" },
  chemistry: { name: "Chemistry", icon: "🧪" },
  commerce: { name: "Commerce", icon: "💼" },
  accounting: { name: "Accounting", icon: "📊" },
  economics: { name: "Economics", icon: "📈" },
  government: { name: "Government", icon: "🏛️" },
  literature: { name: "Literature", icon: "📚" },
  crk: { name: "CRK", icon: "✝️" },
  irk: { name: "IRK", icon: "☪️" },
  geography: { name: "Geography", icon: "🌍" },
  civileducation: { name: "Civic Education", icon: "🎓" },
};

const ExamSubjectSelectionModal = ({ isOpen, onClose, onConfirm }) => {
  const [selectedSubjects, setSelectedSubjects] = useState(["english"]);

  useEffect(() => {
    if (isOpen) {
      setSelectedSubjects(["english"]);
    }
  }, [isOpen]);

  const handleSubjectToggle = (subjectId) => {
    if (subjectId === "english") return; // English is required

    setSelectedSubjects((prev) => {
      if (prev.includes(subjectId)) {
        return prev.filter((id) => id !== subjectId);
      } else {
        if (prev.length >= 4) {
          return prev; // Max 4 subjects
        }
        return [...prev, subjectId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedSubjects.length === 4) {
      onConfirm(selectedSubjects);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#16956C] text-white p-5">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Select Exam Subjects</h2>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm mt-2 text-white/90">
              English is required. Select 3 more subjects ({selectedSubjects.length}/4)
            </p>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(subjects).map(([id, subject]) => {
                const isSelected = selectedSubjects.includes(id);
                const isRequired = subject.required;
                const isDisabled = !isSelected && selectedSubjects.length >= 4;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSubjectToggle(id)}
                    disabled={isRequired || isDisabled}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-[#16956C] bg-[#E7F7F2] text-[#16956C]"
                        : isDisabled
                        ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                        : "border-gray-200 text-gray-700 hover:border-[#16956C]/50"
                    } ${isRequired ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="text-2xl mb-1">{subject.icon}</div>
                    <div className="text-sm font-medium">{subject.name}</div>
                    {isRequired && (
                      <div className="text-xs text-[#16956C] mt-1">Required</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-200">
            <button
              onClick={handleContinue}
              disabled={selectedSubjects.length !== 4}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedSubjects.length === 4
                  ? "bg-[#16956C] text-white hover:bg-[#138055]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue to Exam
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExamSubjectSelectionModal;

