import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buyerOrdersApi } from "../api";
import { Order } from "../../../types/order";
import { useToast } from "../../../components/toast/useToast";
import { ApiErrorState } from "../../../components/shared/ApiErrorState";
import { PageLoader } from "../../../components/shared/PageLoader";
import { Button } from "../../../components/ui/Button";
import { getErrorMessage } from "../../../lib/api-error";
import { ROUTES } from "../../../lib/routes";
import { OrderItemsList } from "../../orders/components/OrderItemsList";
import { OrderMetaCard } from "../../orders/components/OrderMetaCard";
import { OrderShippingCard } from "../../orders/components/OrderShippingCard";
import { OrderSummaryCard } from "../../orders/components/OrderSummaryCard";

export const BuyerOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError("");
        const data = await buyerOrdersApi.getOrder(id);
        setOrder(data);
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        toast.error(message, "Order unavailable");
      } finally {
        setLoading(false);
      }
    };

    void fetchOrder();
  }, [id, toast]);

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
        <Button variant="secondary" onClick={() => navigate(ROUTES.BUYER_ORDERS)} className="mt-lg">
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="content-container py-16 md:py-24">
      <Button variant="secondary" onClick={() => navigate(ROUTES.BUYER_ORDERS)} className="mb-xl">
        ← Back to Orders
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        <div className="lg:col-span-2 space-y-lg">
          <OrderMetaCard order={order} />
          <OrderItemsList items={order.items} />
        </div>

        <div className="lg:col-span-1 space-y-lg">
          <OrderShippingCard order={order} />
          <OrderSummaryCard order={order} />
        </div>
      </div>
    </div>
  );
};
