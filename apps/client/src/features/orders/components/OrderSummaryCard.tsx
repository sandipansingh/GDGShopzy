import type { Order } from "../../../types/order";
import { formatMoney } from "../../../lib/format";
import { StatusBadge } from "../../../components/shared/StatusBadge";

interface OrderSummaryCardProps {
  order: Order;
}

export const OrderSummaryCard = ({ order }: OrderSummaryCardProps) => {
  return (
    <div className="bg-canvas rounded-lg border border-hairline p-lg">
      <h2 className="text-tagline text-ink mb-lg">Order Summary</h2>
      <div className="space-y-md">
        <div className="flex justify-between text-body text-ink">
          <span>Payment</span>
          <span>{order.paymentMethod}</span>
        </div>
        <div className="flex justify-between text-body text-ink">
          <span>Status</span>
          <StatusBadge status={order.status} />
        </div>
        <div className="border-t border-hairline pt-md">
          <div className="flex justify-between text-lead text-ink">
            <span>Total</span>
            <span>{formatMoney(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
