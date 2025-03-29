import React from "react";
import { useNavigate } from "react-router-dom";
import { Motion } from "../components/Motion";
import { MotionButton } from "../components/MotionButton";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white p-5">
      <Motion animation="slideDown" delay={0.2}>
        <h1 className="text-2xl font-bold mb-4">Home Screen</h1>
      </Motion>

      <Motion animation="fadeIn" delay={0.4}>
        <p className="text-center mb-8">
          Welcome to The Pace App! Your study journey begins here.
        </p>
      </Motion>

      <MotionButton
        onClick={() => navigate("/get-started")}
        variant="primary"
        size="md"
        shape="rounded"
        delay={0.6}
      >
        Back to Onboarding
      </MotionButton>
    </div>
  );
};
