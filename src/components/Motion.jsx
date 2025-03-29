/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

// Animation presets for reuse across the app
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
  },
  slideDown: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
  },
  slideInLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  },
  slideInRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },
  pop: {
    initial: { scale: 0.5, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
    exit: { scale: 0.5, opacity: 0 },
  },
  staggeredContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

// Default transition settings
const defaultTransition = {
  duration: 0.4,
  ease: "easeInOut",
};

export const Motion = ({
  children,
  animation = "fadeIn",
  customAnimation = {},
  transition = {},
  delay = 0,
  className = "",
  ...props
}) => {
  // Get the predefined animation or use custom
  const animationPreset = animations[animation] || {};

  // Combine with any custom animations passed
  const combinedAnimation = {
    ...animationPreset,
    ...customAnimation,
  };

  // Add delay to transition
  const combinedTransition = {
    ...defaultTransition,
    ...transition,
    delay,
  };

  return (
    <motion.div
      initial={combinedAnimation.initial}
      animate={combinedAnimation.animate}
      exit={combinedAnimation.exit}
      transition={combinedTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
