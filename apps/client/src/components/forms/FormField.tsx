import type { ReactNode } from "react";

interface FormFieldProps {

  label?: string;

  error?: string;

  hint?: string;
 
  htmlFor?: string;

  required?: boolean;
  children: ReactNode;
}


export const FormField = ({
  label,
  error,
  hint,
  htmlFor,
  required,
  children,
}: FormFieldProps) => {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;
  const hintId = htmlFor && hint && !error ? `${htmlFor}-hint` : undefined;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={htmlFor}
          className="block font-mono text-[0.75rem] font-medium uppercase tracking-[0.16em] text-muted-foreground"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-400" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {children}

      {error ? (
        <p id={errorId} role="alert" className="text-[0.75rem] leading-snug text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-[0.75rem] leading-snug text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
};
