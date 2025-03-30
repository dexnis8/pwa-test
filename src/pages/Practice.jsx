import React from "react";
import { Link } from "react-router-dom";

const Practice = () => {
  const practiceQuizzes = [
    {
      id: 1,
      title: "Basic Mathematics",
      description: "Practice fundamental math concepts",
      questions: 20,
      timeLimit: "30 minutes",
      difficulty: "Easy",
      backgroundColor: "#C7F9CC",
      iconColor: "#38B000",
    },
    {
      id: 2,
      title: "Physics Mechanics",
      description: "Test your understanding of physics principles",
      questions: 15,
      timeLimit: "25 minutes",
      difficulty: "Medium",
      backgroundColor: "#BDE0FE",
      iconColor: "#1E6091",
    },
    {
      id: 3,
      title: "Chemistry Elements",
      description: "Learn about periodic table and elements",
      questions: 25,
      timeLimit: "35 minutes",
      difficulty: "Hard",
      backgroundColor: "#FFD6FF",
      iconColor: "#9D4EDD",
    },
    {
      id: 4,
      title: "English Grammar",
      description: "Improve your grammar and vocabulary",
      questions: 30,
      timeLimit: "40 minutes",
      difficulty: "Medium",
      backgroundColor: "#FFADAD",
      iconColor: "#E63946",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-[#16956C] text-2xl font-bold mb-2">Practice</h1>
      <p className="text-gray-600 mb-6">Select a quiz to start practicing</p>

      <div className="space-y-4">
        {practiceQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white rounded-xl overflow-hidden shadow-sm"
          >
            <div
              className="py-4 px-6"
              style={{ backgroundColor: quiz.backgroundColor }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{quiz.title}</h3>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: quiz.iconColor }}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4.5V19.5M19.5 12H4.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                  {quiz.questions} questions
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                  {quiz.timeLimit}
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                  {quiz.difficulty}
                </span>
              </div>
              <Link
                to={`/practice/${quiz.id}`}
                className="block w-full bg-[#16956C] hover:bg-[#138055] text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Start Quiz
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Practice;
