import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  meta?: ReactNode;
}

export const PageHeader = ({ title, description, action, meta }: PageHeaderProps) => {
  return (
    <div className="mb-xl flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
        <h1 className="text-display-lg text-ink">{title}</h1>
        {description && <p className="max-w-2xl text-body text-muted-foreground">{description}</p>}
      </div>
      <div className="flex flex-col items-start gap-3 md:items-end">
        {meta}
        {action}
      </div>
    </div>
  );
};
