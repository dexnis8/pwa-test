import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePersonalInfo,
  selectPersonalInfo,
  selectDepartment,
  setDepartment,
  selectInterests,
  setInterests,
} from "../../redux/slices/profileSlice";
import {
  useProfile,
  useImageUpload,
  useUpdateProfile,
} from "../../hooks/api/useFeatures";
import { BeatLoader } from "react-spinners";
import { showToast } from "../../lib/toast.jsx";

// Form validation schema
const editProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  levelOfStudy: z.string().min(1, "Level of study is required"),
  profileImage: z.string().min(1, "Profile image is required"),
});

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const personalInfo = useSelector(selectPersonalInfo);
  const currentDepartment = useSelector(selectDepartment);
  const savedInterests = useSelector(selectInterests);
  const { data: profileData } = useProfile();
  const imageUploadMutation = useImageUpload();
  const updateProfileMutation = useUpdateProfile();

  // Get profile image from API if available
  const profileImageFromApi = profileData?.data?.image;

  // Use API image if available, otherwise fall back to Redux state
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [department, setLocalDepartment] = useState(
    currentDepartment || "sciences"
  );
  const [selectedInterests, setSelectedInterests] = useState(
    savedInterests.length > 0 ? savedInterests : []
  );

  // Map of subjects for getting display names
  const subjectsMap = {
    english: "English",
    mathematics: "Mathematics",
    physics: "Physics",
    biology: "Biology",
    chemistry: "Chemistry",
  };

  // Update avatar URL once profile data is loaded
  useEffect(() => {
    if (profileImageFromApi) {
      setAvatarUrl(profileImageFromApi);
    } else if (personalInfo.avatarUrl || personalInfo.profileImage) {
      setAvatarUrl(personalInfo.avatarUrl || personalInfo.profileImage);
    }
  }, [profileImageFromApi, personalInfo]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: personalInfo.fullName || "",
      email: personalInfo.email || "",
      dateOfBirth: personalInfo.dateOfBirth || "",
      levelOfStudy: personalInfo.levelOfStudy || "",
      profileImage: personalInfo.profileImage || profileImageFromApi || "",
    },
  });

  // Watch the profileImage field
  const profileImage = watch("profileImage");

  // Update useEffect for debugging
  useEffect(() => {
    console.log("Personal Info from Redux:", personalInfo);

    if (personalInfo) {
      console.log("Setting values from personalInfo");
      Object.keys(personalInfo).forEach((key) => {
        if (personalInfo[key] && key !== "avatarUrl") {
          console.log(`Setting ${key}:`, personalInfo[key]);
          setValue(key, personalInfo[key]);
        }
      });
    }

    if (profileData?.data) {
      const apiData = profileData.data;
      console.log("API Data received:", apiData);

      if (apiData.fullName) setValue("fullName", apiData.fullName);
      if (apiData.dateOfBirth) {
        console.log("Setting DOB from API:", apiData.dateOfBirth);
        try {
          // Try to parse and format the date
          const date = new Date(apiData.dateOfBirth);
          if (!isNaN(date.getTime())) {
            const formattedDate = date.toISOString().split("T")[0];
            console.log("Formatted DOB:", formattedDate);
            setValue("dateOfBirth", formattedDate);
          } else {
            console.error(
              "Invalid date received from API:",
              apiData.dateOfBirth
            );
          }
        } catch (error) {
          console.error("Error formatting date:", error);
        }
      }
      if (apiData.levelOfStudy) setValue("levelOfStudy", apiData.levelOfStudy);
      if (apiData.image) setValue("profileImage", apiData.image);

      // Set department from API if available
      if (apiData.department) {
        setLocalDepartment(apiData.department);
      }

      // Set interests from API if available
      if (apiData.subjectsOfInterest && apiData.subjectsOfInterest.length > 0) {
        const subjectIds = apiData.subjectsOfInterest.map((name) =>
          name.toLowerCase().replace(/\s+/g, "")
        );
        setSelectedInterests(subjectIds);
      }
    }
  }, [personalInfo, profileData, setValue]);

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

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Save the data to Redux
      dispatch(
        updatePersonalInfo({
          ...data,
          avatarUrl, // local preview
          profileImage: data.profileImage, // cloud URL for API
        })
      );

      // Save department
      dispatch(setDepartment(department));

      // Save interests
      dispatch(setInterests(selectedInterests));

      // Get display names for subjects/interests
      const selectedSubjectNames = selectedInterests.map(
        (id) => subjectsMap[id] || id
      );

      // Prepare profile data for API
      const profileData = {
        fullName: data.fullName,
        email: data.email || "", // Email is optional
        dateOfBirth: data.dateOfBirth, // Date format will be handled by the hook
        levelOfStudy: data.levelOfStudy,
        subjectsOfInterest: selectedSubjectNames,
        department: department || "sciences",
        image: data.profileImage, // The Cloudinary URL
      };

      // Submit all profile data to the API
      await updateProfileMutation.mutateAsync(profileData);

      // Navigate back to profile
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  const departments = [
    { id: "sciences", name: "Sciences" },
    { id: "arts", name: "Arts (Coming Soon)", disabled: true },
    { id: "commercials", name: "Commercials (Coming Soon)", disabled: true },
  ];

  const subjects = [
    {
      id: "english",
      name: "English",
      icon: "📝",
    },
    {
      id: "mathematics",
      name: "Mathematics",
      icon: "🔢",
    },
    {
      id: "physics",
      name: "Physics",
      icon: "🔭",
    },
    {
      id: "biology",
      name: "Biology",
      icon: "🧬",
    },
    {
      id: "chemistry",
      name: "Chemistry",
      icon: "🧪",
    },
  ];

  const toggleInterest = (id) => {
    setSelectedInterests((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Add minimum selections constant
  const minimumSelections = 4;

  // Check if minimum subjects are selected
  const hasMinimumSelections = selectedInterests.length >= minimumSelections;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Green Header Section */}
      <div className="bg-[#16956C] p-6 pb-28 relative">
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
          <h1 className="text-white text-2xl font-bold">Edit Profile</h1>
        </div>
      </div>

      {/* Avatar Card - Overlapping the green section */}
      <div className="px-6 -mt-20 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          {/* Profile Image */}
          <div className="w-28 h-28 rounded-2xl bg-gray-200 flex items-center justify-center overflow-hidden mx-auto mb-3 border-4 border-white shadow-sm relative">
            {avatarUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/images/default-avatar.png";
                    console.log("Failed to load profile image");
                  }}
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <BeatLoader color="#FFFFFF" size={8} />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-[#16956C] flex items-center justify-center text-white text-3xl font-bold">
                {personalInfo.fullName ? personalInfo.fullName.charAt(0) : "U"}
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-2 right-2 bg-[#16956C] rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-white shadow-md disabled:bg-gray-400"
            >
              {isUploading ? (
                <BeatLoader color="#FFFFFF" size={5} />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
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
          <p className="text-sm text-gray-500">(max size: 3MB)</p>
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
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-bold mb-4">Personal Information</h3>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block mb-2 text-gray-700 text-sm"
              >
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
                <p className="text-red-500 text-xs mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-gray-700 text-sm"
              >
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
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="block mb-2 text-gray-700 text-sm"
              >
                Date of birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                {...register("dateOfBirth")}
                className="w-full border-b border-gray-300 py-2 focus:border-[#16956C] outline-none font-medium"
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="levelOfStudy"
                className="block mb-2 text-gray-700 text-sm"
              >
                Level of study
              </label>
              <select
                id="levelOfStudy"
                {...register("levelOfStudy")}
                className="w-full border-b border-gray-300 py-2 focus:border-[#16956C] outline-none bg-transparent font-medium"
              >
                <option value="" disabled>
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
                <p className="text-red-500 text-xs mt-1">
                  {errors.levelOfStudy.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Department Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-bold mb-4">Department</h3>
          <div className="space-y-3">
            {departments.map((dept) => (
              <button
                key={dept.id}
                type="button"
                disabled={dept.disabled}
                className={`w-full py-3 px-4 rounded-lg border ${
                  department === dept.id
                    ? "border-[#16956C] bg-[#E7F7F2] text-[#16956C]"
                    : "border-gray-200 text-gray-700"
                } flex justify-between items-center transition-all ${
                  dept.disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => !dept.disabled && setLocalDepartment(dept.id)}
              >
                <span className="font-medium">{dept.name}</span>
                {department === dept.id && (
                  <svg
                    className="w-5 h-5 text-[#16956C]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Interests Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-bold mb-4">Subjects of Interest</h3>
          <p className="text-gray-500 text-sm mb-4">
            Select minimum of {minimumSelections} subjects that interest you
          </p>

          <div className="grid grid-cols-2 gap-3 mb-2">
            {subjects.map((subject) => {
              const isSelected = selectedInterests.includes(subject.id);
              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => toggleInterest(subject.id)}
                  className={`
                    flex items-center px-3 py-3 rounded-full transition-colors w-full
                    ${
                      isSelected
                        ? "bg-[#16956C] text-white"
                        : "bg-white text-gray-800 border border-gray-200 shadow-sm"
                    }
                  `}
                >
                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 min-w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="mr-1 flex-shrink-0">{subject.icon}</span>
                  <span className="font-medium text-xs truncate">
                    {subject.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Selected: {selectedInterests.length}/{minimumSelections}{" "}
                required
              </span>
              {!hasMinimumSelections && (
                <span className="text-yellow-600 text-xs font-medium">
                  Please select {minimumSelections - selectedInterests.length}{" "}
                  more
                </span>
              )}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${
                  hasMinimumSelections ? "bg-green-500" : "bg-yellow-500"
                }`}
                style={{
                  width: `${Math.min(
                    (selectedInterests.length / minimumSelections) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 border border-gray-300 bg-white text-gray-700 py-4 px-4 rounded-full font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!hasMinimumSelections || isSubmitting || isUploading}
            className={`flex-1 py-4 px-4 rounded-full font-medium transition-colors ${
              hasMinimumSelections && !isSubmitting && !isUploading
                ? "bg-[#16956C] text-white hover:bg-[#0F7355]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <BeatLoader color="#FFFFFF" size={8} />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
