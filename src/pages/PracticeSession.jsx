/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ShareableResultCard from "../components/ShareableResultCard";
import QuitConfirmationModal from "../components/QuitConfirmationModal";
import ReportIssueModal from "../components/ReportIssueModal";
import { useQuestions, useReportIssue } from "../hooks/api/useFeatures";
import { BeatLoader } from "react-spinners";
import { showToast } from "../lib/toast";
import DOMPurify from "dompurify";

// Custom hook to get query parameters
const useQuery = () => {
  return new URLSearchParams(window.location.search);
};

// Create skeleton loaders for different components
const Skeleton = ({ className, ...props }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    {...props}
  />
);

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
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const [timerActive, setTimerActive] = useState(mode === "time-based");
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [shareCardVisible, setShareCardVisible] = useState(false);
  const [shareableImage, setShareableImage] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const { fetchQuestions, isLoading, error } = useQuestions();
  const reportIssueMutation = useReportIssue();

  // Load questions from API
  useEffect(() => {
    const loadQuestions = async () => {
      const data = await fetchQuestions({
        mode,
        subject,
        examType,
        topic,
        questionCount,
      });

      if (data) {
        setQuestions(data.questions);
      } else {
        navigate("/dashboard");
      }
    };

    loadQuestions();
  }, []);

  // Handle page refresh/leave
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!quizCompleted) {
        e.preventDefault();
        e.returnValue = "";
        setShowQuitModal(true);
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [quizCompleted]);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      setQuizCompleted(true);
      setTimerActive(false);
      navigateToResult();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleAnswerSelect = (option) => {
    if (showFeedback) return;

    setSelectedAnswer(option);
    setShowFeedback(true);

    const currentQuestion = questions[currentIndex];
    const correct = option.isCorrect;
    setIsCorrect(correct);

    if (correct) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const navigateToResult = () => {
    // call the API for updating user's point here
    navigate("/practice/result", {
      state: {
        score,
        totalQuestions: questions.length,
        subject,
        examType,
        mode,
        timeLeft,
        timeLimit,
        queryParams: {
          mode,
          subject,
          topic,
          examType,
          questionCount,
          timeLimit,
        },
      },
    });
  };

  const handleEndPractice = () => {
    if (quizCompleted) {
      navigateToResult();
    } else {
      setShowQuitModal(true);
    }
  };

  const handleQuitConfirm = () => {
    setShowQuitModal(false);
    navigate("/dashboard");
  };

  const handleReportIssue = (reportData) => {
    reportIssueMutation.mutate(reportData, {
      onSuccess: () => {
        setShowReportModal(false);
      },
    });
  };

  // Handler for the share button click
  const handleShareClick = () => {
    setShareableImage(null); // Reset the image first
    setShareCardVisible(true);

    // Show share options with or without image after a short delay
    // This ensures the modal appears even if image generation is slow
    setTimeout(() => {
      setShowShareOptions(true);

      // Set a timeout to create a fallback image if generation takes too long
      const fallbackTimer = setTimeout(() => {
        if (!shareableImage) {
          console.log("Image generation taking too long, creating fallback");

          // Create simple fallback canvas
          const canvas = document.createElement("canvas");
          canvas.width = 600;
          canvas.height = 380;
          const ctx = canvas.getContext("2d");

          // Draw green background
          ctx.fillStyle = "#16956C";
          ctx.fillRect(0, 0, 600, 380);

          // Draw text
          ctx.fillStyle = "white";
          ctx.font = "bold 28px Arial";
          ctx.textAlign = "center";
          ctx.fillText(`${subject.toUpperCase()} Practice Result`, 300, 100);

          ctx.font = "bold 64px Arial";
          ctx.fillText(`${score}/${questions.length}`, 300, 200);

          ctx.font = "20px Arial";
          ctx.fillText("https://pwa-test-vert-xi.vercel.app/", 300, 300);

          // Set the fallback image
          handleImageGenerated(canvas.toDataURL("image/png"));
        }
      }, 5000); // 5 second timeout for fallback

      return () => clearTimeout(fallbackTimer);
    }, 200);
  };

  // Handler for when the shareable image is generated
  const handleImageGenerated = (imageUrl) => {
    console.log("Image generated successfully");
    setShareableImage(imageUrl);
    setShareCardVisible(false);
  };

  // Sharing functions
  const shareToWhatsApp = () => {
    // WhatsApp can only share text links, not direct images
    const message = `Just completed a ${subject} practice on Pace App with a score of ${score}/${questions.length}! Join me and improve your exam prep: https://pwa-test-vert-xi.vercel.app/`;

    // Open WhatsApp with the message
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareToTwitter = () => {
    // Twitter/X can only share text and links, not direct images
    const message = `I scored ${score}/${questions.length} in ${subject} practice on Pace App! Join my journey to exam success: https://pwa-test-vert-xi.vercel.app/`;

    // Open Twitter with the message
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const shareToFacebook = () => {
    // For Facebook, we need to have an actual hosted URL
    // In a real app, this would be a dedicated sharing endpoint
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        "https://pwa-test-vert-xi.vercel.app/"
      )}`,
      "_blank"
    );
  };

  // Copy image to clipboard
  const copyImageToClipboard = async () => {
    try {
      if (shareableImage) {
        const response = await fetch(shareableImage);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        alert("Image copied to clipboard");
      }
    } catch (err) {
      console.error("Failed to copy image: ", err);
      // Fallback: open image in new tab
      if (shareableImage) {
        window.open(shareableImage, "_blank");
      }
    }
  };

  // Calculate percentage score and feedback
  const percentage = Math.round((score / questions.length) * 100);
  let heading = "Good Job!";
  let feedback = "Keep practicing to improve.";
  let coinsEarned = score;

  if (percentage >= 90) {
    heading = "Brilliant!";
    feedback = "You're mastering this subject!";
  } else if (percentage >= 70) {
    heading = "Great Work!";
    feedback = "You're doing really well!";
  } else if (percentage >= 50) {
    heading = "Good Effort!";
    feedback = "You're on the right track!";
  } else {
    heading = "Keep Going!";
    feedback = "Practice makes perfect!";
  }

  if (isLoading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header Skeleton */}
        <div className="bg-[#16956C] p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Skeleton className="h-7 w-24" />
          </div>
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>

        {/* Timer Skeleton - Only show for time-based mode */}
        {mode === "time-based" && (
          <div className="flex justify-center items-center py-4 bg-white">
            <Skeleton className="h-8 w-20" />
          </div>
        )}

        {/* Loading Message */}
        <div className="bg-white py-3 text-center border-b">
          <div className="flex items-center justify-center text-[#16956C] space-x-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm font-medium">
              Fetching your questions...
            </span>
          </div>
        </div>

        {/* Progress Skeleton */}
        <div className="bg-white px-4 py-2 border-b">
          <div className="flex justify-between items-center mb-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-1.5 w-full mt-2" />
        </div>

        {/* Question Skeleton */}
        <div className="p-5">
          <div className="bg-[#1D7A8C] text-white p-5 rounded-xl mb-4">
            <div className="text-center mb-4">
              <Skeleton className="h-32 w-full max-w-md mx-auto mb-4" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
            </div>
          </div>

          {/* Options Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Next Button Skeleton */}
        <div className="mt-auto p-5">
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-800 font-medium mb-2">
            Failed to load questions
          </p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-[#16956C] text-white rounded-lg hover:bg-[#138055]"
          >
            Return to Dashboard
          </button>
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
          onClick={handleEndPractice}
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
            {currentQuestion.examType} {currentQuestion.year}
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

      {/* Floating Report Issue Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setShowReportModal(true)}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
          title="Report Issue"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Report Issue
            <div className="absolute top-full right-3 w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
          </div>
        </button>
      </div>

      {/* Question */}
      <div className="p-5">
        <div className="bg-[#1D7A8C] text-white p-5 rounded-xl mb-4">
          <div className="text-center mb-4">
            {currentQuestion.images && currentQuestion.images.length > 0 && (
              <div className="mb-4 flex justify-center">
                <img
                  src={currentQuestion.images[0]}
                  alt="Question visual"
                  className="max-w-full rounded-lg max-h-48 object-contain bg-white p-2"
                />
              </div>
            )}
            <div
              className="text-center font-medium"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(currentQuestion.question),
              }}
            />
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full text-left p-4 rounded-lg border-2 flex items-center transition-colors ${
                selectedAnswer?.id === option.id
                  ? showFeedback
                    ? option.isCorrect
                      ? "bg-green-100 border-green-500 text-green-800"
                      : "bg-red-100 border-red-500 text-red-800"
                    : "bg-[#E7F7F2] border-[#16956C] text-[#16956C]"
                  : "bg-white border-gray-200 hover:border-[#16956C] hover:bg-gray-50"
              }`}
              disabled={showFeedback}
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center mr-3 font-medium">
                {String.fromCharCode(64 + option.id)}
              </span>
              <span
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(option.text),
                }}
              />
              {showFeedback && selectedAnswer?.id === option.id && (
                <span className="ml-auto">
                  {option.isCorrect ? (
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
                selectedAnswer?.id !== option.id &&
                option.isCorrect && (
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

        {/* Explanation Section - Appears after feedback */}
        <AnimatePresence>
          {showFeedback && currentQuestion.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800"
            >
              <h4 className="font-bold mb-2 text-blue-900">Explanation:</h4>
              <div
                className="text-sm leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(currentQuestion.explanation),
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
              navigateToResult();
            }
          }}
          disabled={!showFeedback}
          className={`w-full py-3 px-4 rounded-full font-medium transition-colors ${
            !showFeedback
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-[#16956C] text-white hover:bg-[#138055]"
          }`}
        >
          {currentIndex < questions.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </button>
      </div>

      {/* Quit Confirmation Modal */}
      <QuitConfirmationModal
        isOpen={showQuitModal}
        onClose={() => setShowQuitModal(false)}
        onConfirm={handleQuitConfirm}
      />

      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        questionId={currentQuestion?._id}
        onSubmit={handleReportIssue}
        isLoading={reportIssueMutation.isPending}
      />

      {/* Share Modal */}
      <AnimatePresence>
        {showShareOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-xs text-gray-800"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Share your result</h3>
                <button
                  onClick={() => setShowShareOptions(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

              {!shareableImage && (
                <div className="mb-6 py-8 flex flex-col items-center justify-center bg-gray-50 rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#16956C] mb-2"></div>
                  <p className="text-gray-500 text-sm mb-1">
                    Generating your shareable result card...
                  </p>
                  <p className="text-gray-400 text-xs">
                    This may take a few seconds
                  </p>
                  <button
                    onClick={() => {
                      // Create fallback image on demand
                      const canvas = document.createElement("canvas");
                      canvas.width = 600;
                      canvas.height = 380;
                      const ctx = canvas.getContext("2d");

                      // Draw background
                      ctx.fillStyle = "#16956C";
                      ctx.fillRect(0, 0, 600, 380);

                      // Draw text
                      ctx.fillStyle = "white";
                      ctx.font = "bold 28px Arial";
                      ctx.textAlign = "center";
                      ctx.fillText(
                        `${subject.toUpperCase()} Practice Result`,
                        300,
                        100
                      );

                      ctx.font = "bold 64px Arial";
                      ctx.fillText(`${score}/${questions.length}`, 300, 200);

                      ctx.font = "20px Arial";
                      ctx.fillText("paceapp.com/register", 300, 300);

                      handleImageGenerated(canvas.toDataURL("image/png"));
                    }}
                    className="mt-3 text-[#16956C] text-xs underline"
                  >
                    Generate simple image instead
                  </button>
                </div>
              )}

              {shareableImage && (
                <div className="mb-6 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={shareableImage}
                    alt="Your result card"
                    className="w-full h-auto"
                  />
                </div>
              )}

              <div className="mb-6">
                <h4 className="font-medium mb-3">Share to:</h4>
                <p className="text-gray-500 text-xs mb-2">
                  You can download the image above and share it along with the
                  auto-generated message
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={shareToWhatsApp}
                    className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100"
                  >
                    <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center mb-2">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                        <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375c-.99-1.576-1.516-3.391-1.516-5.26 0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.859 2.909 4.35 2.909 6.99-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
                      </svg>
                    </div>
                    <span className="text-sm">WhatsApp</span>
                  </button>

                  <button
                    onClick={shareToTwitter}
                    className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100"
                  >
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-2">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <span className="text-sm">Twitter/X</span>
                  </button>

                  <button
                    onClick={shareToFacebook}
                    className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100"
                  >
                    <div className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center mb-2">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                      </svg>
                    </div>
                    <span className="text-sm">Facebook</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <button
                    onClick={copyImageToClipboard}
                    className="flex-1 py-3 rounded-lg bg-gray-100 font-medium hover:bg-gray-200 flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                    </svg>
                    Copy
                  </button>
                  <button
                    onClick={() => {
                      if (shareableImage) {
                        // Create temporary link element
                        const a = document.createElement("a");
                        a.href = shareableImage;
                        a.download = `paceapp-result-${subject}-${score}-of-${questions.length}.png`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }
                    }}
                    className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 flex items-center justify-center"
                    disabled={!shareableImage}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Save
                  </button>
                </div>
                <button
                  onClick={() => setShowShareOptions(false)}
                  className="w-full py-3 rounded-lg bg-[#16956C] text-white font-medium hover:bg-[#138055] flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden component that generates the shareable card */}
      <ShareableResultCard
        score={score}
        totalQuestions={questions.length}
        subject={subject}
        examType={examType}
        mode={mode}
        onImageGenerated={handleImageGenerated}
        isVisible={shareCardVisible}
      />
    </div>
  );
};

export default PracticeSession;
