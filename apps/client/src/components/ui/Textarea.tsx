import { TextareaHTMLAttributes, forwardRef } from "react";
import { FormField } from "../forms/FormField";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <FormField label={label} error={error} htmlFor={id}>
        <textarea
          id={id}
          ref={ref}
          className={`w-full px-lg py-sm text-body text-ink bg-canvas border border-hairline rounded-lg focus:outline-2 focus:outline-primary-focus resize-none ${
            error ? "border-red-500" : ""
          } ${className}`}
          rows={4}
          {...props}
        />
      </FormField>
    );
  },
);

Textarea.displayName = "Textarea";
