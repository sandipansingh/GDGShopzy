import type { OrderItem } from "../../../types/order";
import { formatMoney } from "../../../lib/format";
import { ProductImage } from "../../../components/shared/ProductImage";

interface OrderItemsListProps {
  items: OrderItem[];
}

export const OrderItemsList = ({ items }: OrderItemsListProps) => {
  return (
    <div className="bg-canvas rounded-lg border border-hairline p-lg">
      <h2 className="text-tagline text-ink mb-lg">Items</h2>
      <div className="space-y-md">
        {items.map((item) => (
          <div key={item.id} className="flex gap-md border-b border-hairline pb-md last:border-0">
            <ProductImage
              src={item.product.imageUrl}
              alt={item.product.name}
              className="h-16 w-16 flex-shrink-0 rounded-md bg-canvas-parchment"
            />
            <div className="flex-1">
              <p className="text-body-strong text-ink">{item.product.name}</p>
              <p className="text-caption text-ink-muted-80">Quantity: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="text-body text-ink">{formatMoney(item.unitPrice)}</p>
              <p className="text-caption text-ink-muted-80">
                {formatMoney(item.unitPrice * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
