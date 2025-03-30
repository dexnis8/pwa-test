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

  return (
    <div className="p-6">
      <h1 className="text-[#16956C] text-2xl font-bold mb-6">Profile</h1>

      {/* User Info Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
            {personalInfo.avatarUrl ? (
              <img
                src={personalInfo.avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#16956C] flex items-center justify-center text-white text-2xl font-bold">
                {personalInfo.fullName ? personalInfo.fullName.charAt(0) : "U"}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {personalInfo.fullName || "Unknown User"}
            </h2>
            <p className="text-gray-600">
              {personalInfo.email || "No email provided"}
            </p>
            <div className="mt-2">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Level {personalInfo.levelOfStudy || "Unknown"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Department</span>
            <span className="font-medium">{department || "Not set"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Gender</span>
            <span className="font-medium">
              {personalInfo.gender || "Not set"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Date of Birth</span>
            <span className="font-medium">
              {personalInfo.dateOfBirth || "Not set"}
            </span>
          </div>
        </div>
      </div>

      {/* Interests Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-lg font-bold mb-4">Your Interests</h3>
        <div className="flex flex-wrap gap-2">
          {interests && interests.length > 0 ? (
            interests.map((interest, index) => (
              <span
                key={index}
                className="bg-[#16956C] text-white rounded-full px-3 py-1 text-sm"
              >
                {interest}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No interests selected</p>
          )}
        </div>
      </div>

      {/* Edit Profile Button */}
      <Link
        to="/profile/complete"
        className="block w-full bg-[#16956C] hover:bg-[#138055] text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
      >
        Edit Profile
      </Link>
    </div>
  );
};

export default Profile;
