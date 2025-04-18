/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// --- Icons --- (Consider replacing with a dedicated icon library like react-icons)
const IconWrapper = ({ children }) => (
  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#16956C]/10 mb-4">
    {children}
  </div>
);

const PracticeIcon = () => (
  <svg
    className="w-6 h-6 text-[#16956C]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
    />
  </svg>
);
const TimedIcon = () => (
  <svg
    className="w-6 h-6 text-[#16956C]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const ExamIcon = () => (
  <svg
    className="w-6 h-6 text-[#16956C]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const SubjectIcon = () => (
  <svg
    className="w-6 h-6 text-[#16956C]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);
const ResultsIcon = () => (
  <svg
    className="w-6 h-6 text-[#16956C]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);
const ShareIcon = () => (
  <svg
    className="w-6 h-6 text-[#16956C]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.016l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
    />
  </svg>
);
const ChevronDownIcon = () => (
  <svg
    className="w-5 h-5 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);
const QuoteIcon = () => (
  <svg
    className="w-8 h-8 text-[#16956C]/30 absolute top-4 left-4"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.107 0 3.041-2.464 5.5-5.5 5.5s-5.5-2.459-5.5-5.5zm-8 0c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.107 0 3.041-2.464 5.5-5.5 5.5s-5.5-2.459-5.5-5.5z" />
  </svg>
);

// --- Icons for 'How it Works' Section ---
const SignUpIcon = () => (
  <svg
    className="w-6 h-6 text-[#16956C]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
    />
  </svg>
);
const ConfigureIcon = () => (
  <svg
    className="w-6 h-6 text-[#16956C]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const StartLearningIcon = () => (
  <svg
    className="w-6 h-6 text-[#16956C]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// --- Animation Variants --- //
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const LandingPage = () => {
  // Basic FAQ Toggle (Can be improved with a dedicated accordion component)
  const [openFAQ, setOpenFAQ] = React.useState(null);
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  const appUrl = "https://pwa-test-vert-xi.vercel.app/auth/signin";
  const faqs = [
    {
      q: "Is Pace App free to use?",
      a: "Pace App offers both free and premium features. You can start with a free account to access basic practice sessions. A premium subscription unlocks more questions, detailed analytics, and additional exam types.",
    },
    {
      q: "What exams does Pace App cover?",
      a: "Currently, we focus on major Nigerian exams like UTME, WAEC, and NECO. We are constantly working to expand our question bank and exam coverage.",
    },
    {
      q: "Can I use Pace App on multiple devices?",
      a: "Yes! Pace App is a web application accessible from any device with a modern web browser, including desktops, laptops, tablets, and smartphones.",
    },
    {
      q: "How are the questions sourced?",
      a: "Our questions are carefully curated and reviewed by subject matter experts based on official exam syllabi and past questions to ensure relevance and accuracy.",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased">
      {/* --- Header --- */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm fixed w-full z-30 transition-all duration-300">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-[#16956C]">
            Pace App
          </Link>
          <div className="space-x-2 sm:space-x-4">
            <Link
              to={appUrl}
              className="text-gray-600 hover:text-[#16956C] px-3 py-2 rounded-md text-sm sm:text-base font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to={appUrl}
              className="bg-[#16956C] text-white px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-medium hover:bg-[#138055] transition-colors duration-300 shadow-sm hover:shadow-md"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* --- Hero Section --- */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="relative pt-28 pb-20 md:pt-36 md:pb-28 bg-gradient-to-br from-[#E7F7F2] via-white to-gray-50 text-center overflow-hidden"
      >
        {/* Enhanced Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#16956C]/5 rounded-full filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#1DA975]/10 rounded-full filter blur-3xl opacity-60 translate-x-1/3 translate-y-1/3"></div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 right-[15%] h-20 w-20 bg-[#1DA975]/10 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-1/4 left-[15%] h-12 w-12 bg-[#1D7A8C]/15 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Decorative Patterns */}
        <div className="absolute left-0 top-1/2 opacity-10 hidden lg:block">
          <svg
            width="150"
            height="150"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="2" fill="#16956C" />
            <circle cx="10" cy="25" r="2" fill="#16956C" />
            <circle cx="10" cy="40" r="2" fill="#16956C" />
            <circle cx="10" cy="55" r="2" fill="#16956C" />
            <circle cx="10" cy="70" r="2" fill="#16956C" />
            <circle cx="10" cy="85" r="2" fill="#16956C" />
            <circle cx="25" cy="10" r="2" fill="#16956C" />
            <circle cx="25" cy="25" r="2" fill="#16956C" />
            <circle cx="25" cy="40" r="2" fill="#16956C" />
            <circle cx="25" cy="55" r="2" fill="#16956C" />
            <circle cx="25" cy="70" r="2" fill="#16956C" />
            <circle cx="25" cy="85" r="2" fill="#16956C" />
            <circle cx="40" cy="10" r="2" fill="#16956C" />
            <circle cx="40" cy="25" r="2" fill="#16956C" />
            <circle cx="40" cy="40" r="2" fill="#16956C" />
            <circle cx="40" cy="55" r="2" fill="#16956C" />
            <circle cx="40" cy="70" r="2" fill="#16956C" />
            <circle cx="40" cy="85" r="2" fill="#16956C" />
            <circle cx="55" cy="10" r="2" fill="#16956C" />
            <circle cx="55" cy="25" r="2" fill="#16956C" />
            <circle cx="55" cy="40" r="2" fill="#16956C" />
            <circle cx="55" cy="55" r="2" fill="#16956C" />
            <circle cx="55" cy="70" r="2" fill="#16956C" />
            <circle cx="55" cy="85" r="2" fill="#16956C" />
          </svg>
        </div>
        <div className="absolute right-0 bottom-1/3 opacity-10 hidden lg:block">
          <svg
            width="150"
            height="150"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="2" fill="#1D7A8C" />
            <circle cx="10" cy="25" r="2" fill="#1D7A8C" />
            <circle cx="10" cy="40" r="2" fill="#1D7A8C" />
            <circle cx="10" cy="55" r="2" fill="#1D7A8C" />
            <circle cx="10" cy="70" r="2" fill="#1D7A8C" />
            <circle cx="10" cy="85" r="2" fill="#1D7A8C" />
            <circle cx="25" cy="10" r="2" fill="#1D7A8C" />
            <circle cx="25" cy="25" r="2" fill="#1D7A8C" />
            <circle cx="25" cy="40" r="2" fill="#1D7A8C" />
            <circle cx="25" cy="55" r="2" fill="#1D7A8C" />
            <circle cx="25" cy="70" r="2" fill="#1D7A8C" />
            <circle cx="25" cy="85" r="2" fill="#1D7A8C" />
            <circle cx="40" cy="10" r="2" fill="#1D7A8C" />
            <circle cx="40" cy="25" r="2" fill="#1D7A8C" />
            <circle cx="40" cy="40" r="2" fill="#1D7A8C" />
            <circle cx="40" cy="55" r="2" fill="#1D7A8C" />
            <circle cx="40" cy="70" r="2" fill="#1D7A8C" />
            <circle cx="40" cy="85" r="2" fill="#1D7A8C" />
            <circle cx="55" cy="10" r="2" fill="#1D7A8C" />
            <circle cx="55" cy="25" r="2" fill="#1D7A8C" />
            <circle cx="55" cy="40" r="2" fill="#1D7A8C" />
            <circle cx="55" cy="55" r="2" fill="#1D7A8C" />
            <circle cx="55" cy="70" r="2" fill="#1D7A8C" />
            <circle cx="55" cy="85" r="2" fill="#1D7A8C" />
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative h-[100vh] z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="lg:text-left mt-6 lg:mt-0 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="inline-block bg-[#16956C]/10 text-[#16956C] text-sm font-semibold px-4 py-1 rounded-full mb-4"
              >
                #1 EXAM PREP PLATFORM
              </motion.div>
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.2,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100,
                }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-5 leading-tight"
              >
                Boost Your Exam{" "}
                <span className="text-[#16956C] inline-block relative">
                  Scores
                  <svg
                    className="absolute -bottom-2 w-full h-2 left-0"
                    viewBox="0 0 300 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 10C51.5 4 99.5 2 150 2C199.5 2 249 4 298 10"
                      stroke="#16956C"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                with Pace App
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-base sm:text-lg text-gray-600 mb-8 max-w-xl lg:mx-0 mx-auto"
              >
                Master UTME, WAEC, and NECO exams with personalized practice
                sessions. Choose your subjects, track progress, and improve with
                real-time feedback.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center"
              >
                <Link
                  to={appUrl}
                  className="bg-[#16956C] text-white px-6 py-3 sm:px-8 rounded-full text-base sm:text-lg font-semibold hover:bg-[#138055] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto text-center"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/auth/signin"
                  className="text-gray-700 font-medium border border-gray-300 bg-white hover:bg-gray-50 px-6 py-3 rounded-full transition-colors duration-300 w-full sm:w-auto text-center"
                >
                  Already have an account?
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-8 flex items-center justify-center lg:justify-start"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br ${
                        i % 2 === 0
                          ? "from-blue-400 to-blue-500"
                          : "from-[#16956C] to-[#138055]"
                      } flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {i}+
                    </div>
                  ))}
                </div>
                <div className="ml-4 text-sm text-gray-500">
                  <span className="font-semibold">1000+</span> students already
                  improving their scores
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
              className="order-1 lg:order-2 relative"
            >
              {/* App screen mockup */}
              <div className="relative mx-auto w-full max-w-md hidden md:block h-[60vh]">
                {/* Device frame */}
                <div className="bg-gray-800 rounded-[2.5rem] p-4 shadow-xl">
                  {/* Screen */}
                  <div className="bg-gradient-to-br from-[#16956C] to-[#138055] aspect-[9/19] rounded-[2rem] p-3 overflow-hidden relative">
                    {/* Status bar */}
                    <div className="flex justify-between text-[10px] text-white/90 mb-4">
                      <span>9:41</span>
                      <div className="flex space-x-1">
                        <span>●</span>
                        <span>●</span>
                        <span>●</span>
                        <span>●</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-xl shadow-lg p-3 h-[80%]">
                      <div className="bg-[#16956C]/10 w-full h-4 rounded mb-4"></div>
                      <div className="flex justify-between mb-3">
                        <div className="bg-gray-200 w-2/5 h-3 rounded"></div>
                        <div className="bg-[#16956C] w-1/5 h-3 rounded"></div>
                      </div>
                      <div className="bg-gray-100 w-full h-24 rounded-lg mb-3"></div>

                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`bg-gray-100 border ${
                              i === 2
                                ? "border-[#16956C]"
                                : "border-transparent"
                            } rounded-lg p-2 flex items-center`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full ${
                                i === 2 ? "bg-[#16956C]/20" : "bg-gray-200"
                              } mr-2`}
                            ></div>
                            <div className="bg-gray-200 w-3/4 h-2 rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 rounded-t-xl h-[8%] flex justify-around items-center px-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded-full ${
                            i === 2 ? "bg-[#16956C]" : "bg-gray-200"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -right-10 -bottom-6 bg-[#16956C]/20 backdrop-blur-lg rounded-lg p-3 shadow-lg transform rotate-6 z-20 hidden sm:block">
                  <div className="flex space-x-1">
                    <div className="h-5 w-5 rounded-full bg-[#16956C]"></div>
                    <div className="h-5 w-14 rounded-full bg-white flex items-center justify-center text-[10px] font-medium text-[#16956C]">
                      Practice Mode
                    </div>
                  </div>
                </div>

                <div className="absolute -left-12 -top-6 bg-white/90 backdrop-blur-lg rounded-lg p-3 shadow-lg transform -rotate-6 z-20 hidden sm:block">
                  <div className="flex space-x-2 items-center">
                    <div className="text-xs font-medium">Score: 8/10</div>
                    <div className="flex space-x-[2px]">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg
                          key={i}
                          className="w-3 h-3 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Key benefits */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 lg:mt-24 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50"
          >
            <div className="flex items-start">
              <div className="bg-[#16956C]/10 p-3 rounded-lg mr-4">
                <svg
                  className="w-5 h-5 text-[#16956C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Practice at Your Pace
                </h3>
                <p className="text-sm text-gray-600">
                  Choose between timed or untimed practice sessions
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-[#16956C]/10 p-3 rounded-lg mr-4">
                <svg
                  className="w-5 h-5 text-[#16956C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Exam-Focused Content
                </h3>
                <p className="text-sm text-gray-600">
                  Questions tailored to UTME, WAEC and NECO
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-[#16956C]/10 p-3 rounded-lg mr-4">
                <svg
                  className="w-5 h-5 text-[#16956C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Track Your Progress
                </h3>
                <p className="text-sm text-gray-600">
                  See your improvement over time with analytics
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* --- Features Section --- */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Why Choose Pace App?
          </h2>
          <p className="text-lg text-gray-600 mb-12 sm:mb-16 max-w-xl mx-auto">
            Everything you need to prepare effectively and boost your scores.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                icon: <PracticeIcon />,
                title: "Flexible Practice",
                description:
                  "Learn at your own speed with untimed sessions focused on understanding.",
              },
              {
                icon: <TimedIcon />,
                title: "Realistic Timed Mode",
                description:
                  "Simulate exam conditions and improve your time management skills.",
              },
              {
                icon: <ExamIcon />,
                title: "Multiple Exam Types",
                description:
                  "Tailored question banks for UTME, WAEC, NECO, and more.",
              },
              {
                icon: <SubjectIcon />,
                title: "Wide Subject Coverage",
                description:
                  "Comprehensive practice across key subjects relevant to your exams.",
              },
              {
                icon: <ResultsIcon />,
                title: "Insightful Results",
                description:
                  "Get instant feedback, track scores, and understand your progress.",
              },
              {
                icon: <ShareIcon />,
                title: "Share Your Success",
                description:
                  "Motivate yourself and others by easily sharing your achievements.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                className="bg-gray-50/50 p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center border border-gray-100"
              >
                <IconWrapper>{feature.icon}</IconWrapper>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* --- How It Works Section --- */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#f0fff9] to-gray-50 overflow-hidden"
      >
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 bg-[#16956C]/10 text-[#16956C] rounded-full text-sm font-medium mb-4"
          >
            QUICK START
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
          >
            Get Started in 3 Easy Steps
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 mb-12 sm:mb-16 max-w-xl mx-auto"
          >
            Start your journey to exam success quickly and easily.
          </motion.p>

          <div className="relative max-w-5xl mx-auto">
            {/* Connecting line - Enhanced visibility */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-1 bg-[#16956C]/10 transform -translate-y-1/2 z-0 rounded-full"></div>
            <div
              className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-1 bg-[#16956C]/30 transform -translate-y-1/2 z-0 rounded-full animate-pulse-slow"
              style={{ width: "50%" }}
            ></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
              {[
                {
                  icon: <SignUpIcon />,
                  title: "Sign Up Free",
                  description: "Create your account in just a few clicks.",
                },
                {
                  icon: <ConfigureIcon />,
                  title: "Set Your Practice",
                  description:
                    "Choose exam type, subject, topics, and practice mode.",
                },
                {
                  icon: <StartLearningIcon />,
                  title: "Begin Learning",
                  description:
                    "Start practicing, get instant feedback, and track your scores.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="relative z-10 flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Icon with background */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#16956C]/10 to-[#1D7A8C]/10 mb-5 shadow-inner border border-white/50">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                  {/* Step number bubble */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#16956C] text-white font-bold text-sm flex items-center justify-center shadow-md border-2 border-white">
                    {index + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* --- Leaderboard Showcase Section --- */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute left-0 top-0 w-full h-full opacity-5">
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#16956C] rounded-full"></div>
          <div className="absolute right-0 bottom-0 w-60 h-60 bg-[#1D7A8C] rounded-full"></div>
        </div>

        <div className="container mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
            >
              Compete & Rise to the Top
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Track your progress against other students, earn points for each
              correct answer, and climb the leaderboard to showcase your
              knowledge.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Why Our Leaderboard Matters
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#16956C]/10 p-2 rounded-lg mr-3 mt-1">
                    <svg
                      className="w-5 h-5 text-[#16956C]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Motivation Through Competition
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Friendly competition keeps you motivated to practice more
                      and improve your scores.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#16956C]/10 p-2 rounded-lg mr-3 mt-1">
                    <svg
                      className="w-5 h-5 text-[#16956C]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Track Your Performance
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      See how you compare to others in your subject areas and
                      identify where to focus your studies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#16956C]/10 p-2 rounded-lg mr-3 mt-1">
                    <svg
                      className="w-5 h-5 text-[#16956C]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Earn Rewards & Recognition
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Top performers get featured in our weekly highlights and
                      earn special badges and achievements.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to={appUrl}
                  className="inline-flex items-center text-[#16956C] font-semibold hover:text-[#138055] transition-colors"
                >
                  Join the competition
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              {/* Leaderboard UI */}
              <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#16956C] to-[#1D7A8C] text-white p-5">
                  <h3 className="font-bold text-xl">Weekly Leaderboard</h3>
                  <p className="text-white/70 text-sm">
                    Top performers across all subjects
                  </p>
                </div>

                {/* Podium for top 3 */}
                <div className="bg-gray-50 p-5 flex items-end justify-center space-x-4 h-32">
                  {/* 2nd place */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 mb-2 flex items-center justify-center border-2 border-white shadow-md">
                      <span className="font-bold text-white">2</span>
                    </div>
                    <div className="bg-gradient-to-br from-gray-200 to-gray-300 w-20 h-20 flex items-center justify-center rounded-t-lg">
                      <div className="text-center">
                        <div className="font-semibold text-gray-700">
                          Bola M.
                        </div>
                        <div className="text-xs text-gray-500">876 pts</div>
                      </div>
                    </div>
                  </div>

                  {/* 1st place */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 mb-2 flex items-center justify-center border-2 border-white shadow-md">
                      <span className="font-bold text-white">1</span>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 w-24 h-28 flex items-center justify-center rounded-t-lg border-t border-x border-yellow-300">
                      <div className="text-center">
                        <div className="font-semibold text-gray-700">
                          Ade T.
                        </div>
                        <div className="text-xs text-gray-500">982 pts</div>
                      </div>
                    </div>
                  </div>

                  {/* 3rd place */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 mb-2 flex items-center justify-center border-2 border-white shadow-md">
                      <span className="font-bold text-white">3</span>
                    </div>
                    <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-20 h-16 flex items-center justify-center rounded-t-lg">
                      <div className="text-center">
                        <div className="font-semibold text-gray-700">
                          Chioma E.
                        </div>
                        <div className="text-xs text-gray-500">754 pts</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Leaderboard list */}
                <div className="p-4">
                  {[
                    {
                      rank: 4,
                      name: "David O.",
                      points: 721,
                      subject: "Chemistry",
                    },
                    {
                      rank: 5,
                      name: "Faith A.",
                      points: 692,
                      subject: "Physics",
                    },
                    {
                      rank: 6,
                      name: "Ngozi I.",
                      points: 615,
                      subject: "Biology",
                    },
                    {
                      rank: 7,
                      name: "Kwame B.",
                      points: 583,
                      subject: "English",
                    },
                  ].map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center py-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 font-semibold text-gray-500">
                        {user.rank}
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-gray-800">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.subject}
                        </div>
                      </div>
                      <div className="text-[#16956C] font-semibold">
                        {user.points} pts
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-3 text-center">
                  <span className="text-sm font-medium text-gray-500">
                    Updated every Monday
                  </span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#16956C]/10 rounded-full filter blur-lg"></div>
              <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-[#1D7A8C]/10 rounded-full filter blur-lg"></div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* --- Modes Section --- */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden"
      >
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 bg-[#16956C]/10 text-[#16956C] rounded-full text-sm font-medium mb-4"
            >
              LEARNING OPTIONS
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
            >
              Diverse Modes to Match Your Goals
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Whether you want stress-free practice, timed challenges, or real
              exam simulations, Pace App has a mode for you.
            </motion.p>
          </div>

          {/* Practice Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 lg:mb-24">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              {/* Improved Placeholder Visual */}
              <div className="aspect-video bg-gradient-to-br from-[#1D7A8C] to-[#155a68] rounded-xl shadow-xl p-6 flex flex-col justify-between text-white overflow-hidden">
                <div className="text-sm font-medium uppercase tracking-wider opacity-80">
                  Practice Mode
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold opacity-20">?</div>
                  <div className="text-lg mt-2">Focus on Learning</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs opacity-70">Untimed</span>
                  <span className="text-xs opacity-70">Instant Feedback</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#1D7A8C]/20 rounded-full filter blur-xl"></div>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Practice Mode: Learn Without Pressure
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Ideal for understanding concepts and building a strong
                foundation. Take your time to review answers and solidify your
                knowledge without the stress of a ticking clock.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#16956C] mr-2 mt-1">✓</span>
                  <span>Untimed sessions for stress-free learning.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#16956C] mr-2 mt-1">✓</span>
                  <span>Instant feedback helps you learn from mistakes.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#16956C] mr-2 mt-1">✓</span>
                  <span>Perfect for exploring new subjects and topics.</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Timed Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 lg:mb-24">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left md:order-2"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Timed Mode: Simulate Exam Conditions
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Prepare for the real exam experience. Test your speed and
                accuracy under pressure, developing crucial time management
                skills for exam day success.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#16956C] mr-2 mt-1">✓</span>
                  <span>Set time limits to mimic actual exam duration.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#16956C] mr-2 mt-1">✓</span>
                  <span>Develop effective time management strategies.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#16956C] mr-2 mt-1">✓</span>
                  <span>
                    Accurately gauge your readiness for exam pressure.
                  </span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="md:order-1 relative"
            >
              {/* Improved Placeholder Visual */}
              <div className="aspect-video bg-gradient-to-br from-[#E74C3C] to-[#c0392b] rounded-xl shadow-xl p-6 flex flex-col justify-between text-white overflow-hidden">
                <div className="text-sm font-medium uppercase tracking-wider opacity-80">
                  Timed Mode
                </div>
                <div className="text-center">
                  <div className="text-6xl font-mono font-bold opacity-80">
                    10:00
                  </div>
                  <div className="text-lg mt-2">Race Against Time</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs opacity-70">Exam Simulation</span>
                  <span className="text-xs opacity-70">Accuracy & Speed</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#E74C3C]/20 rounded-full filter blur-xl"></div>
            </motion.div>
          </div>

          {/* 1v1 Challenge Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 lg:mb-24">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              {/* Placeholder Visual for 1v1 */}
              <div className="aspect-video bg-gradient-to-br from-[#F39C12] to-[#d35400] rounded-xl shadow-xl p-6 flex flex-col justify-between text-white overflow-hidden">
                <div className="text-sm font-medium uppercase tracking-wider opacity-80">
                  1v1 Challenge
                </div>
                <div className="text-center flex items-center justify-center gap-4">
                  <span className="text-6xl font-bold opacity-80">User</span>
                  <span className="text-3xl font-bold opacity-60">vs</span>
                  <span className="text-6xl font-bold opacity-80">User</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs opacity-70">Head-to-Head</span>
                  <span className="text-xs opacity-70">Real-time Battle</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#F39C12]/20 rounded-full filter blur-xl"></div>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                1v1 Challenge: Test Your Skills
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Challenge friends or other Pace App users in a real-time
                knowledge battle. See who can answer questions faster and more
                accurately.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#16956C] mr-2 mt-1">✓</span>
                  <span>Compete head-to-head with other students.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#16956C] mr-2 mt-1">✓</span>
                  <span>
                    Real-time scoring and leaderboards for bragging rights.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#16956C] mr-2 mt-1">✓</span>
                  <span>Makes learning competitive and engaging.</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Exam Simulation Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left md:order-2"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Exam Simulation: The Ultimate Test
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Experience the closest thing to the actual exam. Covers multiple
                subjects with strict timing and official scoring formats (e.g.,
                UTME's 4 subjects, 180 questions).
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#16956C] mr-2 mt-1">✓</span>
                  <span>
                    Full mock exams mirroring official formats (UTME, WAEC,
                    NECO).
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#16956C] mr-2 mt-1">✓</span>
                  <span>Strict time limits and multi-subject structure.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#16956C] mr-2 mt-1">✓</span>
                  <span>Comprehensive performance analysis post-exam.</span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="md:order-1 relative"
            >
              {/* Placeholder Visual for Exam Sim */}
              <div className="aspect-video bg-gradient-to-br from-[#8E44AD] to-[#5e3370] rounded-xl shadow-xl p-6 flex flex-col justify-between text-white overflow-hidden">
                <div className="text-sm font-medium uppercase tracking-wider opacity-80">
                  Exam Simulation
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold opacity-80">📚</div>
                  <div className="text-lg mt-2">Full Mock Exam</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs opacity-70">Official Format</span>
                  <span className="text-xs opacity-70">Strict Timing</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#8E44AD]/20 rounded-full filter blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* --- Testimonials Section --- */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#f0fff9] to-gray-50 relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-[#16956C]/5 to-transparent rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tl from-[#1D7A8C]/5 to-transparent rounded-full filter blur-3xl"></div>

        {/* Quote marks decoration */}
        <div className="absolute top-16 left-8 text-[140px] font-serif text-[#16956C]/5 leading-none">
          "
        </div>
        <div className="absolute bottom-16 right-8 text-[140px] font-serif text-[#16956C]/5 leading-none transform rotate-180">
          "
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 bg-[#16956C]/10 text-[#16956C] rounded-full text-sm font-medium mb-4"
            >
              SUCCESS STORIES
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
            >
              Students Achieving Their Goals
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Hear from students who've improved their exam performance with
              Pace App's personalized practice sessions.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {/* Featured testimonial */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-6 bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden border border-gray-100"
            >
              <div className="absolute top-0 right-0 h-32 w-32 bg-[#16956C]/5 rounded-full -translate-x-10 -translate-y-10"></div>
              <QuoteIcon />
              <div className="relative">
                <div className="mb-6">
                  <div className="flex space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 italic text-lg leading-relaxed">
                    "I struggled with Chemistry for months. After using Pace App
                    for just 3 weeks, I scored 280 in my UTME! The timed
                    practice sessions prepared me perfectly for the real exam
                    pressure."
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#16956C] to-[#1D7A8C] p-1">
                      <div className="w-full h-full rounded-full bg-white p-1">
                        <img
                          src="/images/aj.jpg"
                          alt="Aisha Bello"
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) =>
                            (e.target.src = "/images/default-avatar.png")
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Aisha Bello</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-[#16956C] font-medium">
                        UTME Candidate
                      </span>
                      <span className="bg-[#16956C]/10 text-[#16956C] text-xs font-medium px-2 py-1 rounded-full">
                        Scored 280/400
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Smaller testimonials */}
            <div className="md:col-span-6 grid grid-cols-1 md:grid-rows-2 gap-6 md:gap-8">
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden border border-gray-100"
              >
                <QuoteIcon />
                <div className="relative">
                  <div className="mb-4">
                    <div className="flex space-x-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 italic text-base leading-relaxed">
                      "Being able to practice specific Physics topics I
                      struggled with made all the difference. Went from a D to a
                      B in my WAEC!"
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#1D7A8C] to-[#16956C] p-1">
                        <div className="w-full h-full rounded-full bg-white p-1">
                          <img
                            src="/images/aj.jpg"
                            alt="Chinedu Okafor"
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) =>
                              (e.target.src = "/images/default-avatar.png")
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        Chinedu Okafor
                      </h4>
                      <span className="text-[#16956C] text-sm font-medium">
                        WAEC Student
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden border border-gray-100"
              >
                <QuoteIcon />
                <div className="relative">
                  <div className="mb-4">
                    <div className="flex space-x-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 italic text-base leading-relaxed">
                      "I love the flexibility! I practiced during commutes and
                      breaks. Seeing my progress improve over time kept me
                      motivated for NECO."
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#16956C] to-[#1D7A8C] p-1">
                        <div className="w-full h-full rounded-full bg-white p-1">
                          <img
                            src="/images/aj.jpg"
                            alt="Fatima Sadiq"
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) =>
                              (e.target.src = "/images/default-avatar.png")
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Fatima Sadiq</h4>
                      <span className="text-[#16956C] text-sm font-medium">
                        NECO Candidate
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Additional testimonial row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
            {[
              {
                name: "Daniel Mensah",
                role: "UTME Student",
                quote:
                  "The detailed explanations after each question helped me understand concepts, not just memorize answers.",
                highlight: "Mathematics Expert",
              },
              {
                name: "Grace Taiwo",
                role: "WAEC Candidate",
                quote:
                  "I improved my English Literature score dramatically after using the topic-specific practice sessions.",
                highlight: "Top 5% in English",
              },
              {
                name: "Samuel Obi",
                role: "NECO Student",
                quote:
                  "The ability to compete with friends in the same subjects motivated me to practice more frequently.",
                highlight: "Weekly Champion",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 relative border border-gray-100"
              >
                <div className="absolute top-0 right-0 -mt-2 -mr-2">
                  <div className="bg-[#16956C] text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                    {testimonial.highlight}
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#16956C]/10 flex items-center justify-center mr-3 text-[#16956C]">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-[#16956C]">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </div>

          {/* Testimonial CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to={appUrl}
              className="inline-flex items-center text-[#16956C] font-semibold hover:text-[#138055] transition-colors"
            >
              Join these success stories
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* --- FAQ Section --- */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute right-0 top-0 w-1/3 h-64 bg-gradient-to-b from-[#16956C]/5 to-transparent rounded-bl-full"></div>
        <div className="absolute left-0 bottom-0 w-1/3 h-64 bg-gradient-to-t from-[#1D7A8C]/5 to-transparent rounded-tr-full"></div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 bg-[#16956C]/10 text-[#16956C] rounded-full text-sm font-medium mb-4"
            >
              GOT QUESTIONS?
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Everything you need to know about Pace App and how it can help you
              ace your exams.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="space-y-6">
              {faqs.slice(0, Math.ceil(faqs.length / 2)).map((faq, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  className="bg-gray-50/80 border border-gray-200/80 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center p-5 text-left font-semibold text-gray-700 hover:bg-gray-100/50 transition-colors"
                  >
                    <span className="pr-8">{faq.q}</span>
                    <div className="flex-shrink-0 bg-white rounded-full p-2 shadow-sm">
                      <motion.div
                        animate={{
                          rotate: openFAQ === index ? 180 : 0,
                          backgroundColor:
                            openFAQ === index ? "#16956C" : "white",
                        }}
                        className="bg-white rounded-full"
                      >
                        <svg
                          className={`w-4 h-4 ${
                            openFAQ === index ? "text-white" : "text-gray-500"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  </button>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: openFAQ === index ? "auto" : 0,
                      opacity: openFAQ === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 text-gray-600 text-base leading-relaxed border-t border-gray-100">
                      {faq.a}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-6">
              {faqs.slice(Math.ceil(faqs.length / 2)).map((faq, index) => {
                const actualIndex = index + Math.ceil(faqs.length / 2);
                return (
                  <motion.div
                    key={actualIndex}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    className="bg-gray-50/80 border border-gray-200/80 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <button
                      onClick={() => toggleFAQ(actualIndex)}
                      className="w-full flex justify-between items-center p-5 text-left font-semibold text-gray-700 hover:bg-gray-100/50 transition-colors"
                    >
                      <span className="pr-8">{faq.q}</span>
                      <div className="flex-shrink-0 bg-white rounded-full p-2 shadow-sm">
                        <motion.div
                          animate={{
                            rotate: openFAQ === actualIndex ? 180 : 0,
                            backgroundColor:
                              openFAQ === actualIndex ? "#16956C" : "white",
                          }}
                          className="bg-white rounded-full"
                        >
                          <svg
                            className={`w-4 h-4 ${
                              openFAQ === actualIndex
                                ? "text-white"
                                : "text-gray-500"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </motion.div>
                      </div>
                    </button>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: openFAQ === actualIndex ? "auto" : 0,
                        opacity: openFAQ === actualIndex ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 text-gray-600 text-base leading-relaxed border-t border-gray-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Still have questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 text-center bg-gradient-to-r from-[#16956C]/10 to-[#1D7A8C]/10 rounded-xl p-8 shadow-sm"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Can't find the answer you're looking for? Please reach out to our
              friendly team.
            </p>
            <Link
              to={appUrl}
              className="inline-flex items-center justify-center bg-white px-5 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg
                className="w-5 h-5 mr-2 text-[#16956C]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Contact Support
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* --- Call to Action Section --- */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-[#E7F7F2] text-center relative overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full">
            <svg
              viewBox="0 0 1440 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full opacity-5"
            >
              <path
                d="M0,160L48,144C96,128,192,96,288,85.3C384,75,480,85,576,117.3C672,149,768,203,864,208C960,213,1056,171,1152,154.7C1248,139,1344,149,1392,154.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                fill="#16956C"
              />
            </svg>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full rotate-180">
            <svg
              viewBox="0 0 1440 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full opacity-5"
            >
              <path
                d="M0,160L48,144C96,128,192,96,288,85.3C384,75,480,85,576,117.3C672,149,768,203,864,208C960,213,1056,171,1152,154.7C1248,139,1344,149,1392,154.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                fill="#1D7A8C"
              />
            </svg>
          </div>
        </div>

        <div className="container mx-auto max-w-3xl relative z-10">
          {/* Small decorative elements */}
          <div className="absolute -left-10 top-10 w-20 h-20 bg-[#16956C]/10 rounded-full blur-xl"></div>
          <div className="absolute -right-10 bottom-10 w-20 h-20 bg-[#1D7A8C]/10 rounded-full blur-xl"></div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10"
          >
            <div className="inline-block bg-[#16956C]/10 px-4 py-1 rounded-full mb-6">
              <span className="text-[#16956C] font-semibold text-sm">
                READY TO EXCEL?
              </span>
            </div>

            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                delay: 0.1,
              }}
              className="text-3xl sm:text-4xl font-bold text-gray-800 mb-5 leading-tight"
            >
              Start Your Exam Success Journey Today
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg text-gray-600 mb-8"
            >
              Join thousands of students improving their scores with
              personalized practice, real-time feedback, and comprehensive topic
              coverage.
            </motion.p>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              className="sm:flex items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link
                to={appUrl}
                className="block sm:inline-block bg-[#16956C] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-[#138055] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto text-center"
              >
                Create Free Account
              </Link>

              <Link
                to="/auth/signin"
                className="block sm:inline-block bg-white text-gray-700 border border-gray-300 px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto text-center"
              >
                Sign In
              </Link>
            </motion.div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-[#16956C] mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>100% Secure & Private</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-[#16956C] mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Quick 30-Second Setup</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-[#16956C] mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <span>Cancel Anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* --- Footer --- */}
      <footer className="bg-gray-900 text-gray-400 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -right-10 -top-16 w-64 h-64 bg-[#16956C] rounded-full filter blur-3xl"></div>
          <div className="absolute -left-10 -bottom-16 w-64 h-64 bg-[#1D7A8C] rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            {/* Logo and description */}
            <div className="md:col-span-5">
              <div className="text-2xl font-bold text-white mb-4">Pace App</div>
              <p className="text-gray-400 mb-6 max-w-sm">
                The ultimate exam preparation platform designed to help students
                master their exams with confidence and ease.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-[#16956C] hover:text-white transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-[#16956C] hover:text-white transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-[#16956C] hover:text-white transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-[#16956C] hover:text-white transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div className="md:col-span-7">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-white font-semibold mb-4">App</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to={appUrl}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Get Started
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/auth/signin"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/practice"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Practice Questions
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/leaderboard"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Leaderboard
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4">Resources</h3>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Study Tips
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Blog
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Tutorials
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Help Center
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4">Legal</h3>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Terms of Service
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Cookie Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Pace App. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm">
              <a
                href="#"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <Link
          to={appUrl}
          className="bg-[#16956C] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-[#138055] hover:scale-110 transition-all duration-300"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
};

export default LandingPage;
