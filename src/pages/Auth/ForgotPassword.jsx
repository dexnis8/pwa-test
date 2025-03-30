import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define validation schema with zod
const forgotPasswordSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (value) => {
        // Nigerian number format validation
        // Format 1: +2349XXXXXXXXX (14 digits with country code)
        // Format 2: 09XXXXXXXXX (11 digits)
        const pattern1 = /^\+234[7-9][0-1][0-9]{8}$/; // +234 followed by 9 digits
        const pattern2 = /^0[7-9][0-1][0-9]{8}$/; // 0 followed by 10 digits
        return pattern1.test(value) || pattern2.test(value);
      },
      {
        message:
          "Please enter a valid Nigerian phone number (e.g., +2348012345678 or 08012345678)",
      }
    ),
});

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = (data) => {
    // Handle password reset logic here
    console.log("Requesting password reset for:", data.phoneNumber);
    setIsSubmitted(true);

    // For demo purposes, navigate to reset password page after successful submission
    setTimeout(() => {
      navigate("/auth/password/reset");
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full text-white">
      {/* Page Header with Back Button */}
      <div className="flex items-center mb-6">
        <Link
          to="/auth/signin"
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
        </Link>
        <h2 className="text-2xl font-medium">Forgot Password</h2>
      </div>

      <p className="text-white/80 mb-8">
        Enter your registered phone number and we'll send you a 4-digit
        verification code to reset your password.
      </p>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="mb-6">
            <label htmlFor="phoneNumber" className="block mb-2 text-white">
              Enter your phone number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              {...register("phoneNumber")}
              placeholder="e.g., +2348012345678 or 08012345678"
              className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-white placeholder-white/50 outline-none"
            />
            {errors.phoneNumber && (
              <p className="text-red-200 text-sm mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-white text-[#16956C] py-3 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer mt-6"
          >
            Send Verification Code
          </button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center flex flex-col items-center"
        >
          <div className="bg-white/20 rounded-full p-6 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1v-3a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-4">Check your phone</h3>
          <p className="mb-6">
            We've sent a 4-digit verification code to your phone. Enter this
            code on the next screen to reset your password.
          </p>
          <button
            onClick={() => navigate("/auth/password/reset")}
            className="bg-white text-[#16956C] py-3 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Enter verification code
          </button>
        </motion.div>
      )}
    </div>
  );
};
