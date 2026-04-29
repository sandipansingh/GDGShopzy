import type { Cart } from "../../../types/cart";
import { formatMoneyParts } from "../../../lib/format";
import { Button } from "../../../components/ui/Button";

interface CartSummaryCardProps {
  cart: Cart;
  onCheckout: () => void;
}

export const CartSummaryCard = ({ cart, onCheckout }: CartSummaryCardProps) => {
  const subtotal = cart.totalAmount ?? 0;
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const { whole: subtotalWhole, decimal: subtotalDecimal } = formatMoneyParts(subtotal);
  const { whole: totalWhole, decimal: totalDecimal } = formatMoneyParts(subtotal);

  return (
    <div className="bg-canvas rounded-lg border border-hairline p-lg sticky top-lg">
      <h2 className="text-tagline text-ink mb-lg">Order Summary</h2>

      <div className="space-y-md mb-lg">
        <div className="flex justify-between text-body text-ink-muted-80">
          <span>Items ({itemCount})</span>
          <span>
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>
        <div className="flex justify-between items-baseline text-body text-ink">
          <span>Subtotal</span>
          <span className="font-medium whitespace-nowrap">
            <span className="inline">{subtotalWhole}</span>
            <span className="inline text-[0.7em] text-ink-muted-80">{subtotalDecimal}</span>
          </span>
        </div>
        <div className="flex justify-between text-body text-ink-muted-80">
          <span>Shipping</span>
          <span className="text-sm italic">At checkout</span>
        </div>
      </div>

      <div className="border-t border-hairline pt-lg mb-lg pr-sm">
        <div className="flex justify-between items-baseline">
          <span className="text-lead text-ink font-semibold">Total</span>
          <span className="text-display-sm text-ink font-bold whitespace-nowrap">
            <span className="inline">{totalWhole}</span>
            <span className="inline text-[0.5em] align-baseline text-ink-muted-80">
              {totalDecimal}
            </span>
          </span>
        </div>
        <p className="text-caption text-ink-muted-80 mt-xs">Taxes calculated at checkout</p>
      </div>

      <Button variant="primary" className="w-full" onClick={onCheckout} disabled={itemCount === 0}>
        Proceed to Checkout
      </Button>
    </div>
  );
};
