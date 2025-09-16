"use client";
import React from "react";
import { motion } from "framer-motion";

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg";
}

export default function SecondaryButton({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
  size = "md",
}: SecondaryButtonProps) {

  // Size configurations
  const sizeConfig = {
    sm: {
      height: "h-8",
      minWidth: "min-w-[120px]",
      textSize: "text-xs",
      padding: "px-4",
      borderWidth: "border",
    },
    md: {
      height: "h-12",
      minWidth: "min-w-[180px]",
      textSize: "text-xs",
      padding: "px-6",
      borderWidth: "border-2",
    },
    lg: {
      height: "h-16",
      minWidth: "min-w-[240px]",
      textSize: "text-sm",
      padding: "px-8",
      borderWidth: "border-2",
    },
  };

  const config = sizeConfig[size];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden rounded-full ${config.height} ${config.minWidth} w-fit flex items-center justify-center ${config.borderWidth} border-brand-green bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      initial={{ backgroundColor: "transparent" }}
      whileHover={{
        backgroundColor: disabled ? "transparent" : "#4A6034"
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Button Text */}
      <motion.span
        className={`font-semibold ${config.textSize} ${config.padding} whitespace-nowrap`}
        initial={{ color: "#4A6034" }}
        whileHover={{ color: disabled ? "#4A6034" : "#FFFFFF" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}