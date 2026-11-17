import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResetPassword } from "../../hooks/api/useAuth";

const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .min(1, "OTP is required")
      .length(4, "OTP must be exactly 4 digits")
      .regex(/^\d{4}$/, "OTP must contain only numbers"),
    username: z.string().trim().optional(),
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
  const location = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const resetPassword = useResetPassword();
  const username = location.state?.username ?? "";

  // Password reset form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });
  const formUsername = watch("username");
  const resetUsername = username || formUsername?.trim() || "";

  const onSubmit = async (data) => {
    if (!resetUsername) return;
    await resetPassword.mutateAsync({
      username: resetUsername,
      newPassword: data.password,
      otp: data.otp,
    });
    setIsSubmitted(true);

    // Redirect to sign in after a delay
    setTimeout(() => {
      navigate("/auth/signin");
    }, 3000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Helper function to format OTP input (keep only digits and limit to 4)
  const formatOtpInput = (e) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 4);
    e.target.value = value;
  };

  return (
    <div className="flex flex-col h-full text-white">
      {/* Page Header with Back Button */}
      <div className="flex items-center mb-6">
        <Link
          to="/auth/password/forgot"
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
        <h2 className="text-2xl font-medium">Reset Password</h2>
      </div>

      {!isSubmitted ? (
        <>
            {!username ? (
              <div className="mb-6">
                <p className="text-white/80 mb-4">Enter the username or phone number you used to request the reset code.</p>
                <label htmlFor="username" className="block mb-2 text-white">Username or phone number</label>
                <input
                  type="text"
                  id="username"
                  autoComplete="username"
                  {...register("username")}
                  placeholder="Username or phone number"
                  className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-white placeholder-white/50 outline-none"
                />
                {errors.username && <p className="text-red-200 text-sm mt-1">{errors.username.message}</p>}
              </div>
            ) : (
              <p className="text-white/80 mb-4">Resetting password for <strong>{username}</strong>.</p>
            )}
            <p className="text-white/80 mb-8">
              Enter the 4-digit code sent to you and choose a new password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <div className="mb-6">
                <label htmlFor="otp" className="block mb-2 text-white">Verification Code</label>
                <input
                  type="text"
                  id="otp"
                  {...register("otp")}
                  onInput={formatOtpInput}
                  placeholder="Enter 4-digit code"
                  className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-white placeholder-white/50 outline-none text-center text-2xl tracking-widest"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
                {errors.otp && <p className="text-red-200 text-sm mt-1">{errors.otp.message}</p>}
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-white">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    {...register("password")}
                    placeholder="Enter your new password"
                    className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-white placeholder-white/50 outline-none"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clipRule="evenodd"
                        />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-200 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-white"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    {...register("confirmPassword")}
                    placeholder="Confirm your new password"
                    className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-white placeholder-white/50 outline-none"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clipRule="evenodd"
                        />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-200 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={resetPassword.isPending || !resetUsername}
                className="bg-white text-[#16956C] py-3 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer mt-6"
              >
                {resetPassword.isPending ? "Resetting..." : "Reset Password"}
              </button>
            </form>
        </>
      ) : (
        // Success Message (after password reset)
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
