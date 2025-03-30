import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

// Define validation schema with zod
const signInSchema = z.object({
  identifier: z
    .string()
    .min(1, "Username or phone number is required")
    .refine(
      (value) => {
        // If it looks like a phone number (starts with +234 or 0)
        if (
          value.startsWith("+234") ||
          (value.startsWith("0") && value.length === 11)
        ) {
          // Nigerian number format validation
          const pattern1 = /^\+234[7-9][0-1][0-9]{8}$/; // +234 followed by 9 digits
          const pattern2 = /^0[7-9][0-1][0-9]{8}$/; // 0 followed by 10 digits
          return pattern1.test(value) || pattern2.test(value);
        }

        // Check if it's a valid username (at least 3 characters)
        return value.length >= 3;
      },
      {
        message: (val) => {
          // Provide specific error message based on what the user tried to enter
          if (
            val.startsWith("+234") ||
            (val.startsWith("0") && val.length >= 10)
          ) {
            return "Please enter a valid Nigerian phone number (e.g., +2348012345678 or 08012345678)";
          }
          return "Username must be at least 3 characters";
        },
      }
    ),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    // Handle signin logic here
    console.log("Signing in with:", data);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col h-full text-white">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
        {/* Username/Phone Number Input */}
        <div className="mb-6">
          <label htmlFor="identifier" className="block mb-2 text-white">
            Username or Phone number
          </label>
          <input
            type="text"
            id="identifier"
            {...register("identifier")}
            placeholder="Enter your username or phone number"
            className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-white placeholder-white/50 outline-none"
          />
          {errors.identifier && (
            <p className="text-red-200 text-sm mt-1">
              {errors.identifier.message}
            </p>
          )}
          <p className="text-white/50 text-xs mt-1">
            For phone numbers: Use format +2348XXXXXXXXX or 08XXXXXXXXX
          </p>
        </div>

        {/* Password Input */}
        <div className="mb-3">
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

        {/* Forgot Password Link */}
        <div className="mb-6 text-right">
          <Link
            to="/auth/password/forgot"
            className="text-white/80 text-sm hover:text-white transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          className="bg-white text-[#16956C] py-3 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer my-4"
        >
          Sign in
        </button>

        {/* OR Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-white/30"></div>
          <span className="mx-4 text-white">or</span>
          <div className="flex-1 border-t border-white/30"></div>
        </div>

        {/* Social Sign In Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 gap-2 bg-white text-[#16956C] py-2 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center"
          >
            <span className="text-sm italic">sign in with</span>
            <div className="p-1 border rounded-full flex items-center border-[#E1E4EB] justify-center">
              <FcGoogle className="w-5 h-5" />
            </div>
          </button>

          <button
            type="button"
            className="flex-1 bg-white gap-2 text-[#16956C] py-2 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center"
          >
            <span className="text-sm italic">sign in with</span>
            <div className="p-1 border rounded-full flex items-center justify-center border-[#E1E4EB] text-blue-600">
              <FaFacebookF className="w-4 h-4" />
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};
