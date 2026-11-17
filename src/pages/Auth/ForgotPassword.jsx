import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useForgotPassword } from "../../hooks/api/useAuth";

const forgotPasswordSchema = z.object({
  username: z.string().trim().min(1, "Username or phone number is required"),
});

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [submittedUsername, setSubmittedUsername] = useState("");
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { username: "" },
  });

  const onSubmit = async ({ username }) => {
    const normalizedUsername = username.trim();
    await forgotPassword.mutateAsync({ username: normalizedUsername });
    setSubmittedUsername(normalizedUsername);
  };

  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex items-center mb-6">
        <Link
          to="/auth/signin"
          className="bg-white/20 rounded-full p-2 mr-3 hover:bg-white/30 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </Link>
        <h2 className="text-2xl font-medium">Forgot Password</h2>
      </div>

      {!submittedUsername ? (
        <>
          <p className="text-white/80 mb-8">
            Enter your username or registered phone number and we'll send you a
            4-digit verification code to reset your password.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="mb-6">
              <label htmlFor="username" className="block mb-2 text-white">
                Username or phone number
              </label>
              <input
                type="text"
                id="username"
                autoComplete="username"
                {...register("username")}
                placeholder="Enter your username or phone number"
                className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-white placeholder-white/50 outline-none"
                disabled={forgotPassword.isPending}
              />
              {errors.username && (
                <p className="text-red-200 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={forgotPassword.isPending}
              className="bg-white text-[#16956C] py-3 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer mt-6 disabled:opacity-60"
            >
              {forgotPassword.isPending ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center flex flex-col items-center"
        >
          <div className="bg-white/20 rounded-full p-6 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1v-3a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-4">Check your phone</h3>
          <p className="mb-6">
            If an account matches <strong>{submittedUsername}</strong>, a 4-digit
            verification code has been sent. Enter it on the next screen to reset
            your password.
          </p>
          <button
            onClick={() => navigate("/auth/password/reset", { state: { username: submittedUsername } })}
            className="bg-white text-[#16956C] py-3 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Enter verification code
          </button>
        </motion.div>
      )}
    </div>
  );
};
