import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Motion } from "../../components/Motion";

export const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      {/* Header with tabs */}
      <div className="p-6 pb-4">
        <Motion animation="fadeIn" delay={0.1}>
          <h1 className="text-[#4B4D52] font-medium mb-5 text-lg font-coolvetica">
            Welcome to The Pace App
          </h1>
        </Motion>

        <div className="flex space-x-12">
          <NavLink
            to="/auth/signup"
            className={({ isActive }) =>
              `text-xl font-medium transition-colors ${
                isActive
                  ? "text-[#16956C] border-b-2 border-[#16956C] pb-1"
                  : "text-gray-400"
              }`
            }
          >
            Sign up
          </NavLink>

          <NavLink
            to="/auth/signin"
            className={({ isActive }) =>
              `text-xl font-medium transition-colors ${
                isActive
                  ? "text-[#16956C] border-b-2 border-[#16956C] pb-1"
                  : "text-gray-400"
              }`
            }
          >
            Sign in
          </NavLink>
        </div>
      </div>

      {/* Main content - nested routes will render here */}
      <div className="flex-1 bg-[#16956C] rounded-t-3xl p-6">
        <Motion
          key={location.pathname}
          animation="fadeIn"
          delay={0.2}
          className="h-full"
        >
          <Outlet />
        </Motion>
      </div>
    </div>
  );
};
