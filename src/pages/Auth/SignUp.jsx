import React, { useState } from "react";
import { MotionButton } from "../../components/MotionButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

// Define validation schema with zod
const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters"),
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

export const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
    phoneNumber: "",
    password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    // Set loading state
    setIsLoading(true);

    // Handle signup logic here
    console.log("Signing up with:", data);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to profile completion page
      navigate("/profile/complete");
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex flex-col h-full text-white">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
        {/* Username Input */}
        <div className="mb-6">
          <label htmlFor="username" className="block mb-2 text-white">
            Username
          </label>
          <input
            type="text"
            id="username"
            {...register("username")}
            placeholder="Enter your username"
            className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-white placeholder-white/50 outline-none"
          />
          {errors.username && (
            <p className="text-red-200 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="mb-6">
          <label htmlFor="phoneNumber" className="block mb-2 text-white">
            Phone number
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

        {/* Password Input */}
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-white">
            Password
          </label>
          <div className="relative">
          <input
              type={showPassword ? "text" : "password"}
            id="password"
              {...register("password")}
            placeholder="Enter your password"
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

        {/* Confirm Password Input */}
        <div className="mb-8">
          <label htmlFor="confirmPassword" className="block mb-2 text-white">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              {...register("confirmPassword")}
              placeholder="Confirm your password"
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

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-white text-[#16956C] py-3 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer my-4 relative"
        >
          {isLoading ? (
            <>
              <span className="opacity-0">Sign up</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-[#16956C]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            </>
          ) : (
            "Sign up"
          )}
        </button>

        {/* OR Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-white/30"></div>
          <span className="mx-4 text-white">or</span>
          <div className="flex-1 border-t border-white/30"></div>
        </div>

        {/* Social Sign Up Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 gap-2 bg-white text-[#16956C] py-2 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center"
          >
            <span className="text-sm italic">sign up with</span>
            <div className="p-1 border rounded-full flex items-center border-[#E1E4EB] justify-center">
              <FcGoogle className="w-5 h-5" />
            </div>
          </button>

          <button
            type="button"
            className="flex-1 bg-white gap-2 text-[#16956C] py-2 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center"
          >
            <span className="text-sm italic">sign up with</span>
            <div className="p-1 border rounded-full flex items-center justify-center border-[#E1E4EB] text-blue-600">
              <FaFacebookF className="w-4 h-4" />
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};
