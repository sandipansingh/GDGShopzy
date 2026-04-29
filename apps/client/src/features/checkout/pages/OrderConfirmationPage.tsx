import { useLocation, useNavigate } from "react-router-dom";
import { Order } from "../../../types/order";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { formatCurrency } from "../../../lib/format";
import { ROUTES } from "../../../lib/routes";

export const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orders = (location.state?.orders as Order[]) || [];

  if (orders.length === 0) {
    return (
      <div className="content-container max-w-3xl py-16 md:py-24 text-center">
        <h1 className="text-display-lg text-ink mb-lg">No Orders Found</h1>
        <Button variant="primary" onClick={() => navigate(ROUTES.PRODUCTS)}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="content-container max-w-3xl py-16 md:py-24">
      <div className="text-center mb-xl">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-lg">
          <svg
            className="w-8 h-8 text-canvas"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-display-lg text-ink mb-md">Order Confirmed!</h1>
        <p className="text-body text-ink-muted-80">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
      </div>

      <div className="space-y-lg">
        {orders.map((order) => {
          const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

          return (
            <div key={order.id} className="bg-canvas rounded-lg border border-hairline p-lg">
              <div className="flex items-center justify-between mb-md">
                <div className="flex-1 min-w-0">
                  <p className="text-caption text-ink-muted-80">Order ID</p>
                  <p className="text-body-strong text-ink font-mono truncate">{order.id}</p>
                </div>
                <Badge variant="info">{order.status}</Badge>
              </div>

              <div className="border-t border-hairline pt-md space-y-sm">
                <div className="flex justify-between text-body text-ink">
                  <span>Items</span>
                  <span className="font-medium">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                </div>
                <div className="flex justify-between text-body text-ink">
                  <span>Payment</span>
                  <span className="font-medium uppercase">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-lead text-ink font-semibold pt-sm border-t border-hairline">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-md mt-xl">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => navigate(ROUTES.BUYER_ORDERS)}
        >
          View Orders
        </Button>
        <Button variant="primary" className="flex-1" onClick={() => navigate(ROUTES.PRODUCTS)}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};
