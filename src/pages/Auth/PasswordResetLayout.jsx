import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Motion } from "../../components/Motion";

export const PasswordResetLayout = () => {
  const location = useLocation();

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      {/* Header without tabs */}
      <div className="p-6 pb-4">
        <Motion animation="fadeIn" delay={0.1}>
          <h1 className="text-[#4B4D52] font-bold text-center text-2xl font-coolvetica">
            Account Recovery
          </h1>
        </Motion>
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
