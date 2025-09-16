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
      className={`relative overflow-hidden rounded-full h-16 min-w-[200px] flex items-center justify-between bg-brand-yellow border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Green Background Section */}
      <motion.div
        className="absolute left-0 top-0 h-full bg-brand-green rounded-full flex items-center justify-center"
        initial={{ width: "75%" }}
        whileHover={{ width: disabled ? "75%" : "85%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Button Text */}
        <motion.span
          className="text-white font-bold text-lg px-6 whitespace-nowrap"
          initial={{ x: 0 }}
          whileHover={{ x: disabled ? 0 : 10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {children}
        </motion.span>
      </motion.div>

      {/* Arrow Circle */}
      <motion.div
        className="absolute right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center z-10"
        initial={{ x: 0 }}
        whileHover={{ x: disabled ? 0 : -5 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <motion.div
          initial={{ x: 0 }}
          whileHover={{ x: disabled ? 0 : 2 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ArrowRight className="w-5 h-5 text-brand-green" />
        </motion.div>
      </motion.div>
    </motion.button>
  );
}