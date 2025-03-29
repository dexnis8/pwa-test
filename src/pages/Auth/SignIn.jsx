import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define validation schema with zod
const signInSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    // Handle signin logic here
    console.log("Signing in with:", data);
  };

  return (
    <div className="flex flex-col h-full text-white">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
        {/* Phone Number Input */}
        <div className="mb-6">
          <label htmlFor="phoneNumber" className="block mb-2 text-white">
            Phone number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            {...register("phoneNumber")}
            placeholder="Enter your phone number"
            className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-white placeholder-white/50 outline-none"
          />
          {errors.phoneNumber && (
            <p className="text-red-200 text-sm mt-1">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-3">
          <label htmlFor="password" className="block mb-2 text-white">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password")}
            placeholder="Enter your password"
            className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-white placeholder-white/50 outline-none"
          />
          {errors.password && (
            <p className="text-red-200 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="mb-6 text-right">
          <Link
            to="/auth/forgot-password"
            className="text-white/80 text-sm hover:text-white transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          className="bg-white text-[#18B684] py-3 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer my-4"
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
            className="flex-1 bg-white text-[#18B684] py-2 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center"
          >
            <img
              src="/images/google-icon.png"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            <span className="text-sm">sign in with</span>
          </button>

          <button
            type="button"
            className="flex-1 bg-white text-[#18B684] py-2 px-4 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center"
          >
            <img
              src="/images/facebook-icon.png"
              alt="Facebook"
              className="w-5 h-5 mr-2"
            />
            <span className="text-sm">sign in with</span>
          </button>
        </div>
      </form>
    </div>
  );
};
