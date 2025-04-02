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
import { useImageUpload } from "../../hooks/api/useFeatures";
import BeatLoader from "react-spinners/BeatLoader";
import { showToast } from "../../lib/toast.jsx";

// Calculate minimum date for 13 years old
const getMinimumAgeDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 13);
  return date;
};

// Form validation schema
const profileStage1Schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  gender: z
    .string()
    .min(1, "Gender is required")
    .refine((value) => ["male", "female", "Male", "Female"].includes(value), {
      message: "Gender must be either male or female",
    }),
  dateOfBirth: z.string().refine((value) => {
    // Check if date is valid
    const date = new Date(value);
    if (isNaN(date.getTime())) return false;

    // Check if user is at least 13 years old
    const minDate = getMinimumAgeDate();
    return date <= minDate;
  }, "You must be at least 13 years old to use this app"),
  levelOfStudy: z.string().min(1, "Level of study is required"),
  profileImage: z.string().min(1, "Profile image is required"),
});

const CompleteProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const personalInfo = useSelector(selectPersonalInfo);
  const currentStep = useSelector(selectCompletionStep);
  const imageUploadMutation = useImageUpload();

  const [avatarUrl, setAvatarUrl] = useState(personalInfo.avatarUrl || null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const totalSteps = 3;

  // Calculate max date (13 years ago) for the date input
  const maxDate = getMinimumAgeDate().toISOString().split("T")[0];

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
    watch,
  } = useForm({
    resolver: zodResolver(profileStage1Schema),
    defaultValues: {
      fullName: personalInfo.fullName || "",
      email: personalInfo.email || "",
      gender: personalInfo.gender || "",
      dateOfBirth: personalInfo.dateOfBirth || "",
      levelOfStudy: personalInfo.levelOfStudy || "",
      profileImage: personalInfo.profileImage || "",
    },
  });

  // Watch the profileImage field
  const profileImage = watch("profileImage");

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

  const onSubmit = async (data) => {
    try {
      // Save the data to Redux - including profileImage which contains the Cloudinary URL
      dispatch(
        updatePersonalInfo({
          ...data,
          avatarUrl, // local preview
          profileImage: data.profileImage, // cloud URL for API
        })
      );

      // Increment completion step
      dispatch(incrementCompletionStep());

      // Navigate to the next step
      navigate("/profile/complete/step2");
    } catch (error) {
      console.error("Error saving profile data:", error);
      showToast.error("Failed to save profile data. Please try again.");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Clear previous errors
    setUploadError(null);

    try {
      // Validate file type (images only)
      if (!file.type.startsWith("image/")) {
        setUploadError("Only image files are allowed");
        showToast.error("Only image files are allowed");
        return;
      }

      // Validate file size (max 3MB)
      if (file.size > 3 * 1024 * 1024) {
        setUploadError("Image size must be less than 3MB");
        showToast.error("Image size must be less than 3MB");
        return;
      }

      // Set local image preview
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
      setAvatarFile(file);
      setIsUploading(true);

      // Upload to server
      const result = await imageUploadMutation.mutateAsync(file);

      if (result.success && result.data?.urls?.length > 0) {
        const uploadedUrl = result.data.urls[0];
        // Update form with the cloudinary URL
        setValue("profileImage", uploadedUrl);
        showToast.success("Image uploaded successfully");
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      setUploadError(error.message || "Failed to upload image");
      // Keep the local preview but set error state
    } finally {
      setIsUploading(false);
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
        <div className="flex flex-col items-start mb-8">
          <div className="relative mb-2">
            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <BeatLoader color="#FFFFFF" size={8} />
                    </div>
                  )}
                </div>
              ) : (
                <svg
                  className="w-14 h-14 text-gray-400"
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
              className="absolute bottom-0 right-0 bg-[#16956C] rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-white disabled:bg-gray-400"
            >
              {isUploading ? (
                <BeatLoader color="#FFFFFF" size={5} />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isUploading}
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">(required, max 3MB)</p>
          {uploadError && (
            <p className="text-red-500 text-sm mt-1">{uploadError}</p>
          )}
          {errors.profileImage && !profileImage && (
            <p className="text-red-500 text-sm mt-1">
              {errors.profileImage.message}
            </p>
          )}

          {/* Hidden input for the uploaded image URL */}
          <input type="hidden" {...register("profileImage")} />
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
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block mb-2 text-gray-700">
              Date of birth (must be 13 or older)
            </label>
            <input
              type="date"
              id="dateOfBirth"
              {...register("dateOfBirth")}
              max={maxDate}
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
              <option value="SS1">SS1</option>
              <option value="SS2">SS2</option>
              <option value="SS3">SS3</option>
              <option value="WAEC/NECO">WAEC/NECO</option>
              <option value="UTME">UTME</option>
              <option value="POST-UTME">POST-UTME</option>
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
            disabled={isUploading}
            className="w-full bg-[#16956C] text-white py-4 px-4 rounded-full font-medium hover:bg-[#0F7355] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUploading ? <BeatLoader color="#FFFFFF" size={8} /> : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompleteProfile;
