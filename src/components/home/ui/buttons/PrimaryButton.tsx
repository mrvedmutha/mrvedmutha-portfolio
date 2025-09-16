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
}

export default function PrimaryButton({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}: PrimaryButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden rounded-full h-12 min-w-[180px] flex items-center justify-between bg-brand-yellow border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Green Background Section */}
      <motion.div
        className="absolute left-0 top-0 h-full bg-brand-green rounded-full flex items-center justify-start pl-4"
        initial={{ width: "70%" }}
        whileHover={{ width: disabled ? "70%" : "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Button Text */}
        <motion.span
          className="text-white font-semibold text-sm whitespace-nowrap"
          initial={{ x: 0 }}
          whileHover={{ x: disabled ? 0 : 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {children}
        </motion.span>
      </motion.div>

      {/* Arrow Circle */}
      <div className="absolute right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center z-10">
        <ArrowRight className="w-4 h-4 text-brand-green" />
      </div>
    </motion.button>
  );
}