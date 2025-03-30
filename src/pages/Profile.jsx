import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectPersonalInfo,
  selectDepartment,
  selectInterests,
} from "../redux/slices/profileSlice";

const Profile = () => {
  const personalInfo = useSelector(selectPersonalInfo);
  const department = useSelector(selectDepartment);
  const interests = useSelector(selectInterests);

  // For the sample data to match the inspiration
  const earnings = "₦12,489.00";
  const coins = "C9,652";
  const practiceTime = "6hours, 52minutes";

  return (
    <div className="flex flex-col min-h-screen pb-16">
      {/* Green Header Section */}
      <div className="bg-[#16956C] p-6 pb-36 relative">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Profile</h1>
          <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Profile Card - Overlapping the green section */}
      <div className="px-6 -mt-28 mb-6 ">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          {/* Profile Image */}
          <div className="w-28 h-28 z-20 relative rounded-2xl bg-gray-200 flex items-center justify-center overflow-hidden mx-auto mb-3 border-4 border-white shadow-sm">
            {personalInfo.avatarUrl ? (
              <img
                src="/images/user.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#16956C] flex items-center justify-center text-white text-3xl font-bold">
                {personalInfo.fullName ? personalInfo.fullName.charAt(0) : "S"}
              </div>
            )}
          </div>

          {/* Name and Username */}
          <h2 className="text-xl font-bold uppercase tracking-wide mb-1">
            {personalInfo.fullName || "SALAWU HABEEBLAI"}
          </h2>
          <p className="text-gray-500 mb-4">
            @
            {personalInfo.fullName?.toLowerCase().replace(/\s+/g, "") ||
              "habeeblai"}
          </p>

          {/* Edit Profile Button */}
          <Link
            to="/profile/edit"
            className="bg-[#E7F7F2] text-[#16956C] rounded-full px-6 py-2 font-medium text-sm hover:bg-[#D6F0E6] transition-colors inline-block"
          >
            Edit profile
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 space-y-4 mb-6">
        {/* Points (formerly Earnings) */}
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center">
          <div className="w-10 h-10 bg-[#E7F7F2] rounded-lg flex items-center justify-center mr-3">
            <svg
              className="w-5 h-5 text-[#16956C]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1">
            <span className="text-sm text-gray-500">Points</span>
            <p className="text-lg font-bold">{earnings}</p>
          </div>
        </div>

        {/* Coins - with Soon badge */}
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center relative opacity-80">
          <div className="absolute top-0 right-0 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg rounded-tr-lg font-medium">
            COMING SOON
          </div>
          <div className="w-10 h-10 bg-[#FFF7E7] rounded-lg flex items-center justify-center mr-3">
            <svg
              className="w-5 h-5 text-[#FFAC33]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 8V12L14 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1">
            <span className="text-sm text-gray-500">Coins</span>
            <p className="text-lg font-bold">{coins}</p>
          </div>
        </div>

        {/* Practice Time - with Soon badge */}
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center relative opacity-80">
          <div className="absolute top-0 right-0 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg rounded-tr-lg font-medium">
            COMING SOON
          </div>
          <div className="w-10 h-10 bg-[#E8F4FF] rounded-lg flex items-center justify-center mr-3">
            <svg
              className="w-5 h-5 text-[#4094F7]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 6V12L16 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1">
            <span className="text-sm text-gray-500">
              On-screen time practice
            </span>
            <p className="text-lg font-bold">{practiceTime}</p>
          </div>
        </div>
      </div>

      {/* Personal Info Section */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Department</span>
              <span className="font-medium">
                {department || "Computer Science"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Gender</span>
              <span className="font-medium">
                {personalInfo.gender || "Female"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Date of Birth</span>
              <span className="font-medium">
                {personalInfo.dateOfBirth || "05/12/1998"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Level of Study</span>
              <span className="font-medium">
                {personalInfo.levelOfStudy || "300 Level"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interests Section */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Your Interests</h3>
          <div className="flex flex-wrap gap-2">
            {interests && interests.length > 0 ? (
              interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-[#E7F7F2] text-[#16956C] rounded-full px-3 py-1 text-sm"
                >
                  {interest}
                </span>
              ))
            ) : (
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#E7F7F2] text-[#16956C] rounded-full px-3 py-1 text-sm">
                  Chemistry
                </span>
                <span className="bg-[#E7F7F2] text-[#16956C] rounded-full px-3 py-1 text-sm">
                  Physics
                </span>
                <span className="bg-[#E7F7F2] text-[#16956C] rounded-full px-3 py-1 text-sm">
                  Biology
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
