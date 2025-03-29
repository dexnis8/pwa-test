import React from "react";

export const MobileLayout = ({ children }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen relative overflow-auto">
        {children}
      </div>
    </div>
  );
};
