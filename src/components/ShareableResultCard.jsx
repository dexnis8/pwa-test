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
  const username = personalInfo?.name || "Me";
  const [attempts, setAttempts] = useState(0);

  // Calculate performance metrics
  const percentage = Math.round((score / totalQuestions) * 100);
  const performanceLevel =
    percentage >= 90
      ? "OUTSTANDING"
      : percentage >= 75
      ? "EXCELLENT"
      : percentage >= 60
      ? "GOOD"
      : percentage >= 40
      ? "FAIR"
      : "NEEDS PRACTICE";

  // Generate shareable image when component becomes visible
  useEffect(() => {
    if (isVisible && cardRef.current) {
      // Increase the timer to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        console.log("Attempting to generate image...");
        html2canvas(cardRef.current, {
          scale: 3, // Higher quality
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

              // Create background
              ctx.fillStyle = "#F5F5DC"; // Light beige background
              ctx.fillRect(0, 0, 600, 380);

              // Add diagonal green section
              ctx.beginPath();
              ctx.moveTo(0, 150);
              ctx.lineTo(0, 380);
              ctx.lineTo(200, 380);
              ctx.closePath();
              ctx.fillStyle = "#16956C";
              ctx.fill();

              // Add diagonal blue section
              ctx.beginPath();
              ctx.moveTo(600, 0);
              ctx.lineTo(600, 230);
              ctx.lineTo(430, 0);
              ctx.closePath();
              ctx.fillStyle = "#1A4B8C";
              ctx.fill();

              // // Draw logo (simplified version for canvas)
              // ctx.fillStyle = "#16956C";
              // ctx.beginPath();
              // ctx.arc(50, 50, 20, 0, Math.PI * 2);
              // ctx.fill();

              // // Draw Q in the logo
              // ctx.fillStyle = "white";
              // ctx.font = "bold 22px Arial";
              // ctx.textAlign = "center";
              // ctx.fillText("Q", 50, 57);

              // Draw app name
              ctx.fillStyle = "#16956C";
              ctx.font = "bold 18px Arial";
              ctx.textAlign = "left";
              ctx.fillText("The Pace App", 30, 55);

              // Draw text
              ctx.fillStyle = "#1A4B8C"; // Blue text
              ctx.font = "bold 24px Arial";
              ctx.textAlign = "center";
              ctx.fillText("You scored", 300, 70);

              // Draw percentage
              ctx.font = "bold 80px Arial";
              ctx.fillText(`${percentage}%`, 300, 150);

              // Draw performance level
              ctx.fillStyle = "#FFD700"; // Gold color
              ctx.font = "bold 36px Arial";
              ctx.fillText(performanceLevel, 300, 200);

              // Draw subject and score
              ctx.fillStyle = "#333";
              ctx.font = "16px Arial";
              ctx.fillText(
                `${subject.toUpperCase()} ${examType} · ${
                  mode === "time-based" ? "Timed" : "Practice"
                } · ${score}/${totalQuestions} correct answers`,
                300,
                240
              );

              ctx.font = "bold 14px Arial";
              ctx.fillText(
                `by ${username} - ${new Date().toLocaleDateString()}`,
                300,
                270
              );

              // Draw CTA text
              ctx.fillStyle = "#333";
              ctx.font = "12px Arial";
              ctx.fillText(
                "Keep practicing to improve your scores and master your subjects.",
                300,
                320
              );

              // Draw CTA button
              ctx.fillStyle = "#1A4B8C";
              ctx.fillRect(150, 330, 295, 35);
              ctx.fillStyle = "white";
              ctx.font = "bold 14px Arial";
              ctx.fillText("Practice Now @ https://thepaceapp.ng", 300, 353);

              // App name
              ctx.fillStyle = "#16956C";
              ctx.font = "bold 12px Arial";
              ctx.fillText("#icandobetter", 500, 365);

              const fallbackImageData = fallbackCanvas.toDataURL("image/png");
              onImageGenerated(fallbackImageData);
            }
          });
      }, 500);

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
    percentage,
    performanceLevel,
    examType,
    mode,
  ]);

  return (
    <div
      ref={cardRef}
      className={`fixed left-0 top-0 z-[-1] ${isVisible ? "block" : "hidden"}`}
      style={{ width: "600px" }}
    >
      {/* Card container with fixed dimensions */}
      <div
        className="overflow-hidden"
        style={{
          width: "600px",
          height: "380px",
          position: "relative",
          backgroundColor: "#F5F5DC",
        }}
      >
        {/* Diagonal shapes for visual interest */}
        <div
          className="absolute left-0 bottom-0"
          style={{
            width: "200px",
            height: "230px",
            backgroundColor: "#16956C",
            clipPath: "polygon(0 40%, 0% 100%, 100% 100%)",
          }}
        ></div>

        <div
          className="absolute top-0 right-0"
          style={{
            width: "200px",
            height: "230px",
            backgroundColor: "#1A4B8C",
            clipPath: "polygon(30% 0, 100% 0, 100% 100%)",
          }}
        ></div>

        {/* Calculator icon (simulated) */}
        <div
          className="absolute left-16 bottom-24 w-20 h-20 rounded-lg bg-[#1A4B8C] flex items-center justify-center"
          style={{ transform: "rotate(-10deg)" }}
        >
          <div className="text-white text-xs font-bold">100%</div>
          <div className="absolute inset-0 flex flex-wrap content-end p-1">
            <div className="w-3 h-2 bg-white/50 m-0.5 rounded-sm"></div>
            <div className="w-3 h-2 bg-white/50 m-0.5 rounded-sm"></div>
            <div className="w-3 h-2 bg-white/50 m-0.5 rounded-sm"></div>
            <div className="w-3 h-2 bg-white/50 m-0.5 rounded-sm"></div>
          </div>
        </div>

        {/* Book icon (simulated) */}
        <div
          className="absolute left-40 bottom-20 w-16 h-20 bg-[#FFD700]"
          style={{ transform: "rotate(15deg)" }}
        ></div>
        <div
          className="absolute left-38 bottom-19 w-14 h-22 bg-[#2ECDA0]"
          style={{ transform: "rotate(5deg)" }}
        ></div>

        {/* Computer mouse */}
        <div className="absolute right-12 top-24 w-16 h-24 bg-[#1A4B8C] rounded-t-2xl">
          <div className="absolute inset-0 top-5 bg-white/30 rounded-t-2xl"></div>
          <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-white/50"></div>
        </div>

        {/* Content container */}
        <div className="relative z-10 text-center p-8 h-full flex flex-col items-center">
          {/* Logo and App Name */}
          <div className="absolute top-6 left-6 flex items-center">
            <div className="w-10 h-10 bg-[#16956C] rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">?</span>
            </div>
            <h1 className="text-[#1A4B8C] text-lg font-bold ml-2">
              The Pace App
            </h1>
          </div>

          {/* Header text */}
          <h2 className="text-[#1A4B8C] text-2xl font-semibold mt-6">
            You scored
          </h2>

          {/* Large percentage */}
          <div className="text-[#1A4B8C] text-8xl font-bold mb-2">
            {percentage}%
          </div>

          {/* Performance level */}
          <div className="text-[#FFD700] text-4xl font-bold mb-4 tracking-wide">
            {performanceLevel}
          </div>

          {/* Subject and score details */}
          <p className="text-gray-700 mb-1 max-w-md">
            {subject.toUpperCase()} {examType} ·{" "}
            {mode === "time-based" ? "Timed" : "Practice"} · {score}/
            {totalQuestions} correct answers
          </p>
          <p className="text-gray-600 text-sm font-medium mb-6">
            by {username} · {new Date().toLocaleDateString()}
          </p>

          {/* Hashtag */}
          <div className="absolute right-8 bottom-4 text-[#16956C] text-xs font-bold">
            #icandobetter
          </div>

          {/* Message */}
          <p className="text-gray-600 text-sm max-w-md mt-auto mb-4">
            Keep practicing to improve your scores and master your subjects.
            Consistency is key to success!
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 w-full max-w-md justify-center">
            <div className="border border-[#1A4B8C] text-[#1A4B8C] rounded px-6 py-2 text-sm font-bold">
              Share on Facebook
            </div>
            <div className="bg-[#1A4B8C] text-white rounded px-6 py-2 text-sm font-bold whitespace-nowrap">
              Practice Now @ thepaceapp.ng
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareableResultCard;
