import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppErrorBoundary } from "./AppErrorBoundary";
import { ToastProvider } from "../components/toast/ToastProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppErrorBoundary>{children}</AppErrorBoundary>
      </ToastProvider>
    </BrowserRouter>
  );
};
