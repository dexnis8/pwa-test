/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePersonalInfo,
  selectPersonalInfo,
  incrementCompletionStep,
  selectCompletionStep,
  setCompletionStep,
} from "../../redux/slices/profileSlice";

// Form validation schema
const profileStage1Schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address").optional(),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  levelOfStudy: z.string().min(1, "Level of study is required"),
});

const CompleteProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const personalInfo = useSelector(selectPersonalInfo);
  const currentStep = useSelector(selectCompletionStep);

  const [avatarUrl, setAvatarUrl] = useState(personalInfo.avatarUrl || null);
  const totalSteps = 3;

  // Set the current step to 1 when this component mounts
  useEffect(() => {
    if (currentStep !== 1) {
      dispatch(setCompletionStep(1));
    }
  }, [currentStep, dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(profileStage1Schema),
    defaultValues: {
      fullName: personalInfo.fullName || "",
      email: personalInfo.email || "",
      gender: personalInfo.gender || "",
      dateOfBirth: personalInfo.dateOfBirth || "",
      levelOfStudy: personalInfo.levelOfStudy || "",
    },
  });

  // Prefill form with any existing data
  useEffect(() => {
    if (personalInfo) {
      Object.keys(personalInfo).forEach((key) => {
        if (personalInfo[key] && key !== "avatarUrl") {
          setValue(key, personalInfo[key]);
        }
      });
    }
  }, [personalInfo, setValue]);

  const onSubmit = (data) => {
    // Save the data to Redux
    dispatch(
      updatePersonalInfo({
        ...data,
        avatarUrl,
      })
    );

    // Increment completion step
    dispatch(incrementCompletionStep());

    // Navigate to the next step
    navigate("/profile/complete/step2");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-[#16956C] text-2xl font-bold mb-2">
            Complete profile
          </h1>
          <span className="text-gray-500 font-semibold">
            {currentStep}/{totalSteps}
          </span>
        </div>
        <p className="text-gray-700">Let's know you better 😊</p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
        {/* Avatar Upload */}
        <div className="flex justify-start mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-[#16956C] rounded-full w-7 h-7 flex items-center justify-center cursor-pointer text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 flex-1">
          <div>
            <label htmlFor="fullName" className="block mb-2 text-gray-700">
              Full name
            </label>
            <input
              type="text"
              id="fullName"
              {...register("fullName")}
              placeholder="Enter your full name"
              className="w-full border-b border-gray-300 py-2 focus:border-[#16956C] outline-none font-medium"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-gray-700">
              E-mail (optional)
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              placeholder="Enter your email address"
              className="w-full border-b border-gray-300 py-2 focus:border-[#16956C] outline-none font-medium"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="gender" className="block mb-2 text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              {...register("gender")}
              className="w-full border-b border-gray-300 py-2 focus:border-[#16956C] outline-none bg-transparent font-medium"
            >
              <option value="" disabled selected>
                Select your gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block mb-2 text-gray-700">
              Date of birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              {...register("dateOfBirth")}
              className="w-full border-b border-gray-300 py-2 focus:border-[#16956C] outline-none font-medium"
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="levelOfStudy" className="block mb-2 text-gray-700">
              Level of study
            </label>
            <select
              id="levelOfStudy"
              {...register("levelOfStudy")}
              className="w-full border-b border-gray-300 py-2 focus:border-[#16956C] outline-none bg-transparent font-medium"
            >
              <option value="" disabled selected>
                Select your level of study
              </option>
              <option value="high-school">High School</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="doctorate">Doctorate</option>
              <option value="other">Other</option>
            </select>
            {errors.levelOfStudy && (
              <p className="text-red-500 text-sm mt-1">
                {errors.levelOfStudy.message}
              </p>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-auto pt-6">
          <button
            type="submit"
            className="w-full bg-[#16956C] text-white py-4 px-4 rounded-full font-medium hover:bg-[#0F7355] transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompleteProfile;
