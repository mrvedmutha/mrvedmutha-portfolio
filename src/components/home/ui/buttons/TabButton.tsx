import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabButtonProps {
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12"
};

const iconSizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6"
};

export default function TabButton({
  onClick,
  size = "md",
  className
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full bg-brand-green flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg",
        sizeClasses[size],
        className
      )}
    >
      <ChevronRight
        className={cn(
          "text-brand-yellow",
          iconSizes[size]
        )}
      />
    </button>
  );
}