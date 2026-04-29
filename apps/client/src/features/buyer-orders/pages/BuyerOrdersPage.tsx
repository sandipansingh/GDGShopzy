import { useState, useEffect } from "react";
import { buyerOrdersApi } from "../api";
import { Order } from "../../../types/order";
import { useToast } from "../../../components/toast/useToast";
import { EmptyState } from "../../../components/ui/EmptyState";
import { PageLoader } from "../../../components/shared/PageLoader";
import { PageHeader } from "../../../components/shared/PageHeader";
import { getErrorMessage } from "../../../lib/api-error";
import { ROUTES } from "../../../lib/routes";
import { OrderListCard } from "../../orders/components/OrderListCard";

export const BuyerOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await buyerOrdersApi.getOrders();
        setOrders(data);
      } catch (err) {
        const message = getErrorMessage(err);
        toast.error(message, "Orders unavailable");
      } finally {
        setLoading(false);
      }
    };

    void fetchOrders();
  }, [toast]);

  if (loading) {
    return (
      <div className="content-container py-16 md:py-24">
        <PageLoader />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="content-container py-16 md:py-24">
        <EmptyState title="No orders yet" description="Your order history will appear here" />
      </div>
    );
  }

  return (
    <div className="content-container py-16 md:py-24">
      <PageHeader title="My Orders" />
      <div className="space-y-md">
        {orders.map((order) => (
          <OrderListCard key={order.id} order={order} to={ROUTES.BUYER_ORDER_DETAIL(order.id)} />
        ))}
      </div>
    </div>
  );
};
