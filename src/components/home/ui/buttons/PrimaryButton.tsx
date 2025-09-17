"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "reversed";
}

export default function PrimaryButton({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
  size = "md",
  variant = "default",
}: PrimaryButtonProps) {

  // Size configurations
  const sizeConfig = {
    sm: {
      height: "h-8",
      minWidth: "min-w-[120px]",
      textSize: "text-xs",
      arrowSize: "w-5 h-5",
      arrowIcon: "w-3 h-3",
      padding: "pl-3",
    },
    md: {
      height: "h-12",
      minWidth: "min-w-[180px]",
      textSize: "text-xs",
      arrowSize: "w-8 h-8",
      arrowIcon: "w-4 h-4",
      padding: "pl-4",
    },
    lg: {
      height: "h-16",
      minWidth: "min-w-[240px]",
      textSize: "text-sm",
      arrowSize: "w-12 h-12",
      arrowIcon: "w-5 h-5",
      padding: "pl-6",
    },
  };

  const config = sizeConfig[size];

  // Color configurations based on variant
  const isReversed = variant === "reversed";
  const bgColor = isReversed ? "bg-white" : "bg-brand-yellow";
  const textBgColor = isReversed ? "bg-brand-yellow" : "bg-brand-green";
  const textColor = isReversed ? "text-brand-green" : "text-white";
  const arrowBgColor = isReversed ? "bg-brand-green" : "bg-white";
  const arrowColor = isReversed ? "text-brand-yellow" : "text-brand-green";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden rounded-full ${config.height} ${config.minWidth} w-fit flex items-center justify-between ${bgColor} border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {/* Text Background Section */}
      <motion.div
        className={`absolute left-0 top-0 h-full ${textBgColor} rounded-full flex items-center justify-start ${config.padding}`}
        initial={{ width: "70%" }}
        whileHover={{ width: disabled ? "70%" : "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Button Text */}
        <span className={`${textColor} font-semibold ${config.textSize} whitespace-nowrap`}>
          {children}
        </span>
      </motion.div>

      {/* Arrow Circle */}
      <div className={`absolute right-2 ${config.arrowSize} ${arrowBgColor} rounded-full flex items-center justify-center z-10`}>
        <ArrowRight className={`${config.arrowIcon} ${arrowColor}`} />
      </div>
    </motion.button>
  );
}