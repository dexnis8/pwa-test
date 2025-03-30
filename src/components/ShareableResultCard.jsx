import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectPersonalInfo } from "../redux/slices/profileSlice";
import html2canvas from "html2canvas";

const ShareableResultCard = ({
  score,
  totalQuestions,
  subject,
  examType,
  mode,
  onImageGenerated,
  isVisible,
}) => {
  const cardRef = useRef(null);
  const personalInfo = useSelector(selectPersonalInfo);
  const username = personalInfo?.name || "Student";
  const [attempts, setAttempts] = useState(0);

  // Generate shareable image when component becomes visible
  useEffect(() => {
    if (isVisible && cardRef.current) {
      // Increase the timer to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        console.log("Attempting to generate image...");
        html2canvas(cardRef.current, {
          scale: 2, // Higher quality
          backgroundColor: null,
          logging: true, // Enable logging for debugging
          useCORS: true, // Try with CORS enabled
          allowTaint: true, // Allow tainted canvas
        })
          .then((canvas) => {
            console.log("Image generation successful");
            const imageData = canvas.toDataURL("image/png");
            onImageGenerated(imageData);
          })
          .catch((error) => {
            console.error("Error generating image:", error);

            // Try again if failed (up to 3 attempts)
            if (attempts < 3) {
              setAttempts(attempts + 1);
            } else {
              // Create a fallback image with fixed text
              const fallbackCanvas = document.createElement("canvas");
              fallbackCanvas.width = 600;
              fallbackCanvas.height = 380;
              const ctx = fallbackCanvas.getContext("2d");

              // Draw background
              ctx.fillStyle = "#16956C";
              ctx.fillRect(0, 0, 600, 380);

              // Draw text
              ctx.fillStyle = "white";
              ctx.font = "bold 24px Arial";
              ctx.textAlign = "center";
              ctx.fillText(`${subject.toUpperCase()} Practice Result`, 300, 80);

              ctx.font = "bold 48px Arial";
              ctx.fillText(`${score}/${totalQuestions}`, 300, 180);

              ctx.font = "16px Arial";
              ctx.fillText(`by ${username}`, 300, 220);

              ctx.font = "18px Arial";
              ctx.fillText("eduprep.app/register", 300, 320);

              const fallbackImageData = fallbackCanvas.toDataURL("image/png");
              onImageGenerated(fallbackImageData);
            }
          });
      }, 500); // Increased from 100ms to 500ms

      return () => clearTimeout(timer);
    }
  }, [
    isVisible,
    onImageGenerated,
    attempts,
    score,
    totalQuestions,
    subject,
    username,
  ]);

  const percentage = Math.round((score / totalQuestions) * 100);

  // This component should be clearly visible to ensure proper rendering
  return (
    <div
      ref={cardRef}
      className={`fixed left-0 top-0 z-[-1] ${isVisible ? "block" : "hidden"}`}
      style={{ width: "600px" }}
    >
      {/* Card container with fixed dimensions */}
      <div
        className="bg-gradient-to-br from-[#16956C] to-[#0D7353] p-8 rounded-lg text-white shadow-lg"
        style={{ width: "600px", height: "380px" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
              <span className="text-[#16956C] text-2xl font-bold">E</span>
            </div>
            <h1 className="text-2xl font-bold ml-3">EduPrep</h1>
          </div>
          <div className="bg-white/20 rounded-full px-4 py-1 text-sm">
            {examType} · {mode === "time-based" ? "Timed" : "Practice"}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold capitalize mb-2">
          {subject} Practice Result
        </h2>
        <p className="text-white/80 mb-6">by {username}</p>

        {/* Score */}
        <div className="flex mb-8">
          <div className="mr-8">
            <div className="bg-white text-[#16956C] text-4xl font-bold rounded-xl w-24 h-24 flex items-center justify-center">
              {percentage}%
            </div>
          </div>
          <div>
            <div className="mb-2">
              <p className="text-sm text-white/70">Score</p>
              <p className="text-2xl font-bold">
                {score}/{totalQuestions} correct
              </p>
            </div>
            <div>
              <p className="text-sm text-white/70">Completed on</p>
              <p className="text-lg">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-white/10 rounded-lg p-4 flex justify-between items-center">
          <p className="text-lg font-medium">Try your own practice session!</p>
          <div className="bg-white text-[#16956C] font-bold px-4 py-2 rounded-lg">
            eduprep.app/register
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareableResultCard;
