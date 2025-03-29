import React from "react";
import { motion } from "framer-motion";
import { Button } from "./Button";

// Animation for button hover and tap
const buttonAnimation = {
  whileHover: {
    scale: 1.05,
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  whileTap: {
    scale: 0.95,
  },
};

export const MotionButton = ({
  children,
  animation = "pop",
  delay = 0,
  variant = "primary",
  size = "md",
  shape = "rounded",
  className = "",
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay }}
      whileHover={buttonAnimation.whileHover}
      whileTap={buttonAnimation.whileTap}
    >
      <Button
        variant={variant}
        size={size}
        shape={shape}
        className={className}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};
