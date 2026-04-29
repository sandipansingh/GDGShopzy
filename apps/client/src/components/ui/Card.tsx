import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "parchment";
}

export const Card = ({ variant = "default", className = "", children, ...props }: CardProps) => {
  const variantStyles = {
    default: "border border-border bg-card text-card-foreground",
    parchment: "border border-border bg-muted text-foreground",
  };

  return (
    <div className={`p-6 md:p-8 overflow-hidden ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
