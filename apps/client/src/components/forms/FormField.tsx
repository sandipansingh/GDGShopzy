import type { ReactNode } from "react";

interface FormFieldProps {
  label?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}

export const FormField = ({ label, error, htmlFor, children }: FormFieldProps) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label
          htmlFor={htmlFor}
          className="block font-mono text-[0.75rem] font-medium uppercase tracking-[0.16em] text-muted-foreground"
        >
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-caption text-red-400">{error}</p>}
    </div>
  );
};
