import type { Employee } from "../../../types/employee";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";

interface EmployeeListProps {
  employees: Employee[];
  removingId: string | null;
  onRemove: (id: string) => void;
}

export const EmployeeList = ({ employees, removingId, onRemove }: EmployeeListProps) => {
  if (employees.length === 0) {
    return (
      <EmptyState
        title="No employees yet"
        description="Invite employees to help manage your store"
      />
    );
  }

  return (
    <div className="space-y-md">
      {employees.map((employee) => (
        <Card key={employee.id}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-strong text-ink">{employee.user.name}</p>
              <p className="text-caption text-ink-muted-80">{employee.user.email}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onRemove(employee.id)}
              isLoading={removingId === employee.id}
            >
              Remove
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
