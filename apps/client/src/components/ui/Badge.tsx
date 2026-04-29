import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
}

export const Badge = ({ variant = "default", className = "", children, ...props }: BadgeProps) => {
  const variantStyles = {
    default: "border-border text-foreground",
    success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    warning: "border-accent/40 bg-accent/10 text-accent",
    error: "border-red-500/40 bg-red-500/10 text-red-300",
    info: "border-foreground/20 bg-foreground/5 text-foreground/80",
  };

  return (
    <span
      className={`inline-flex items-center border px-3 py-1 font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
