/**
 * Button — Design system button component
 */

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "key-action" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-sm",
  secondary:
    "bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors",
  ghost:
    "text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors",
  "key-action":
    "bg-tertiary-fixed text-on-tertiary-fixed hover:brightness-105 transition-all shadow-md shadow-tertiary-fixed/20 font-bold",
  danger: "bg-error text-on-error hover:opacity-90 transition-opacity",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2 text-sm rounded-xl",
  lg: "px-8 py-3 text-base rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-label font-semibold tracking-tight",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-[0.97] transition-transform",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          icon
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
