interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-start justify-center gap-4 border-y border-border py-20">
      <span className="section-label">Nothing here yet</span>
      <h3 className="text-display-md">{title}</h3>
      {description && (
        <p className="max-w-[42rem] text-body text-muted-foreground">{description}</p>
      )}
      {action}
    </div>
  );
};
