import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BeatLoader } from "react-spinners";
import { useChangePassword } from "../hooks/api/useAuth";

// Password validation schema
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ChangePassword = () => {
  const navigate = useNavigate();
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data) => {
    changePasswordMutation.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          navigate("/profile");
        },
      }
    );
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Green Header Section */}
      <div className="bg-[#16956C] p-6 pb-10 relative">
        <div className="flex items-center">
          <button
            onClick={handleCancel}
            className="bg-white/20 rounded-full p-2 mr-3 hover:bg-white/30 transition-colors"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
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
          <h1 className="text-white text-2xl font-bold">Change Password</h1>
        </div>
      </div>

      {/* Form Section */}
      <div className="px-6 -mt-12 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm mt-20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
            <div>
              <label
                htmlFor="currentPassword"
                className="block mb-2 text-gray-700 text-sm"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                {...register("currentPassword")}
                className="w-full border-b border-gray-300 py-2 focus:border-[#16956C] outline-none font-medium"
                placeholder="Enter your current password"
              />
              {errors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block mb-2 text-gray-700 text-sm"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                {...register("newPassword")}
                className="w-full border-b border-gray-300 py-2 focus:border-[#16956C] outline-none font-medium"
                placeholder="Enter your new password"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-gray-700 text-sm"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                className="w-full border-b border-gray-300 py-2 focus:border-[#16956C] outline-none font-medium"
                placeholder="Confirm your new password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex  space-x-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 border border-gray-300 bg-white text-gray-700 py-3 px-4 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={changePasswordMutation.isLoading}
                className="flex-1 bg-[#16956C] text-white py-3 px-4 rounded-full font-medium hover:bg-[#0F7355] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {changePasswordMutation.isLoading ? (
                  <BeatLoader color="#FFFFFF" size={8} />
                ) : (
                  "Change"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
