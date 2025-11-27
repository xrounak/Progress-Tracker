import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/utils/cn";
import { Spinner } from "@/components/ui/Spinner";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const base =
  "inline-flex items-center justify-center font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-accent text-accent-foreground hover:bg-emerald-500 shadow-soft shadow-emerald-500/40",
  outline:
    "border border-border bg-transparent hover:bg-muted text-foreground/90",
  ghost: "bg-transparent hover:bg-muted text-foreground/80"
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
  icon: "h-10 w-10"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      variant = "primary",
      size = "md",
      className,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || isLoading;
    
    return (
      <Comp
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Spinner size={size === "sm" ? "sm" : "md"} />
            <span className="opacity-70">{children}</span>
          </span>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";


