import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import html2canvas from "html2canvas";
import { selectPersonalInfo } from "../redux/slices/profileSlice";

const CARD_WIDTH = 1280;
const CARD_HEIGHT = 810;

const waitForPaint = () =>
  new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });

const formatSubject = (subject) =>
  subject
    ?.replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Practice";

const getPerformanceLabel = (percentage) => {
  if (percentage >= 90) return "OUTSTANDING";
  if (percentage >= 75) return "EXCELLENT";
  if (percentage >= 60) return "GOOD";
  if (percentage >= 40) return "FAIR";
  return "NEEDS PRACTICE";
};

const ShareableResultCard = ({
  score,
  totalQuestions,
  subject,
  examType,
  mode,
  onImageGenerated,
  onImageGenerationError,
  isVisible,
}) => {
  const cardRef = useRef(null);
  const personalInfo = useSelector(selectPersonalInfo);
  const username = personalInfo?.fullName?.split(" ")[0] || "Pace Learner";
  const percentage = totalQuestions
    ? Math.round((score / totalQuestions) * 100)
    : 0;
  const performance = getPerformanceLabel(percentage);
  const formattedDate = new Intl.DateTimeFormat("en-GB").format(new Date());

  useEffect(() => {
    if (!isVisible || !cardRef.current) return undefined;

    let cancelled = false;
    const captureCard = async () => {
      let lastError;

      try {
        await document.fonts?.ready;

        for (let attempt = 0; attempt < 3; attempt += 1) {
          try {
            await waitForPaint();
            const canvas = await html2canvas(cardRef.current, {
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              scale: 2,
              backgroundColor: "#F8F7D9",
              logging: false,
              useCORS: true,
              allowTaint: false,
              scrollX: 0,
              scrollY: 0,
            });

            if (!cancelled) {
              onImageGenerated(canvas.toDataURL("image/png"));
            }
            return;
          } catch (error) {
            lastError = error;
            await new Promise((resolve) => setTimeout(resolve, 250));
          }
        }

        throw lastError || new Error("Unable to create the result image.");
      } catch (error) {
        if (!cancelled) onImageGenerationError?.(error);
      }
    };

    const timer = setTimeout(captureCard, 50);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    isVisible,
    onImageGenerated,
    onImageGenerationError,
    score,
    totalQuestions,
    subject,
    examType,
    mode,
    username,
  ]);

  return (
    <div
      ref={cardRef}
      className={`fixed left-[-10000px] top-0 pointer-events-none ${
        isVisible ? "block" : "hidden"
      }`}
      style={{
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
        overflow: "hidden",
        backgroundColor: "#F8F7D9",
        color: "#1F1F1F",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <svg
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          viewBox={`0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`}
        >
          <polygon points="0,315 0,810 430,810" fill="#16956C" />
          <polygon points="915,0 1280,0 1280,495" fill="#1E4F8D" />
        </svg>

        <p
          style={{
            position: "absolute",
            top: "82px",
            left: "64px",
            margin: 0,
            color: "#16956C",
            fontSize: "38px",
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          The Pace App
        </p>

        <div
          style={{
            position: "absolute",
            top: "108px",
            left: "210px",
            width: "860px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#1E4F8D",
              fontSize: "50px",
              lineHeight: 1.1,
              fontWeight: 700,
            }}
          >
            You scored
          </p>
          <p
            style={{
              margin: "24px 0 0",
              color: "#1E4F8D",
              fontSize: "166px",
              lineHeight: 0.86,
              letterSpacing: "-0.07em",
              fontWeight: 800,
            }}
          >
            {percentage}%
          </p>
          <p
            style={{
              margin: "44px 0 0",
              color: "#FFCC00",
              fontSize: "62px",
              lineHeight: 1,
              letterSpacing: "0.01em",
              fontWeight: 800,
            }}
          >
            {performance}
          </p>
        </div>

        <p
          style={{
            position: "absolute",
            top: "487px",
            left: "150px",
            width: "980px",
            margin: 0,
            textAlign: "center",
            color: "#2F2F2F",
            fontSize: "31px",
            lineHeight: 1.2,
            fontWeight: 400,
          }}
        >
          {formatSubject(subject).toUpperCase()} {examType || "UTME"} ·{" "}
          {mode === "time-based" ? "Timed" : "Practice"} · {score}/{totalQuestions} correct answers
        </p>
        <p
          style={{
            position: "absolute",
            top: "558px",
            left: "200px",
            width: "880px",
            margin: 0,
            textAlign: "center",
            color: "#2F2F2F",
            fontSize: "29px",
            lineHeight: 1.2,
            fontWeight: 700,
          }}
        >
          by {username} - {formattedDate}
        </p>

        <p
          style={{
            position: "absolute",
            top: "667px",
            left: "180px",
            width: "920px",
            margin: 0,
            textAlign: "center",
            color: "#3F3F3F",
            fontSize: "23px",
            lineHeight: 1.2,
            fontWeight: 400,
          }}
        >
          Keep practicing to improve your scores and master your subjects.
        </p>

        <div
          style={{
            position: "absolute",
            top: "711px",
            left: "320px",
            width: "635px",
            height: "77px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1E4F8D",
            color: "#FFFFFF",
            fontSize: "30px",
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          Practice Now @ https://paceapp.ng
        </div>

        <p
          style={{
            position: "absolute",
            right: "65px",
            bottom: "22px",
            margin: 0,
            color: "#16956C",
            fontSize: "23px",
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          #icandobetter
        </p>
      </div>
    </div>
  );
};

export default ShareableResultCard;
