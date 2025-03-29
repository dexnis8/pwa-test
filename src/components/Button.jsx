import React from "react";

// Button variants
const VARIANTS = {
  primary: "bg-[#3DD7A1] hover:bg-[#2bc28c] text-white",
  secondary:
    "bg-white text-[#3DD7A1] hover:bg-gray-100 border border-[#3DD7A1]",
  white: "bg-white text-[#3DD7A1] hover:bg-gray-100",
};

// Button sizes
const SIZES = {
  sm: "py-2 px-4 text-sm",
  md: "py-3 px-6 text-base",
  lg: "py-4 px-8 text-lg",
  full: "py-4 px-6 text-lg w-full",
};

// Button shapes
const SHAPES = {
  rounded: "rounded-lg",
  pill: "rounded-full",
};

export const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  shape = "rounded",
  className = "",
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${SHAPES[shape]}
        font-medium
        transition-all
        duration-300
        cursor-pointer
        hover:shadow-md
        active:scale-[0.98]
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
