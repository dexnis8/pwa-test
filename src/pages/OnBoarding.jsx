import React from "react";

export const OnBoarding = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white text-gray-800 p-5">
      <h1 className="text-2xl font-bold mb-4 font-coolvetica">
        Welcome to The Pace App
      </h1>
      <p className="text-center mb-8">
        Get started with your personal pace management journey
      </p>
      <button className="bg-[#3DD7A1] hover:bg-[#1DA57F] text-white font-medium py-2 px-6 rounded-lg transition-colors">
        Get Started
      </button>
    </div>
  );
};
