import React from "react";
import { cn } from "@/utils/cn";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className
}) => {
  const sizeClasses = {
    sm: "h-3 w-3 border-2",
    md: "h-4 w-4 border-2",
    lg: "h-6 w-6 border-[3px]"
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-transparent border-accent",
        sizeClasses[size],
        className
      )}
      aria-label="Loading"
      role="status"
    />
  );
};

