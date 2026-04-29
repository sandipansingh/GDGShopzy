import type { ReactNode } from "react";
import { ErrorMessage } from "../ui/ErrorMessage";

interface ApiErrorStateProps {
  message: string;
  action?: ReactNode;
  className?: string;
}

export const ApiErrorState = ({ message, action, className = "" }: ApiErrorStateProps) => {
  return (
    <div className={className}>
      <ErrorMessage message={message} />
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
