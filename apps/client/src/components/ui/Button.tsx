import {
  ButtonHTMLAttributes,
  ReactElement,
  cloneElement,
  forwardRef,
  isValidElement,
} from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "dark" | "pearl";
  size?: "default" | "large" | "small" | "sm" | "lg";
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "default",
      isLoading,
      disabled,
      asChild = false,
      children,
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center gap-2 whitespace-nowrap border font-mono uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50";

    const variantStyles = {
      primary: "border-transparent bg-accent text-accent-foreground px-6",
      secondary: "border-foreground bg-transparent px-6 text-foreground",
      dark: "border-transparent bg-surface-tile-2 px-6 text-foreground",
      pearl: "border-border bg-card px-6 text-foreground",
    };

    const sizeStyles = {
      default: "min-h-12 py-3 text-button-utility tracking-[0.14em]",
      small: "min-h-10 py-2 text-caption-strong tracking-[0.14em]",
      sm: "min-h-10 py-2 text-caption-strong tracking-[0.14em]",
      large: "min-h-14 py-4 text-button-large tracking-[0.16em]",
      lg: "min-h-14 py-4 text-button-large tracking-[0.16em]",
    };

    const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ className?: string }>;

      return cloneElement(child, {
        className: `${classes} ${child.props.className ?? ""}`.trim(),
      });
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={classes}
        {...props}
      >
        {isLoading ? "Loading" : children}
      </button>
    );
  },
);

Button.displayName = "Button";
