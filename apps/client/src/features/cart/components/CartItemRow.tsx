import type { CartItem } from "../../../types/cart";
import { formatMoney } from "../../../lib/format";
import { Button } from "../../../components/ui/Button";
import { ProductImage } from "../../../components/shared/ProductImage";

interface CartItemRowProps {
  item: CartItem;
  isUpdating: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export const CartItemRow = ({
  item,
  isUpdating,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemRowProps) => {
  const lineTotal = item.lineTotal ?? Number(item.product.price) * item.quantity;
  const unitPrice = Number(item.product.price);

  return (
    <div className="bg-canvas rounded-lg border border-hairline p-lg flex gap-lg">
      <ProductImage
        src={item.product.imageUrl}
        alt={item.product.name}
        className="h-24 w-24 flex-shrink-0 rounded-md bg-canvas-parchment"
        emptyLabel="No image"
      />
      <div className="flex-1">
        <h3 className="text-body-strong text-ink mb-sm">{item.product.name}</h3>
        <p className="text-body text-ink-muted-80 mb-md">
          {formatMoney(unitPrice)} × {item.quantity}
        </p>
        <div className="flex items-center gap-md">
          <button
            type="button"
            onClick={onDecrease}
            disabled={item.quantity <= 1 || isUpdating}
            className="w-8 h-8 rounded-md border border-hairline flex items-center justify-center text-ink disabled:opacity-50 hover:bg-canvas-parchment transition-colors"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="text-body text-ink w-12 text-center font-medium">{item.quantity}</span>
          <button
            type="button"
            onClick={onIncrease}
            disabled={item.quantity >= item.product.stock || isUpdating}
            className="w-8 h-8 rounded-md border border-hairline flex items-center justify-center text-ink disabled:opacity-50 hover:bg-canvas-parchment transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
          {item.product.stock <= 5 && (
            <span className="text-caption text-ink-muted-80 ml-sm">
              Only {item.product.stock} left
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <p className="text-body-strong text-ink font-semibold">{formatMoney(lineTotal)}</p>
        <Button variant="secondary" size="sm" onClick={onRemove} isLoading={isUpdating}>
          Remove
        </Button>
      </div>
    </div>
  );
};
