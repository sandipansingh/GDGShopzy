import type { Order } from "../../../types/order";
import { formatDate } from "../../../lib/format";
import { StatusBadge } from "../../../components/shared/StatusBadge";

interface OrderMetaCardProps {
  order: Order;
}

export const OrderMetaCard = ({ order }: OrderMetaCardProps) => {
  return (
    <div className="bg-canvas rounded-lg border border-hairline p-lg">
      <div className="flex items-center justify-between mb-lg">
        <h1 className="text-tagline text-ink">Order Details</h1>
        <StatusBadge status={order.status} />
      </div>
      <div className="space-y-md">
        <div>
          <p className="text-caption text-ink-muted-80">Order ID</p>
          <p className="text-body text-ink">{order.id}</p>
        </div>
        <div>
          <p className="text-caption text-ink-muted-80">Order Date</p>
          <p className="text-body text-ink">{formatDate(order.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};
