import type { Order } from "../../../types/order";

interface OrderShippingCardProps {
  order: Order;
}

export const OrderShippingCard = ({ order }: OrderShippingCardProps) => {
  return (
    <div className="bg-canvas rounded-lg border border-hairline p-lg">
      <h2 className="text-tagline text-ink mb-lg">Shipping Address</h2>
      <div className="space-y-sm text-body text-ink">
        <p>{order.shippingName}</p>
        <p>{order.shippingPhone}</p>
        <p>{order.shippingLine1}</p>
        {order.shippingLine2 && <p>{order.shippingLine2}</p>}
        <p>
          {order.shippingCity}, {order.shippingState} {order.shippingZip}
        </p>
      </div>
    </div>
  );
};
