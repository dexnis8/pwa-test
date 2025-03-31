import React, { useState } from "react";
import { useLeaderboard } from "../hooks/api/useFeatures";
import BeatLoader from "react-spinners/BeatLoader";

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("earnings");
  const { data, isLoading, isError, refetch } = useLeaderboard();

  // Default avatar for users without an image
  const defaultAvatar =
    "https://ui-avatars.com/api/?background=random&color=fff&size=150";

  // Get formatted date for "Last updated"
  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#16956C]">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-white text-2xl font-bold">Leaderboard</h1>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-5">
        <div className="bg-white p-1 rounded-full flex overflow-hidden">
          <button
            className={`flex-1 py-3 px-4 rounded-full text-center font-medium ${
              activeTab === "earnings"
                ? "bg-[#16956C] text-white"
                : "bg-white text-[#16956C]"
            }`}
            onClick={() => setActiveTab("earnings")}
          >
            Earnings
          </button>
          <button
            className="flex-1 py-3 px-4 rounded-full text-center font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
            disabled
          >
            Coins
            <span className="ml-1 text-xs bg-yellow-500 text-white px-1.5 py-0.5 rounded-full">
              Soon
            </span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <BeatLoader color="#FFFFFF" />
          <p className="text-white mt-4">Loading leaderboard...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="bg-white/20 p-6 rounded-lg text-center">
            <p className="text-white mb-4">Failed to load leaderboard data</p>
            <button
              onClick={() => refetch()}
              className="bg-white text-[#16956C] px-4 py-2 rounded-full font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Leaderboard Content */}
      {!isLoading && !isError && data && (
        <>
          {/* Top 3 Users */}
          <div className="px-6 flex justify-center mb-4 relative mt-5">
            {data?.data?.topUsers?.length > 1 && (
              /* Second place */
              <div className="flex flex-col items-center mx-3">
                <div className="w-20 h-20 bg-white rounded-full border-2 border-white relative">
                  <img
                    src={data.data.topUsers[1].image || defaultAvatar}
                    alt="Second place"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.src = defaultAvatar;
                    }}
                  />
                  <div className="absolute -bottom-1 -left-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-[#16956C] font-bold text-xs border border-white">
                    2
                  </div>
                </div>
                <p className="text-white text-sm mt-1">
                  {data.data.topUsers[1].username}
                </p>
                <p className="bg-white text-[#16956C] text-xs font-bold px-3 py-1 rounded-full mt-1">
                  {data.data.topUsers[1].formattedScore}
                </p>
              </div>
            )}

            {data?.data?.topUsers?.length > 0 && (
              /* First place (larger) */
              <div className="flex flex-col items-center mx-3 -mt-6">
                <div className="w-24 h-24 bg-white rounded-full border-2 border-white relative">
                  <img
                    src={data.data.topUsers[0].image || defaultAvatar}
                    alt="First place"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.src = defaultAvatar;
                    }}
                  />
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 text-[#16956C] rounded-full flex items-center justify-center bg-white font-bold text-sm border-2 border-white">
                    1
                  </div>
                </div>
                <p className="text-white text-sm mt-1">
                  {data.data.topUsers[0].username}
                </p>
                <p className="bg-white text-[#16956C] text-xs font-bold px-3 py-1 rounded-full mt-1">
                  {data.data.topUsers[0].formattedScore}
                </p>
              </div>
            )}

            {data?.data?.topUsers?.length > 2 && (
              /* Third place */
              <div className="flex flex-col items-center mx-3">
                <div className="w-20 h-20 bg-white rounded-full border-2 border-white relative">
                  <img
                    src={data.data.topUsers[2].image || defaultAvatar}
                    alt="Third place"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.src = defaultAvatar;
                    }}
                  />
                  <div className="absolute -bottom-1 -left-1 w-7 h-7 text-[#16956C] rounded-full flex items-center justify-center bg-white font-bold text-xs border border-white">
                    3
                  </div>
                </div>
                <p className="text-white text-sm mt-1">
                  {data.data.topUsers[2].username}
                </p>
                <p className="bg-white text-[#16956C] text-xs font-bold px-3 py-1 rounded-full mt-1">
                  {data.data.topUsers[2].formattedScore}
                </p>
              </div>
            )}
          </div>

          {/* Leaderboard List */}
          <div className="flex-1 bg-white rounded-t-3xl px-4 pt-6 pb-20">
            {/* Total users count */}
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="text-sm text-gray-500">
                <span className="font-medium text-[#16956C]">
                  {data.data.totalUsers}
                </span>{" "}
                total users
              </div>
              <div className="text-xs text-gray-400">
                Last updated: {getFormattedDate()}
              </div>
            </div>

            <div className="space-y-2">
              {/* Other Users List */}
              {data?.data?.listUsers?.map((user, index) => {
                // Check if this is the current user
                const isCurrentUser =
                  data.data.userPosition &&
                  user._id === data.data.userPosition._id;

                return (
                  <div
                    key={user._id}
                    className={`flex items-center rounded-lg p-2 hover:bg-gray-50 ${
                      index > 0 ? "border-b border-gray-100 pb-3" : ""
                    } ${isCurrentUser ? "bg-gray-50" : ""}`}
                  >
                    <div className="w-5 text-gray-500 font-medium text-right mr-2">
                      {user.rank}
                      {isCurrentUser &&
                        data.data.userPosition.tiedWithCount > 0 && (
                          <span className="text-xs ml-0.5">*</span>
                        )}
                    </div>
                    <div className="flex items-center flex-1 ml-2">
                      <div
                        className={`w-8 h-8 bg-gray-200 rounded-full overflow-hidden mr-3 ${
                          isCurrentUser ? "border-2 border-[#16956C]" : ""
                        }`}
                      >
                        <img
                          src={user.image || defaultAvatar}
                          alt={user.username}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = defaultAvatar;
                          }}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isCurrentUser ? "text-[#16956C]" : ""
                        }`}
                      >
                        {user.username}
                        {isCurrentUser && " (You)"}
                      </span>
                    </div>
                    <div
                      className={`text-sm font-bold ${
                        isCurrentUser ? "text-[#16956C]" : "text-gray-700"
                      }`}
                    >
                      {user.formattedScore}
                    </div>
                  </div>
                );
              })}

              {/* Current User Position (if not in top lists) */}
              {data?.data?.userPosition &&
                !data.data.userPosition.inTopLeaderboard && (
                  <>
                    {/* Additional space showing a gap */}
                    <div className="h-4 border-t border-dashed border-gray-200 mt-2 pt-2"></div>

                    {/* User's position */}
                    <div className="flex items-center rounded-lg p-2 bg-gray-50">
                      <div className="w-5 text-gray-500 font-medium text-right mr-2">
                        {data.data.userPosition.rank}
                        {data.data.userPosition.tiedWithCount > 0 && (
                          <span className="text-xs ml-0.5">*</span>
                        )}
                      </div>
                      <div className="flex items-center flex-1 ml-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden mr-3 border-2 border-[#16956C]">
                          <img
                            src={data.data.userPosition.image || defaultAvatar}
                            alt="You"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = defaultAvatar;
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-[#16956C]">
                          {data.data.userPosition.username} (You)
                        </span>
                      </div>
                      <div className="text-sm font-bold text-[#16956C]">
                        {data.data.userPosition.formattedScore}
                      </div>
                    </div>

                    {data.data.userPosition.tiedWithCount > 0 && (
                      <div className="text-xs text-gray-500 text-center">
                        * Tied with {data.data.userPosition.tiedWithCount} other
                        {data.data.userPosition.tiedWithCount > 1 ? "s" : ""}
                      </div>
                    )}
                  </>
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
