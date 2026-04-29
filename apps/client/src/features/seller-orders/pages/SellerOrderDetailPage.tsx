import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sellerOrdersApi } from "../api";
import { Order, OrderStatus } from "../../../types/order";
import { useToast } from "../../../components/toast/useToast";
import { ApiErrorState } from "../../../components/shared/ApiErrorState";
import { PageLoader } from "../../../components/shared/PageLoader";
import { Button } from "../../../components/ui/Button";
import { getErrorMessage } from "../../../lib/api-error";
import { ROUTES } from "../../../lib/routes";
import { OrderItemsList } from "../../orders/components/OrderItemsList";
import { OrderMetaCard } from "../../orders/components/OrderMetaCard";
import { OrderShippingCard } from "../../orders/components/OrderShippingCard";
import { OrderStatusCard } from "../components/OrderStatusCard";
import { OrderSummaryCard } from "../../orders/components/OrderSummaryCard";

export const SellerOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>("PENDING");

  useEffect(() => {
    let active = true;

    const fetchOrder = async () => {
      if (!id) {
        setLoading(false);
        setError("Order not found");
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await sellerOrdersApi.getOrder(id);
        if (active) {
          setOrder(data);
          setNewStatus(data.status);
        }
      } catch (err) {
        const message = getErrorMessage(err);
        if (active) {
          setError(message);
        }
        toast.error(message, "Order unavailable");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchOrder();
    return () => {
      active = false;
    };
  }, [id, toast]);

  const refreshOrder = async () => {
    if (!id) {
      return;
    }

    const data = await sellerOrdersApi.getOrder(id);
    setOrder(data);
    setNewStatus(data.status);
  };

  const handleUpdateStatus = async () => {
    if (!id || !order) return;
    try {
      setUpdating(true);
      await sellerOrdersApi.updateStatus(id, newStatus);
      await refreshOrder();
      toast.success("The order status was updated.", "Order updated");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message, "Status update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="content-container py-16 md:py-24">
        <PageLoader />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="content-container py-16 md:py-24">
        <ApiErrorState message={error || "Order not found"} />
        <Button
          variant="secondary"
          onClick={() => navigate(ROUTES.SELLER_ORDERS)}
          className="mt-lg"
        >
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="content-container py-16 md:py-24">
      <Button variant="secondary" onClick={() => navigate(ROUTES.SELLER_ORDERS)} className="mb-xl">
        ← Back to Orders
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        <div className="lg:col-span-2 space-y-lg">
          <OrderMetaCard order={order} />
          <OrderItemsList items={order.items} />
        </div>

        <div className="lg:col-span-1 space-y-lg">
          <OrderStatusCard
            currentStatus={order.status}
            isUpdating={updating}
            nextStatus={newStatus}
            onStatusChange={setNewStatus}
            onSubmit={handleUpdateStatus}
          />
          <OrderShippingCard order={order} />
          <OrderSummaryCard order={order} />
        </div>
      </div>
    </div>
  );
};
