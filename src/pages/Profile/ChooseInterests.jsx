import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setInterests,
  selectInterests,
  completeProfile,
  selectCompletionStep,
  setCompletionStep,
} from "../../redux/slices/profileSlice";

const ChooseInterests = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const savedInterests = useSelector(selectInterests);
  const currentStep = useSelector(selectCompletionStep);

  // Use saved interests if available, otherwise use defaults
  const [selectedInterests, setSelectedInterests] = useState(
    savedInterests.length > 0 ? savedInterests : ["english"]
  );

  const totalSteps = 3;
  const minimumSelections = 4;

  // Set the current step to 3 when this component mounts
  useEffect(() => {
    if (currentStep !== 3) {
      dispatch(setCompletionStep(3));
    }
  }, [currentStep, dispatch]);

  const subjects = [
    {
      id: "english",
      name: "English",
      icon: "📝",
    },
    {
      id: "mathematics",
      name: "Mathematics",
      icon: "🔢",
    },
    {
      id: "physics",
      name: "Physics",
      icon: "🔭",
    },
    {
      id: "biology",
      name: "Biology",
      icon: "🧬",
    },
    {
      id: "chemistry",
      name: "Chemistry",
      icon: "🧪",
    },
  ];

  const toggleInterest = (id) => {
    setSelectedInterests((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleBack = () => {
    // Save current selections before navigating away
    dispatch(setInterests(selectedInterests));
    navigate("/profile/complete/step2");
  };

  const handleComplete = () => {
    // Save selected interests to Redux
    dispatch(setInterests(selectedInterests));

    // Mark profile as completed
    dispatch(completeProfile());

    // Navigate to dashboard
    navigate("/dashboard");
  };

  const isMinimumSelected = selectedInterests.length >= minimumSelections;

  return (
    <div className="flex flex-col min-h-screen bg-white p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="bg-gray-100 rounded-full p-2 mr-3 hover:bg-gray-200 transition-colors"
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <h1 className="text-[#16956C] text-2xl font-bold">
              Choose <br /> your interest
            </h1>
          </div>
          <span className="text-gray-500 font-semibold">
            {currentStep}/{totalSteps}
          </span>
        </div>
        <p className="text-gray-700 text-sm">
          Select minimum of {minimumSelections} subjects
        </p>
      </div>

      {/* Subject Options */}
      <div className="flex-1 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {subjects.map((subject) => {
            const isSelected = selectedInterests.includes(subject.id);
            return (
              <button
                key={subject.id}
                type="button"
                onClick={() => toggleInterest(subject.id)}
                className={`
                  flex items-center px-4 py-3 rounded-full transition-colors
                  ${
                    isSelected
                      ? "bg-[#16956C] text-white"
                      : "bg-white text-gray-800 border border-gray-200 shadow-sm"
                  }
                `}
              >
                {isSelected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span className="mr-2">{subject.icon}</span>
                <span className="font-medium text-sm whitespace-nowrap">
                  {subject.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Complete Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={handleComplete}
          disabled={!isMinimumSelected}
          className={`w-full py-4 px-4 rounded-full font-medium transition-colors ${
            isMinimumSelected
              ? "bg-[#16956C] text-white hover:bg-[#0F7355]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isMinimumSelected ? "Done" : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default ChooseInterests;
