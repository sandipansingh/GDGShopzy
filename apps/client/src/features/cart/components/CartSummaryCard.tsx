import type { Cart } from "../../../types/cart";
import { formatMoney } from "../../../lib/format";
import { Button } from "../../../components/ui/Button";

interface CartSummaryCardProps {
  cart: Cart;
  onCheckout: () => void;
}

export const CartSummaryCard = ({ cart, onCheckout }: CartSummaryCardProps) => {
  return (
    <div className="bg-canvas rounded-lg border border-hairline p-lg sticky top-lg">
      <h2 className="text-tagline text-ink mb-lg">Order Summary</h2>
      <div className="space-y-md mb-lg">
        <div className="flex justify-between text-body text-ink">
          <span>Subtotal</span>
          <span>{formatMoney(cart.totalAmount)}</span>
        </div>
        <div className="flex justify-between text-body text-ink-muted-80">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
      </div>
      <div className="border-t border-hairline pt-lg mb-lg">
        <div className="flex justify-between text-lead text-ink">
          <span>Total</span>
          <span>{formatMoney(cart.totalAmount)}</span>
        </div>
      </div>
      <Button variant="primary" className="w-full" onClick={onCheckout}>
        Proceed to Checkout
      </Button>
    </div>
  );
};
