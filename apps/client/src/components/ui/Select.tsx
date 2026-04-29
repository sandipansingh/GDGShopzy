import { ReactNode, SelectHTMLAttributes, forwardRef } from "react";
import { FormField } from "../forms/FormField";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
  children?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, children, className = "", id, ...props }, ref) => {
    return (
      <FormField label={label} error={error} htmlFor={id}>
        <select
          id={id}
          ref={ref}
          className={`h-12 w-full border bg-input px-4 text-base text-foreground md:h-14 ${
            error ? "border-red-500" : "border-border focus:border-accent"
          } ${className}`}
          {...props}
        >
          {options
            ? options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : children}
        </select>
      </FormField>
    );
  },
);

Select.displayName = "Select";
