import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cartApi } from "../api";
import { Cart } from "../../../types/cart";
import { useToast } from "../../../components/toast/useToast";
import { ApiErrorState } from "../../../components/shared/ApiErrorState";
import { PageLoader } from "../../../components/shared/PageLoader";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { getErrorMessage } from "../../../lib/api-error";
import { ROUTES } from "../../../lib/routes";
import { CartItemRow } from "../components/CartItemRow";
import { CartSummaryCard } from "../components/CartSummaryCard";

export const CartPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchCart = async () => {
    setLoading(true);
    setError("");
    const data = await cartApi.getCart();
    setCart(data);
    setLoading(false);
  };

  useEffect(() => {
    const loadCart = async () => {
      try {
        await fetchCart();
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        setLoading(false);
        toast.error(message, "Cart unavailable");
      }
    };

    void loadCart();
  }, [toast]);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      setUpdating(itemId);
      await cartApi.updateItem(itemId, quantity);
      await fetchCart();
      toast.success("Your cart was updated.", "Cart updated");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      setLoading(false);
      toast.error(message, "Cart update failed");
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setUpdating(itemId);
      await cartApi.removeItem(itemId);
      await fetchCart();
      toast.success("The item was removed from your cart.", "Cart updated");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      setLoading(false);
      toast.error(message, "Cart update failed");
    } finally {
      setUpdating(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;
    try {
      setLoading(true);
      await cartApi.clearCart();
      await fetchCart();
      toast.success("Your cart is now empty.", "Cart cleared");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      setLoading(false);
      toast.error(message, "Cart update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="content-container py-16 md:py-24">
        <PageLoader />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="content-container py-16 md:py-24">
        <EmptyState
          title="Your cart is empty"
          description="Add some products to get started"
          action={
            <Button variant="primary" onClick={() => navigate(ROUTES.PRODUCTS)}>
              Browse Products
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="content-container py-16 md:py-24">
      <div className="flex items-center justify-between mb-xl">
        <h1 className="text-display-lg text-ink">Shopping Cart</h1>
        <Button variant="secondary" onClick={handleClearCart}>
          Clear Cart
        </Button>
      </div>

      {error && <ApiErrorState message={error} className="mb-lg" />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        <div className="lg:col-span-2 space-y-md">
          {cart.items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              isUpdating={updating === item.id}
              onDecrease={() => handleUpdateQuantity(item.id, item.quantity - 1)}
              onIncrease={() => handleUpdateQuantity(item.id, item.quantity + 1)}
              onRemove={() => handleRemoveItem(item.id)}
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <CartSummaryCard cart={cart} onCheckout={() => navigate(ROUTES.BUYER_CHECKOUT)} />
        </div>
      </div>
    </div>
  );
};
