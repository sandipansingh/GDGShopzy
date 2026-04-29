import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-accent">
            <span className="font-display text-3xl font-bold text-accent-foreground">G</span>
          </div>
          <h1 className="mb-2 text-display-md">{title}</h1>
          {subtitle && <p className="text-body text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="rounded-lg border border-border bg-card p-8 shadow-lg">{children}</div>
      </div>
    </div>
  );
};
