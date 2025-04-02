/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ShareableResultCard from "../components/ShareableResultCard";

const PracticeResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    score,
    totalQuestions,
    subject,
    examType,
    mode,
    // timeLeft,
    timeLimit,
  } = location.state || {};

  const [shareCardVisible, setShareCardVisible] = React.useState(false);
  const [shareableImage, setShareableImage] = React.useState(null);
  const [showShareOptions, setShowShareOptions] = React.useState(false);

  // Calculate percentage score and feedback
  const percentage = Math.round((score / totalQuestions) * 100);
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

  // Handler for the share button click
  const handleShareClick = () => {
    setShareableImage(null); // Reset the image first
    setShareCardVisible(true);

    // Show share options with or without image after a short delay
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
          ctx.fillText(`${score}/${totalQuestions}`, 300, 200);

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
    const message = `Just completed a ${subject} practice on Pace App with a score of ${score}/${totalQuestions}! Join me and improve your exam prep: https://pwa-test-vert-xi.vercel.app/`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareToTwitter = () => {
    const message = `I scored ${score}/${totalQuestions} in ${subject} practice on Pace App! Join my journey to exam success: https://pwa-test-vert-xi.vercel.app/`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const shareToFacebook = () => {
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
      if (shareableImage) {
        window.open(shareableImage, "_blank");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D7353] to-[#16956C] flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-white opacity-5"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-white opacity-5"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 rounded-full bg-white opacity-5"></div>

        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[#1DA975] opacity-20 blur-xl"></div>
        <div className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-[#1DA975] opacity-20 blur-xl"></div>
      </div>

      {/* Decorative stars */}
      <div className="absolute top-1/4 left-1/5">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="white"
          opacity="0.7"
        >
          <path d="M12 2L14.4 8.2H21L15.6 12.6L17.8 19L12 15L6.2 19L8.4 12.6L3 8.2H9.6L12 2Z" />
        </svg>
      </div>
      <div className="absolute bottom-1/3 right-1/5">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="white"
          opacity="0.7"
        >
          <path d="M12 2L14.4 8.2H21L15.6 12.6L17.8 19L12 15L6.2 19L8.4 12.6L3 8.2H9.6L12 2Z" />
        </svg>
      </div>
      <div className="absolute top-1/3 right-1/6">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="white"
          opacity="0.7"
        >
          <path d="M12 2L14.4 8.2H21L15.6 12.6L17.8 19L12 15L6.2 19L8.4 12.6L3 8.2H9.6L12 2Z" />
        </svg>
      </div>

      {/* Content card with white semi-transparent background */}
      <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-3xl shadow-xl max-w-md w-full p-8 border border-white/20">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-3 bg-white/20 rounded-full px-4 py-1 text-sm font-medium">
            {examType} • {mode === "time-based" ? "Timed" : "Practice"}
          </div>
          <h1 className="text-4xl font-bold mb-2 text-white">{heading}</h1>
          <p className="text-xl text-white/80">{feedback}</p>
        </div>

        {/* Score Display */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-white/70 mb-1">Your Score</p>
              <p className="text-3xl font-bold">
                {score}/{totalQuestions}
              </p>
              <p className="text-sm text-white/70 mt-2">Correct Answers</p>
            </div>

            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <div className="text-2xl font-bold">{percentage}%</div>
            </div>
          </div>
        </div>

        {/* Coins Earned */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-5 mb-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-400 bg-opacity-20 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <span className="text-xs text-white/70">REWARDS</span>
              <p className="font-medium">Points Earned</p>
            </div>
          </div>
          <span className="text-2xl font-bold">{coinsEarned}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Play Again Button */}
          <button
            onClick={() => {
              // Reset the session and navigate back to practice session
              navigate("/practice/session", {
                state: {
                  mode,
                  subject,
                  topic: "random",
                  examType,
                  questionCount: totalQuestions,
                  timeLimit,
                },
              });
            }}
            className="w-full py-4 bg-white text-[#16956C] rounded-xl font-semibold transition-all hover:bg-gray-100 active:scale-[0.98] flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 2v4h-4" />
              <path d="M3 11c0-4.97 4.03-9 9-9 2.39 0 4.68.94 6.4 2.6l2.6 2.4" />
              <path d="M7 22v-4h4" />
              <path d="M21 13c0 4.97-4.03 9-9 9-2.39 0-4.68-.94-6.4-2.6l-2.6-2.4" />
            </svg>
            PLAY AGAIN
          </button>

          {/* Share Button */}
          <button
            onClick={handleShareClick}
            className="w-full py-4 bg-[#0A5E44] text-white rounded-xl font-semibold hover:bg-[#07432F] transition-all active:scale-[0.98] flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
            </svg>
            SHARE RESULT
          </button>

          {/* Back to Dashboard */}
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-4 border border-white/40 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
          >
            RETURN TO DASHBOARD
          </button>
        </div>
      </div>

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
                        const a = document.createElement("a");
                        a.href = shareableImage;
                        a.download = `paceapp-result-${subject}-${score}-of-${totalQuestions}.png`;
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
        totalQuestions={totalQuestions}
        subject={subject}
        examType={examType}
        mode={mode}
        onImageGenerated={handleImageGenerated}
        isVisible={shareCardVisible}
      />
    </div>
  );
};

export default PracticeResult;
