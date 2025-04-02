import React from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/api/useAuth";
import { useProfile } from "../hooks/api/useFeatures";
import { BeatLoader } from "react-spinners";

const Profile = () => {
  const { data, isLoading, error, refetch } = useProfile();
  const logoutMutation = useLogout();

  // Preserve the sample data for features marked as "COMING SOON"
  const coins = "C9,652";
  const practiceTime = "6hours, 52minutes";

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Format date from "dd-mm-yyyy" to a more readable format if needed
  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Check if the date is in DD-MM-YYYY format
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      // Return formatted date
      return `${day}/${month}/${year}`;
    }

    return dateString;
  };

  const profileData = data?.data || {};
  console.log(profileData);

  // Create skeleton loaders for different components
  const Skeleton = ({ className, ...props }) => (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      {...props}
    />
  );

  return (
    <div className="flex flex-col min-h-screen pb-16">
      {/* Green Header Section */}
      <div className="bg-[#16956C] p-6 pb-36 relative">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Profile</h1>
          <Link
            to="/change-password"
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
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
          </Link>
        </div>
      </div>

      {/* Profile Card - Overlapping the green section */}
      <div className="px-6 -mt-28 mb-6 ">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          {/* Profile Image */}
          <div className="w-28 h-28 z-20 relative rounded-2xl bg-gray-200 flex items-center justify-center overflow-hidden mx-auto mb-3 border-4 border-white shadow-sm">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : profileData.image ? (
              <img
                src={profileData.image}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/images/default-avatar.png";
                }}
              />
            ) : (
              <div className="w-full h-full bg-[#16956C] flex items-center justify-center text-white text-3xl font-bold">
                {profileData.fullName
                  ? profileData.fullName.charAt(0)
                  : profileData.username?.charAt(0) || "U"}
              </div>
            )}
          </div>

          {/* Name and Username */}
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-40 mx-auto mb-1" />
              <Skeleton className="h-4 w-24 mx-auto mb-4" />
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold uppercase tracking-wide mb-1">
                {profileData.fullName || ""}
              </h2>
              <p className="text-gray-500 mb-4">
                @{profileData.username || ""}
              </p>
            </>
          )}

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
        {/* Points (Questions Answered Correctly) */}
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
            {isLoading ? (
              <Skeleton className="h-6 w-16 mt-1" />
            ) : (
              <p className="text-lg font-bold">
                PT {profileData.questionsAnsweredCorrectly || 0}
              </p>
            )}
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
            {isLoading ? (
              // Skeleton loader for personal info
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between py-2 border-b border-gray-100"
                  >
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Department</span>
                  <span className="font-medium text-right">
                    {profileData.department
                      ? profileData.department.charAt(0).toUpperCase() +
                        profileData.department.slice(1)
                      : "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Phone Number</span>
                  <span className="font-medium">
                    {profileData.phoneNumber || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Date of Birth</span>
                  <span className="font-medium">
                    {formatDate(profileData.dateOfBirth) || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Level of Study</span>
                  <span className="font-medium">
                    {profileData.levelOfStudy || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Verification Status</span>
                  <span
                    className={`font-medium ${
                      profileData.isVerified
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                  >
                    {profileData.isVerified ? "Verified" : "Not Verified"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Interests Section */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Your Interests</h3>
          {isLoading ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profileData.subjectsOfInterest &&
              profileData.subjectsOfInterest.length > 0 ? (
                profileData.subjectsOfInterest.map((subject, index) => (
                  <span
                    key={index}
                    className="bg-[#E7F7F2] text-[#16956C] rounded-full px-3 py-1 text-sm"
                  >
                    {subject}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">
                  No subjects of interest specified
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error state indicator */}
      {error && (
        <div className="px-6 mb-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center">
            <p className="text-red-600 mb-2">Failed to load profile</p>
            <button
              onClick={() => refetch()}
              className="bg-white text-red-600 border border-red-300 px-4 py-2 rounded-full text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className="px-6 mb-6">
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="w-full bg-white border border-red-500 text-red-500 rounded-xl py-3 font-medium hover:bg-red-50 transition-colors relative disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {logoutMutation.isPending ? (
            <div className="flex items-center justify-center">
              <BeatLoader color="#EF4444" size={8} />
              <span className="ml-2">Logging out...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Profile;
