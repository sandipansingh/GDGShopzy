import { InputHTMLAttributes, forwardRef } from "react";
import { FormField } from "../forms/FormField";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <FormField label={label} error={error} htmlFor={id}>
        <input
          id={id}
          ref={ref}
          className={`h-12 w-full border bg-input px-4 text-base text-foreground placeholder:text-muted-foreground md:h-14 ${
            error ? "border-red-500" : "border-border focus:border-accent"
          } ${className}`}
          {...props}
        />
      </FormField>
    );
  },
);

Input.displayName = "Input";
