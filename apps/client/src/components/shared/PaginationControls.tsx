import { Button } from "../ui/Button";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const PaginationControls = ({
  page,
  totalPages,
  onPrevious,
  onNext,
}: PaginationControlsProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-6 border-t border-border pt-8">
      <Button variant="secondary" onClick={onPrevious} disabled={page === 1}>
        Previous
      </Button>
      <span className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Button variant="secondary" onClick={onNext} disabled={page === totalPages}>
        Next
      </Button>
    </div>
  );
};
