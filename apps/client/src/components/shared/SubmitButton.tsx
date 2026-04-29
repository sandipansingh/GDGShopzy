import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "../ui/Button";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting: boolean;
  children: ReactNode;
}

export const SubmitButton = ({ isSubmitting, children, ...props }: SubmitButtonProps) => {
  return (
    <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting} {...props}>
      {children}
    </Button>
  );
};
