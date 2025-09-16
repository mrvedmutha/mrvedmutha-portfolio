"use client";
import React from "react";

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
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group relative overflow-hidden rounded-full ${config.height} ${config.minWidth} w-fit flex items-center justify-center ${config.borderWidth} border-brand-green bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-green hover:text-white transition-all duration-300 ease-in-out ${className}`}
    >
      {/* Button Text */}
      <span
        className={`font-semibold ${config.textSize} ${config.padding} whitespace-nowrap text-brand-green group-hover:text-white transition-colors duration-300 ease-in-out`}
      >
        {children}
      </span>
    </button>
  );
}