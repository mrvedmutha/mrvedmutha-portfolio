"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface LinkButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  target?: "_blank" | "_self";
}

export default function LinkButton({
  children,
  href,
  onClick,
  disabled = false,
  className = "",
  size = "md",
  target = "_self",
}: LinkButtonProps) {

  // Size configurations
  const sizeConfig = {
    sm: {
      textSize: "text-sm",
      arrowSize: "w-3 h-3",
      gap: "gap-1",
    },
    md: {
      textSize: "text-base",
      arrowSize: "w-4 h-4",
      gap: "gap-2",
    },
    lg: {
      textSize: "text-lg",
      arrowSize: "w-5 h-5",
      gap: "gap-2",
    },
  };

  const config = sizeConfig[size];

  const handleClick = () => {
    if (disabled) return;

    if (href) {
      if (target === "_blank") {
        window.open(href, "_blank");
      } else {
        window.location.href = href;
      }
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      className={`group inline-flex items-center ${config.gap} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Link Text */}
      <div className="relative">
        <span className={`${config.textSize} font-semibold text-brand-green transition-colors duration-200`}>
          {children}
        </span>

        {/* Animated Underline */}
        <motion.div
          className="absolute left-0 bottom-0 h-0.5 bg-brand-green"
          initial={{ width: "0%" }}
          whileHover={{ width: disabled ? "0%" : "100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>

      {/* Yellow Arrow */}
      <motion.div
        initial={{ x: 0 }}
        whileHover={{ x: disabled ? 0 : 3 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <ArrowRight className={`${config.arrowSize} text-brand-yellow`} />
      </motion.div>
    </motion.button>
  );
}