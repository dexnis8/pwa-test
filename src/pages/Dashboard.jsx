import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectPersonalInfo } from "../redux/slices/profileSlice";

const Dashboard = () => {
  const personalInfo = useSelector(selectPersonalInfo);
  const name = personalInfo.fullName?.split(" ")[0] || "User";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main content */}
      <div className="flex-1 p-6">
        <h1 className="text-[#16956C] text-2xl font-bold mb-1">Hi, {name}</h1>
        <p className="text-gray-700 text-base mb-6">Next Live Quiz</p>

        {/* Quiz card */}
        <div className="bg-[#16956C] rounded-xl p-5 mb-6 text-white">
          <h2 className="text-xl font-bold mb-2">SATURDAY LIVE QUIZ</h2>
          <p className="text-sm mb-3">Entry: 10 hours on-screen practice</p>

          <div className="flex items-center mb-3">
            <div className="flex items-center mr-6">
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 2V6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 2V6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 10H21"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>23rd November 2021</span>
            </div>
          </div>

          <div className="flex items-center mb-3">
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 6V12L16 14"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>9:00pm</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center bg-white/20 rounded-lg px-4 py-2">
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 6V12L8 14"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 11C20 15.4183 16.4183 19 12 19C7.58172 19 4 15.4183 4 11C4 6.58172 7.58172 3 12 3C16.4183 3 20 6.58172 20 11Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-bold">13:05:00</span>
            </div>

            <div className="w-12 h-12 bg-[#4CB5F9] rounded-md flex items-center justify-center border-2 border-white">
              <span className="text-2xl font-bold">?</span>
            </div>
          </div>
        </div>

        {/* Practice button */}
        <Link
          to="/practice"
          className="block bg-[#1B7A93] hover:bg-[#166A80] text-white font-bold py-4 px-6 rounded-lg mb-6 transition-colors"
        >
          <div className="flex items-center justify-center">
            <svg
              className="w-6 h-6 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="uppercase text-lg">PRACTICE NOW</span>
          </div>
        </Link>

        {/* Referral link */}
        <div className="flex items-center bg-gray-100 p-4 rounded-lg">
          <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center mr-3">
            <span className="text-orange-500">👥</span>
          </div>
          <span className="text-gray-600">Refer your friends</span>
        </div>

        {/* Ad banner */}
        <div className="mt-6 bg-[#14213D] text-white p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="uppercase text-sm">Discover flat</p>
            <p className="uppercase text-lg font-bold">Bed luxury</p>
          </div>
          <div className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">
            GET YOUR SEAT
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex justify-around items-center border-t border-gray-200 py-3 bg-white">
        <Link
          to="/dashboard"
          className="flex flex-col items-center text-[#16956C]"
        >
          <svg
            className="w-6 h-6 mb-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="currentColor"
              fillOpacity="0.2"
            />
          </svg>
          <span className="text-xs">Home</span>
        </Link>
        <Link
          to="/leaderboard"
          className="flex flex-col items-center text-gray-500"
        >
          <svg
            className="w-6 h-6 mb-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xs">Leaderboard</span>
        </Link>
        <Link
          to="/notifications"
          className="flex flex-col items-center text-gray-500"
        >
          <svg
            className="w-6 h-6 mb-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xs">Notifications</span>
        </Link>
        <Link
          to="/profile"
          className="flex flex-col items-center text-gray-500"
        >
          <svg
            className="w-6 h-6 mb-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
