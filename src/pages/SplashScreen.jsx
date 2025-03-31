/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Motion } from "../components/Motion";
import tokenManager from "../lib/tokenManager";

export const SplashScreen = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Set loaded after a short delay for initial animation
    const loadTimer = setTimeout(() => {
      setLoaded(true);
    }, 300);

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

    // Auto-navigate based on authentication status after 3 seconds
    const navigateTimer = setTimeout(() => {
      const accessToken = tokenManager.getAccessToken();
      const isExpired = tokenManager.isTokenExpired();

      if (accessToken && !isExpired) {
        // User is logged in and token is valid - go to dashboard
        navigate("/dashboard");
      } else {
        // User is not logged in or token is expired - go to get-started
        navigate("/get-started");
      }
    }, 3000);

    return () => {
      clearTimeout(navigateTimer);
      clearTimeout(loadTimer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#2ACB8F] to-[#16956C] text-white text-center p-5 relative overflow-hidden">
      <AnimatePresence>
        {loaded && (
          <>
            <Motion animation="pop" className="mb-4">
              <img
                src="/images/logo.png"
                alt="Pace App Logo"
                className="w-20 h-20"
              />
            </Motion>

            <Motion animation="fadeIn" delay={0.3} className="mb-8">
              <h1 className="text-2xl font-medium mt-0 md:text-3xl">
                The Pace App
              </h1>
            </Motion>
          </>
        )}
      </AnimatePresence>

      {/* Loading bar */}
      <Motion
        animation="slideUp"
        delay={0.5}
        className="absolute bottom-16 w-4/5 mx-auto"
      >
        <div className="w-full bg-white/20 rounded-full h-2.5 mb-2 overflow-hidden">
          <motion.div
            className="bg-white h-2.5 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>
        <p className="text-sm text-white/70">Loading...</p>
      </Motion>
    </div>
  );
};
