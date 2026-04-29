import { StatusBadge } from "../../../components/shared/StatusBadge";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { ORDER_STATUS_OPTIONS } from "../../../lib/orders";
import type { OrderStatus } from "../../../types/order";

interface OrderStatusCardProps {
  currentStatus: OrderStatus;
  isUpdating: boolean;
  nextStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
  onSubmit: () => void;
}

export const OrderStatusCard = ({
  currentStatus,
  isUpdating,
  nextStatus,
  onStatusChange,
  onSubmit,
}: OrderStatusCardProps) => {
  return (
    <div className="rounded-lg border border-hairline bg-canvas p-lg">
      <h2 className="mb-lg text-tagline text-ink">Order Status</h2>
      <div className="space-y-md">
        <div>
          <p className="mb-sm text-caption text-ink-muted-80">Current Status</p>
          <StatusBadge status={currentStatus} />
        </div>
        <Select
          label="Update Status"
          value={nextStatus}
          onChange={(event) => onStatusChange(event.target.value as OrderStatus)}
        >
          {ORDER_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Button
          variant="primary"
          className="w-full"
          onClick={onSubmit}
          isLoading={isUpdating}
          disabled={nextStatus === currentStatus}
        >
          Update Status
        </Button>
      </div>
    </div>
  );
};
