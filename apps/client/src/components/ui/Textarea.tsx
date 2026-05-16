import { type TextareaHTMLAttributes, forwardRef } from "react";
import { FormField } from "../forms/FormField";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", id, required, rows = 4, ...props }, ref) => {
    const errorId = id && error ? `${id}-error` : undefined;
    const hintId = id && hint && !error ? `${id}-hint` : undefined;
    const describedBy = errorId ?? hintId;

    return (
      <FormField label={label} error={error} hint={hint} htmlFor={id} required={required}>
        <textarea
          id={id}
          ref={ref}
          rows={rows}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={[
            "w-full border bg-input px-4 py-3 text-base text-foreground",
            "placeholder:text-muted-foreground",
            "focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-none transition-colors duration-150",
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

Textarea.displayName = "Textarea";
