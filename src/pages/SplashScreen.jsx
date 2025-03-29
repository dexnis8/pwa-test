import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SplashScreen = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 3.33; // ~30 steps to reach 100% in 3 seconds
      });
    }, 100);

    // Auto-navigate to onboarding after 3 seconds
    const timer = setTimeout(() => {
      navigate("/get-started");
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#3DD7A1] to-[#1DA57F] text-white text-center p-5 relative">
      <div className="mb-4">
        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-5xl font-bold text-white shadow-md">
          <span>?</span>
        </div>
      </div>
      <h1 className="text-2xl font-medium mt-0 md:text-3xl">The Pace App</h1>

      {/* Loading bar */}
      <div className="absolute bottom-16 w-4/5 mx-auto">
        <div className="w-full bg-white/20 rounded-full h-2.5 mb-2">
          <div
            className="bg-white h-2.5 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-white/70">Loading...</p>
      </div>
    </div>
  );
};
