import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ShareableResultCard from "../components/ShareableResultCard";

const PracticeResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareableImage, setShareableImage] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const {
    score,
    totalQuestions,
    subject,
    examType,
    mode,
    timeLeft,
    timeLimit,
  } = location.state || {};

  const percentage = Math.round((score / totalQuestions) * 100);
  const feedback = getFeedback(percentage);

  function getFeedback(score) {
    if (score >= 90) {
      return {
        message: "Excellent! You're a genius!",
        color: "text-green-500",
        icon: "🌟",
      };
    } else if (score >= 70) {
      return {
        message: "Great job! Keep it up!",
        color: "text-blue-500",
        icon: "👏",
      };
    } else if (score >= 50) {
      return {
        message: "Not bad! Practice more!",
        color: "text-yellow-500",
        icon: "💪",
      };
    } else {
      return {
        message: "Keep practicing! You can do better!",
        color: "text-red-500",
        icon: "📚",
      };
    }
  }

  const handleShare = () => {
    setShowShareCard(true);
  };

  const handlePlayAgain = () => {
    // Reconstruct the query parameters
    const queryParams = new URLSearchParams({
      mode: mode || "practice",
      subject: subject || "english",
      topic: "random",
      examType: examType || "UTME",
      questionCount: totalQuestions || "10",
      timeLimit: timeLimit || "10",
    });

    navigate(`/practice?${queryParams.toString()}`);
  };

  const handleShareOptions = () => {
    setShowShareOptions(true);
  };

  const handleShareToWhatsApp = () => {
    const text = `I scored ${percentage}% in my ${subject} practice quiz! Can you beat my score?`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareToTwitter = () => {
    const text = `I scored ${percentage}% in my ${subject} practice quiz! Can you beat my score?`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleShareToFacebook = () => {
    const text = `I scored ${percentage}% in my ${subject} practice quiz! Can you beat my score?`;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.href
      )}&quote=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleCopyImage = () => {
    if (shareableImage) {
      navigator.clipboard.writeText(shareableImage);
      toast.success("Image copied to clipboard!");
    }
  };

  const handleSaveImage = () => {
    if (shareableImage) {
      const link = document.createElement("a");
      link.href = shareableImage;
      link.download = "quiz-result.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-[#16956C] rounded-b-[32px]"></div>
      <div className="absolute top-0 left-0 w-full h-32 bg-[#1D7A8C] rounded-b-[32px] opacity-50"></div>

      {/* Main content */}
      <div className="relative px-4 py-8">
        {/* Score display */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#16956C] mb-2">
              {percentage}%
            </div>
            <div className={`text-xl font-semibold ${feedback.color} mb-4`}>
              {feedback.icon} {feedback.message}
            </div>
            <div className="text-gray-600">
              You got {score} out of {totalQuestions} questions correct
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <button
            onClick={handlePlayAgain}
            className="w-full py-3 bg-[#16956C] text-white rounded-full font-medium hover:bg-[#138055] transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={handleShareOptions}
            className="w-full py-3 bg-white text-[#16956C] border-2 border-[#16956C] rounded-full font-medium hover:bg-gray-50 transition-colors"
          >
            Share Result
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Share options modal */}
      <AnimatePresence>
        {showShareOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-xs"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold text-center mb-4">
                  Share Result
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={handleShareToWhatsApp}
                    className="w-full py-2 px-4 bg-[#25D366] text-white rounded-lg font-medium hover:bg-[#128C7E] transition-colors"
                  >
                    Share on WhatsApp
                  </button>
                  <button
                    onClick={handleShareToTwitter}
                    className="w-full py-2 px-4 bg-[#1DA1F2] text-white rounded-lg font-medium hover:bg-[#1A91DA] transition-colors"
                  >
                    Share on Twitter
                  </button>
                  <button
                    onClick={handleShareToFacebook}
                    className="w-full py-2 px-4 bg-[#4267B2] text-white rounded-lg font-medium hover:bg-[#365899] transition-colors"
                  >
                    Share on Facebook
                  </button>
                  <button
                    onClick={handleCopyImage}
                    className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Copy Image
                  </button>
                  <button
                    onClick={handleSaveImage}
                    className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Save Image
                  </button>
                </div>
                <button
                  onClick={() => setShowShareOptions(false)}
                  className="w-full mt-4 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shareable result card */}
      {showShareCard && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
            <ShareableResultCard
              score={score}
              totalQuestions={totalQuestions}
              percentage={percentage}
              subject={subject}
              examType={examType}
              onImageGenerated={setShareableImage}
            />
            <button
              onClick={() => setShowShareCard(false)}
              className="w-full mt-4 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeResult;
