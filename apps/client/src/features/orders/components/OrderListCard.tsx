import { Link } from "react-router-dom";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { formatDate, formatMoney } from "../../../lib/format";
import type { Order } from "../../../types/order";

interface OrderListCardProps {
  order: Order;
  to: string;
  paymentLabel?: string;
}

export const OrderListCard = ({ order, to, paymentLabel }: OrderListCardProps) => {
  return (
    <Link to={to} className="block rounded-lg border border-hairline bg-canvas p-lg">
      <div className="mb-md flex items-start justify-between">
        <div>
          <p className="text-caption text-ink-muted-80">Order ID</p>
          <p className="text-body-strong text-ink">{order.id}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mb-md grid grid-cols-1 gap-md md:grid-cols-4">
        <div>
          <p className="text-caption text-ink-muted-80">Date</p>
          <p className="text-body text-ink">{formatDate(order.createdAt)}</p>
        </div>
        <div>
          <p className="text-caption text-ink-muted-80">Items</p>
          <p className="text-body text-ink">{order.items.length}</p>
        </div>
        <div>
          <p className="text-caption text-ink-muted-80">Total</p>
          <p className="text-body-strong text-ink">{formatMoney(order.totalAmount)}</p>
        </div>
        {paymentLabel && (
          <div>
            <p className="text-caption text-ink-muted-80">Payment</p>
            <p className="text-body text-ink">{paymentLabel}</p>
          </div>
        )}
      </div>

      <div className="text-caption text-primary">View Details →</div>
    </Link>
  );
};
