import React, { useState } from "react";

// Sample leaderboard data
const leaderboardData = [
  { id: 1, rank: 1, name: "Habeeblai", amount: "PT 340,135" },
  { id: 2, rank: 2, name: "Adekunle", amount: "PT 120,035" },
  { id: 3, rank: 3, name: "Olujacobs", amount: "PT 80,135" },
  { id: 4, rank: 4, name: "Oluwole23", amount: "PT 70,900" },
  { id: 5, rank: 5, name: "Bamide_starboy", amount: "PT 69,100" },
  { id: 6, rank: 6, name: "Young_Engr", amount: "PT 65,358" },
  { id: 7, rank: 7, name: "KIT_cHEM", amount: "PT 62,501" },
  { id: 8, rank: 8, name: "Pashanof2", amount: "PT 58,350" },
  { id: 9, rank: 9, name: "Profkay01", amount: "PT 55,012" },
  { id: 10, rank: 10, name: "SAckool", amount: "PT 55,658" },
  { id: 11, rank: 11, name: "Bamidele_Sam", amount: "PT 70,900" },
  { id: 12, rank: 12, name: "Jide08221", amount: "PT 12,907" },
];

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("earnings");

  // Generate avatar URL using UI Avatars service
  const getAvatarUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random&color=fff&size=150`;
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
                ? "bg-[#16956C]  text-white"
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

      {/* Top 3 Users */}
      <div className="px-6 flex justify-center mb-4 relative mt-5">
        {/* Second place */}
        <div className="flex flex-col items-center mx-3">
          <div className="w-16 h-16 bg-white rounded-full border-2 border-white relative">
            <img
              src={getAvatarUrl(leaderboardData[1].name)}
              alt="Second place"
              className="w-full h-full object-cover rounded-full"
            />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#16956C] font-bold text-xs border border-white">
              2
            </div>
          </div>
          <p className="text-white text-sm mt-1">{leaderboardData[1].name}</p>
          <p className="bg-white text-[#16956C] text-xs font-bold px-3 py-1 rounded-full mt-1">
            {leaderboardData[1].amount}
          </p>
        </div>

        {/* First place (larger) */}
        <div className="flex flex-col items-center mx-3 -mt-4">
          <div className="w-20 h-20 bg-white rounded-full border-2 border-white relative">
            <img
              src={getAvatarUrl(leaderboardData[0].name)}
              alt="First place"
              className="w-full h-full object-cover rounded-full"
            />
            <div className="absolute -bottom-1 -left-1 w-7 h-7 text-[#16956C] rounded-full flex items-center justify-center bg-white font-bold text-xs border-2 border-white">
              1
            </div>
          </div>
          <p className="text-white text-sm mt-1">{leaderboardData[0].name}</p>
          <p className="bg-white text-[#16956C] text-xs font-bold px-3 py-1 rounded-full mt-1">
            {leaderboardData[0].amount}
          </p>
        </div>

        {/* Third place */}
        <div className="flex flex-col items-center mx-3">
          <div className="w-16 h-16 bg-white rounded-full border-2 border-white relative">
            <img
              src={getAvatarUrl(leaderboardData[2].name)}
              alt="Third place"
              className="w-full h-full object-cover rounded-full"
            />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 text-[#16956C] rounded-full flex items-center justify-center bg-white font-bold text-xs border border-white">
              3
            </div>
          </div>
          <p className="text-white text-sm mt-1">{leaderboardData[2].name}</p>
          <p className="bg-white text-[#16956C] text-xs font-bold px-3 py-1 rounded-full mt-1">
            {leaderboardData[2].amount}
          </p>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 bg-white rounded-t-3xl px-4 pt-6 pb-20">
        {/* Total users count */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="text-sm text-gray-500">
            <span className="font-medium text-[#16956C]">
              {leaderboardData.length}
            </span>{" "}
            total users
          </div>
          <div className="text-xs text-gray-400">Last updated: Today</div>
        </div>

        <div className="space-y-2">
          {leaderboardData.slice(3, 11).map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center rounded-lg p-2 hover:bg-gray-50 ${
                index > 0 ? "border-b border-gray-100 pb-3" : ""
              }`}
            >
              <div className="w-5 text-gray-500 font-medium text-right mr-2">
                {user.rank}
              </div>
              <div className="flex items-center flex-1 ml-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden mr-3">
                  <img
                    src={getAvatarUrl(user.name)}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <div className="text-sm font-bold text-gray-700">
                {user.amount}
              </div>
            </div>
          ))}

          {/* Additional space showing a gap */}
          <div className="h-4"></div>

          {/* Last position (26th) */}
          <div className="flex items-center rounded-lg p-2 hover:bg-gray-50">
            <div className="w-5 text-gray-500 font-medium text-right mr-2">
              12
            </div>
            <div className="flex items-center flex-1 ml-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden mr-3">
                <img
                  src={getAvatarUrl("Jide08221")}
                  alt="Jide08221"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium">Jide08221</span>
            </div>
            <div className="text-sm font-bold text-gray-700">N12,907</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
