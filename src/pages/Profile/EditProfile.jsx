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

// Form validation schema
const editProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address").optional(),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  levelOfStudy: z.string().min(1, "Level of study is required"),
});

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const personalInfo = useSelector(selectPersonalInfo);
  const currentDepartment = useSelector(selectDepartment);
  const savedInterests = useSelector(selectInterests);

  const [avatarUrl, setAvatarUrl] = useState(personalInfo.avatarUrl || null);
  const [department, setLocalDepartment] = useState(
    currentDepartment || "sciences"
  );
  const [selectedInterests, setSelectedInterests] = useState(
    savedInterests.length > 0 ? savedInterests : []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(editProfileSchema),
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

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
  };

  const onSubmit = (data) => {
    // Save the data to Redux
    dispatch(
      updatePersonalInfo({
        ...data,
        avatarUrl,
      })
    );

    // Save department
    dispatch(setDepartment(department));

    // Save interests
    dispatch(setInterests(selectedInterests));

    // Navigate back to profile
    navigate("/profile");
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
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#16956C] flex items-center justify-center text-white text-3xl font-bold">
                {personalInfo.fullName ? personalInfo.fullName.charAt(0) : "U"}
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-2 right-2 bg-[#16956C] rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-white shadow-md"
            >
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
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <p className="text-gray-500 text-sm">Tap to change profile picture</p>
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
                htmlFor="gender"
                className="block mb-2 text-gray-700 text-sm"
              >
                Gender
              </label>
              <select
                id="gender"
                {...register("gender")}
                className="w-full border-b border-gray-300 py-2 focus:border-[#16956C] outline-none bg-transparent font-medium"
              >
                <option value="" disabled>
                  Select your gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.gender.message}
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
                <option value="100 Level">100 Level</option>
                <option value="200 Level">200 Level</option>
                <option value="300 Level">300 Level</option>
                <option value="400 Level">400 Level</option>
                <option value="500 Level">500 Level</option>
                <option value="Postgraduate">Postgraduate</option>
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
            Select subjects that interest you
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
                    flex items-center px-4 py-3 rounded-full transition-colors
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
                      className="h-5 w-5 mr-2"
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
                  <span className="mr-2">{subject.icon}</span>
                  <span className="font-medium text-sm whitespace-nowrap">
                    {subject.name}
                  </span>
                </button>
              );
            })}
          </div>
          {selectedInterests.length === 0 && (
            <p className="text-yellow-600 text-xs mt-2">
              Please select at least one subject
            </p>
          )}
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
            disabled={selectedInterests.length === 0}
            className={`flex-1 py-4 px-4 rounded-full font-medium transition-colors ${
              selectedInterests.length > 0
                ? "bg-[#16956C] text-white hover:bg-[#0F7355]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
