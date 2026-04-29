import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/Card";

interface DashboardSectionProps {
  children: ReactNode;
  emptyMessage: string;
  hasItems: boolean;
  title: string;
  to: string;
}

export const DashboardSection = ({
  children,
  emptyMessage,
  hasItems,
  title,
  to,
}: DashboardSectionProps) => {
  return (
    <div>
      <div className="mb-lg flex items-center justify-between">
        <h2 className="text-tagline text-ink">{title}</h2>
        <Link to={to} className="text-caption text-primary hover:underline">
          View All
        </Link>
      </div>
      {hasItems ? (
        children
      ) : (
        <Card>
          <p className="text-body text-ink-muted-80">{emptyMessage}</p>
        </Card>
      )}
    </div>
  );
};
