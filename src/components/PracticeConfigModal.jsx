/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectInterests } from "../redux/slices/profileSlice";
import { motion, AnimatePresence } from "framer-motion";

// Updated topics data with comprehensive list
const TOPICS_BY_SUBJECT = {
  english: [
    "Random (All Topics)",
    "Comprehension",
    "Cloze Test, Language Register",
    "Lexis II: Antonyms",
    "Interpretation of Words and Expressions",
    "Idioms, Sayings",
    "Phrasal Verbs",
    "Nouns, Pronouns",
    "Verbs, Tenses",
    "Prepositions",
    "Adjectives, Articles, Determiners",
    "Adverbs, Conjunctions, Punctuation",
    "Rules of Concord, Collocation",
    "Question Tags, Interrogatives, Direct and Reported Speech",
    "Spelling Mistakes",
    "Common Mistakes in English, Fixed Expressions",
    "Test of Oral Forms",
  ],
  chemistry: [
    "Random (All Topics)",
    "Nature of Matter, Separation of Mixtures",
    "Particulate Nature of Matter, Chemical Formula and Equations, Laws of Chemical Reaction",
    "The Atomic Structure, Electronic Configuration, Periodicity of Elements",
    "Chemical Bonding, Shapes of Molecules",
    "The Kinetic Theory of Matter, Gas Laws",
    "Air, Composition of Air, Environmental Pollution",
    "Water, Solutions, Solubility",
    "Acids, Bases, Salts: Hydrolysis of Salts",
    "Stoichiometry, Quantitative and Qualitative Analysis",
    "Types of Reaction, Oxidation and Reduction",
    "Electrolytes, Electrolysis, Electrochemical Cells",
    "Energy Changes in Chemical and Physical Changes, Entropy, Spontaneity of Reaction",
    "Rate of Chemical Reactions",
    "Chemical Equilibrium, Equilibrium Constant",
    "Nuclear Chemistry, Radioactivity, Nuclear Reactions",
    "Non-Metals I: Hydrogen, Oxygen, Carbon, Phosphorus",
    "Non-Metals II: Chlorine, Nitrogen, Sulfur, Silicon",
    "Metals and Their Compounds",
    "Organic Chemistry",
  ],
  physics: [
    "Random (All Topics)",
    "Measurement, Dimensions, Scalar and Vector Quantities",
    "Linear Motion, Projectiles",
    "Gravitational Field, Mass and Weight",
    "Vectors, Equilibrium of Forces",
    "Work, Energy and Power",
    "Friction, Viscosity, Surface Tension",
    "Simple Machines",
    "Elasticity, Hooke's Law, Young's Modulus",
    "Density and Upthrust, Archimedes' Principle, Floatation",
    "Pressure, Pascal's Principle",
    "Temperature and Heat, Thermal Expansion",
    "Structure of Matter, Kinetic Theory, Gas Laws",
    "Quantity of Heat, Heat Capacity and Latent Heat",
    "Change of State, Vapours",
    "Heat Transfer",
    "Waves: Types, Production, Propagation, Properties",
    "Sound Waves: Propagation and Characteristics",
    "Light Energy, Reflection from Plane Surfaces",
    "Reflection of Light from Spherical Surfaces",
    "Refraction of Light from Plane and Spherical Surfaces",
    "Optical Instruments, Vision",
    "Dispersion of Light, Electromagnetic Spectrum",
    "Electrostatics, Electric Field, Capacitors",
    "Current Electricity",
    "Electrical Energy and Power",
    "Magnetic Field and Electromagnetic Induction",
    "Conduction of Electricity through Liquids and Gases",
    "Atomic Physics and Radioactivity",
    "Introductory Electronics",
    "Simple A.C. Circuits",
  ],
  mathematics: [
    "Random (All Topics)",
    "Number Bases",
    "Fractions, Decimals, Percentages, Approximation, Errors",
    "Indices, Standard Form",
    "Logarithms",
    "Surds",
    "Polynomial I: Factorization",
    "Variation, Change of Subject of the Formula",
    "Factor and Remainder Theorems, Function, Polynomial II: Algebraic Inequalities",
    "Mensuration I: Plane Figures",
    "Mensuration II: Solid Figures",
    "Matrices",
    "Geometry I: Lines, Angles, Triangles",
    "Geometry II: Polygons",
    "Binary Operation",
    "Progression: Arithmetic and Geometric",
    "Geometry III: Circle Construction",
    "Geometry IV: Cyclic Quadrilaterals",
    "Geometry V: Coordinate Geometry, Loci",
    "Trigonometry: Special Angles, Solving Triangles, Pythagoras Theorem",
    "Calculus I: Differentiation",
    "Calculus II: Integration",
    "Statistics I: Data Presentation, Measures of Location, Cumulative Frequency",
    "Statistics II: Measures of Dispersion",
    "Permutations and Combinations",
    "Probability",
    "Inequalities",
  ],
  biology: [
    "Random (All Topics)",
    "The Cell - Organization of Life",
    "Classification I: Viruses, Monera, Protista, Fungi",
    "Classification II: Plantae, Thallophyta, Bryophyta, Pteridophyta",
    "Classification III: Higher Plants - Spermatophyta",
    "Classification IV: Lower Invertebrates",
    "Classification V: Higher Invertebrates",
    "Classification VI: Vertebrates I - Pisces, Amphibians, Reptiles",
    "Nutrition - Food Substances",
    "Excretion - Excretory Products",
    "Reproduction in Flowering Plants - Germination",
    "Fruit and Seed Dispersal",
    "Homeostasis - Endocrine System, Plant Hormones",
    "The Nervous System",
    "The Cell and its Environment",
    "Classification VII: Vertebrates - Birds, Mammals",
    "Supporting Tissues - Musculoskeletal System",
    "Digestive System - Digestive Enzymes, Dentition, Movement",
    "Transport - Circulatory System",
    "Respiration",
    "Reproduction in Animals - Growth and Development",
    "Agriculture - Soil Science",
    "Common Diseases - Insect Vectors",
    "Ecology I: Basic Concept, Ecological Management",
    "Ecology II: Ecological Succession, Adaptation, Feeding Relationship",
    "Heredity, Variation, Evolution",
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
  const [timeLimit, setTimeLimit] = useState(5);

  // Modified to handle subject selection
  const handleSubjectToggle = (subjectId) => {
    console.log("Toggling subject:", subjectId);
    // Don't allow deselecting the currently selected subject
    if (selectedSubjects.includes(subjectId) && selectedSubjects.length === 1) {
      return;
    }
    // Set only the clicked subject (ensure lowercase)
    setSelectedSubjects([subjectId.toLowerCase()]);
    // Reset topic when subject changes
    setTopic("random");
  };

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setMode("practice");
      // Ensure lowercase subject ID
      setSelectedSubjects(
        userInterests.length > 0 ? [userInterests[0].toLowerCase()] : []
      );
      setTopic("random");
      setExamType("UTME");
      setQuestionCount(10);
      setTimeLimit(5);
    }
  }, [isOpen, userInterests]);

  const handleQuestionCountChange = (e) => {
    const value = e.target.value;
    // Allow empty input for typing
    if (value === "") {
      setQuestionCount("");
      return;
    }

    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setQuestionCount(numValue);
    }
  };

  const handleQuestionCountBlur = () => {
    const numValue = parseInt(questionCount);
    if (isNaN(numValue) || numValue < 10) {
      setQuestionCount(10);
    } else if (numValue > 50) {
      setQuestionCount(50);
    }
  };

  const handleTimeLimitChange = (e) => {
    const value = e.target.value;
    // Allow empty input for typing
    if (value === "") {
      setTimeLimit("");
      return;
    }

    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setTimeLimit(numValue);
    }
  };

  const handleTimeLimitBlur = () => {
    const numValue = parseInt(timeLimit);
    if (isNaN(numValue) || numValue < 5) {
      setTimeLimit(5);
    } else if (numValue > 60) {
      setTimeLimit(60);
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

  // Add this console log to debug
  console.log("Selected subject:", selectedSubjects[0]);
  console.log(
    "Available topics:",
    selectedSubjects[0] ? TOPICS_BY_SUBJECT[selectedSubjects[0]] : []
  );

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
                          const subjectInfo = subjects[
                            interestId.toLowerCase()
                          ] || {
                            name: interestId,
                            icon: "📚",
                          };
                          return (
                            <label
                              key={interestId}
                              className={`flex items-center p-2 cursor-pointer rounded-lg ${
                                selectedSubjects.includes(
                                  interestId.toLowerCase()
                                )
                                  ? "bg-[#E7F7F2]"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <input
                                type="radio"
                                name="subject"
                                checked={selectedSubjects.includes(
                                  interestId.toLowerCase()
                                )}
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
                    {selectedSubjects[0] ? (
                      TOPICS_BY_SUBJECT[selectedSubjects[0].toLowerCase()]?.map(
                        (topicName, index) => (
                          <option
                            key={index}
                            value={index === 0 ? "random" : topicName}
                          >
                            {topicName}
                          </option>
                        )
                      )
                    ) : (
                      <option value="random">
                        Please select a subject first
                      </option>
                    )}
                  </select>
                </div>

                {/* Time-based specific options */}
                {mode === "time-based" && (
                  <>
                    <div>
                      <label className="text-gray-700 font-medium mb-2 block">
                        Number of Questions
                      </label>
                      <div className="flex flex-col">
                        <input
                          type="number"
                          min="10"
                          max="50"
                          value={questionCount}
                          onChange={handleQuestionCountChange}
                          onBlur={handleQuestionCountBlur}
                          placeholder="Enter number of questions"
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16956C] focus:border-transparent"
                        />
                        <div className="text-gray-500 self-start">
                          <span className="text-xs">
                            Min: 10, Max: 50 questions
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-700 font-medium mb-2 block">
                        Time Limit (minutes)
                      </label>
                      <div className="flex flex-col">
                        <input
                          type="number"
                          min="5"
                          max="60"
                          value={timeLimit}
                          onChange={handleTimeLimitChange}
                          onBlur={handleTimeLimitBlur}
                          placeholder="Enter time limit"
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16956C] focus:border-transparent"
                        />
                        <div className="text-gray-500 self-start">
                          <span className="text-xs">
                            Min: 5, Max: 60 minutes
                          </span>
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
