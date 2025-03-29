import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define validation schema with zod
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    // Handle password reset logic here
    console.log("Setting new password:", data.password);
    setIsSubmitted(true);

    // Redirect to sign in after a delay
    setTimeout(() => {
      navigate("/auth/signin");
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full text-white">
      <div className="mb-4">
        <Link
          to="/auth/forgot-password"
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
          Back
        </Link>
      </div>

      <h2 className="text-xl font-medium mb-6">Reset Password</h2>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-white">
              New Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              placeholder="Enter your new password"
              className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-white placeholder-white/50 outline-none"
            />
            {errors.password && (
              <p className="text-red-200 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2 text-white">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
              placeholder="Confirm your new password"
              className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-white placeholder-white/50 outline-none"
            />
            {errors.confirmPassword && (
              <p className="text-red-200 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-white text-[#18B684] py-3 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer mt-6"
          >
            Reset Password
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
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-4">
            Password reset successful!
          </h3>
          <p className="mb-6">
            Your password has been reset successfully. You'll be redirected to
            the Sign In page in a moment.
          </p>
        </motion.div>
      )}
    </div>
  );
};
