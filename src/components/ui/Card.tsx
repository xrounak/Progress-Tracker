import React from "react";
import { cn } from "@/utils/cn";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "rounded-lg border border-border bg-card/60 shadow-soft backdrop-blur-md",
      className
    )}
    {...props}
  />
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div className={cn("p-4 sm:p-5", className)} {...props} />
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "flex items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-5",
      className
    )}
    {...props}
  />
);


