import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define validation schema with zod
const forgotPasswordSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

export const ForgotPassword = () => {
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
  };

  return (
    <div className="flex flex-col h-full text-white">
      <div className="mb-4">
        <Link
          to="/auth/signin"
          className="flex items-center text-white hover:text-white/80 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Sign In
        </Link>
      </div>

      <h2 className="text-xl font-medium mb-6">Forgot Password</h2>

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
              placeholder="Your registered phone number"
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
            className="bg-white text-[#18B684] py-3 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer mt-6"
          >
            Send Reset Instructions
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
            We've sent instructions to reset your password to your phone number.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-white text-[#18B684] py-3 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Back to reset form
          </button>
        </motion.div>
      )}
    </div>
  );
};
