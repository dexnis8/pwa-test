/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import { Motion } from "../components/Motion";
import { MotionButton } from "../components/MotionButton";
import { motion } from "framer-motion";

export const OnBoarding = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-b from-[#3DD7A1] to-[#1DA57F] text-white p-0 relative">
      {/* Main content container */}
      <div className="flex flex-col justify-between h-full w-full">
        {/* Illustration and text section */}
        <div className="flex-1 p-6 flex flex-col">
          {/* Illustration */}
          <Motion
            animation="slideInRight"
            delay={0.2}
            className="flex justify-center items-center mb-8 mt-6"
          >
            <img
              src="/images/get-started.png"
              alt="Pace App Illustration"
              className="w-64 h-auto"
            />
          </Motion>

          {/* Text content */}
          <Motion animation="slideInLeft" delay={0.5} className="text-left">
            <h1 className="text-[40px] font-bold mb-4 font-coolvetica leading-tight">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                The Pace App makes studying <br />
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                FUN & also <br />
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                REWARD you
              </motion.span>
            </h1>
          </Motion>
        </div>

        {/* Bottom button section */}
        <Motion animation="slideUp" delay={1.3} className="p-6 pb-10">
          <MotionButton
            onClick={() => navigate("/home")}
            variant="white"
            size="full"
            shape="pill"
          >
            Get started
          </MotionButton>
        </Motion>
      </div>
    </div>
  );
};
