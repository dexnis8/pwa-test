/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import BeatLoader from "react-spinners/BeatLoader";
import { useVerifyPhone, useResendOTP } from "../../hooks/api/useAuth";
import { showToast } from "../../lib/toast.jsx";

const OTP_LENGTH = 4;
const OTP_EXPIRY_SECONDS = 10 * 60; // 5 minutes

export const VerifyPhone = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Phone number is passed via navigation state from SignUp or SignIn
  const phoneNumber = location.state?.phoneNumber || "";
  const from = location.state?.from || "signup"; // "signup" | "signin"
  const backRoute = from === "signin" ? "/auth/signin" : "/auth/signup";

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [isExpired, setIsExpired] = useState(false);
  const inputRefs = useRef([]);

  const verifyMutation = useVerifyPhone();
  const resendMutation = useResendOTP();

  // Redirect if no phone number in state
  useEffect(() => {
    if (!phoneNumber) {
      navigate(backRoute);
    }
  }, [phoneNumber, navigate, backRoute]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (index, value) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        inputRefs.current[index - 1]?.focus();
      }
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    // Focus the next empty slot or the last one
    const nextEmpty = newOtp.findIndex((v) => !v);
    const focusIndex = nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();
  };

  const otpValue = otp.join("");
  const isComplete = otpValue.length === OTP_LENGTH;

  const handleVerify = async () => {
    if (!isComplete) {
      showToast.error("Please enter the complete OTP");
      return;
    }
    try {
      await verifyMutation.mutateAsync({ phoneNumber, otp: otpValue });
      // After verifying from sign-in flow, send user to sign in to get tokens
      // After verifying from sign-up flow, send user to sign in too
      navigate("/auth/signin", { replace: true });
    } catch {
      // Error handled in mutation
    }
  };

  const handleResend = async () => {
    try {
      await resendMutation.mutateAsync({ phoneNumber });
      // Reset timer and OTP
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setIsExpired(false);
      inputRefs.current[0]?.focus();
    } catch {
      // Error handled in mutation
    }
  };

  const maskedPhone = phoneNumber
    ? phoneNumber.replace(
        /(\+?\d{3})(\d+)(\d{4})/,
        (_, a, b, c) => `${a}${"*".repeat(b.length)}${c}`,
      )
    : "";

  return (
    <div className="flex flex-col h-full text-white">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          type="button"
          onClick={() => navigate(backRoute)}
          className="bg-white/20 rounded-full p-2 mr-3 hover:bg-white/30 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
        <h2 className="text-2xl font-medium">Verify Phone</h2>
      </div>

      {/* Phone icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex justify-center mb-6"
      >
        <div className="bg-white/20 rounded-full p-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.66A2 2 0 012.18 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
          </svg>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-white/80 text-center mb-2"
      >
        We sent a {OTP_LENGTH}-digit verification code to
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-white font-semibold text-center mb-8 tracking-wide"
      >
        {maskedPhone}
      </motion.p>

      {/* OTP inputs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex justify-center gap-3 mb-4"
        onPaste={handlePaste}
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-11 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-white/10 text-white outline-none transition-all duration-200
              ${digit ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.3)]" : "border-white/40"}
              focus:border-white focus:bg-white/20`}
            id={`otp-input-${index}`}
          />
        ))}
      </motion.div>

      {/* Timer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-6"
      >
        {isExpired ? (
          <p className="text-red-300 text-sm font-medium">
            OTP has expired. Please request a new one.
          </p>
        ) : (
          <p className="text-white/70 text-sm">
            Code expires in{" "}
            <span
              className={`font-semibold ${timeLeft <= 30 ? "text-red-300" : "text-white"}`}
            >
              {formatTime(timeLeft)}
            </span>
          </p>
        )}
      </motion.div>

      {/* Verify Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        type="button"
        onClick={handleVerify}
        disabled={!isComplete || verifyMutation.isPending || isExpired}
        className="bg-white text-[#16956C] py-3 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-4 flex items-center justify-center"
      >
        {verifyMutation.isPending ? (
          <BeatLoader color="#16956C" size={8} />
        ) : (
          "Verify Phone Number"
        )}
      </motion.button>

      {/* Resend OTP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <p className="text-white/70 text-sm mb-2">
          Didn&apos;t receive the code?
        </p>
        <button
          type="button"
          onClick={handleResend}
          disabled={
            resendMutation.isPending ||
            (!isExpired && timeLeft > OTP_EXPIRY_SECONDS - 30)
          }
          className="text-white font-semibold underline underline-offset-2 hover:text-white/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          {resendMutation.isPending ? (
            <BeatLoader color="#ffffff" size={6} />
          ) : (
            "Resend OTP"
          )}
        </button>
      </motion.div>
    </div>
  );
};
