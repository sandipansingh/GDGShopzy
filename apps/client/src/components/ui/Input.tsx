import { type InputHTMLAttributes, forwardRef } from "react";
import { FormField } from "../forms/FormField";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, required, ...props }, ref) => {
    const errorId = id && error ? `${id}-error` : undefined;
    const hintId = id && hint && !error ? `${id}-hint` : undefined;
    const describedBy = errorId ?? hintId;

    return (
      <FormField label={label} error={error} hint={hint} htmlFor={id} required={required}>
        <input
          id={id}
          ref={ref}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={[
            "h-12 w-full border bg-input px-4 text-base text-foreground",
            "placeholder:text-muted-foreground",
            "focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors duration-150",
            "md:h-14",
            error
              ? "border-red-500 focus:border-red-500"
              : "border-border focus:border-accent",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
      </FormField>
    );
  },
);

Input.displayName = "Input";
