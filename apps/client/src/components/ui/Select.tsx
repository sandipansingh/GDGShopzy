import { type ReactNode, type SelectHTMLAttributes, forwardRef } from "react";
import { FormField } from "../forms/FormField";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  /** Convenience prop — renders <option> elements automatically */
  options?: SelectOption[];
  children?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, children, className = "", id, required, ...props }, ref) => {
    const errorId = id && error ? `${id}-error` : undefined;
    const hintId = id && hint && !error ? `${id}-hint` : undefined;
    const describedBy = errorId ?? hintId;

    return (
      <FormField label={label} error={error} hint={hint} htmlFor={id} required={required}>
        {/* Wrapper provides the custom chevron without a JS dependency */}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={[
              "h-12 w-full appearance-none border bg-input pl-4 pr-10 text-base text-foreground",
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
          >
            {options
              ? options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              : children}
          </select>

          {/* Custom chevron icon */}
          <span
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </FormField>
    );
  },
);

Select.displayName = "Select";
