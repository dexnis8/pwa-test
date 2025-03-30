import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const DashboardLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main content area */}
      <div className="flex-1 pb-16">
        <Outlet />
      </div>

      {/* Bottom navigation - restricted to max-w-md to match MobileLayout */}
      <div className="fixed bottom-0 w-full max-w-md mx-auto left-1/2 -translate-x-1/2 flex justify-around items-center border-t border-gray-200 py-3 bg-white">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center ${
            path === "/dashboard" ? "text-[#16956C]" : "text-gray-500"
          }`}
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
              fill={path === "/dashboard" ? "currentColor" : "none"}
              fillOpacity={path === "/dashboard" ? "0.2" : "0"}
            />
          </svg>
          <span className="text-xs">Home</span>
        </Link>
        <Link
          to="/leaderboard"
          className={`flex flex-col items-center ${
            path === "/leaderboard" ? "text-[#16956C]" : "text-gray-500"
          }`}
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
              fill={path === "/leaderboard" ? "currentColor" : "none"}
              fillOpacity={path === "/leaderboard" ? "0.2" : "0"}
            />
            <path
              d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={path === "/leaderboard" ? "currentColor" : "none"}
              fillOpacity={path === "/leaderboard" ? "0.2" : "0"}
            />
          </svg>
          <span className="text-xs">Leaderboard</span>
        </Link>
        <Link
          to="/notifications"
          className={`flex flex-col items-center ${
            path === "/notifications" ? "text-[#16956C]" : "text-gray-500"
          }`}
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
              fill={path === "/notifications" ? "currentColor" : "none"}
              fillOpacity={path === "/notifications" ? "0.2" : "0"}
            />
            <path
              d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={path === "/notifications" ? "currentColor" : "none"}
              fillOpacity={path === "/notifications" ? "0.2" : "0"}
            />
          </svg>
          <span className="text-xs">Notifications</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center ${
            path === "/profile" ? "text-[#16956C]" : "text-gray-500"
          }`}
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
              fill={path === "/profile" ? "currentColor" : "none"}
              fillOpacity={path === "/profile" ? "0.2" : "0"}
            />
            <path
              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={path === "/profile" ? "currentColor" : "none"}
              fillOpacity={path === "/profile" ? "0.2" : "0"}
            />
          </svg>
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default DashboardLayout;
