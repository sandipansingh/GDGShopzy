import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dashboardApi, type DashboardStats } from "../api";
import { useToast } from "../../../components/toast/useToast";
import { ApiErrorState } from "../../../components/shared/ApiErrorState";
import { PageHeader } from "../../../components/shared/PageHeader";
import { PageLoader } from "../../../components/shared/PageLoader";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { getErrorMessage } from "../../../lib/api-error";
import { formatCurrency, formatDate, formatMoneyParts } from "../../../lib/format";
import { ROUTES } from "../../../lib/routes";
import { DashboardSection } from "../components/DashboardSection";

export const SellerDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const toast = useToast();
  const lowStockProducts = Array.isArray(stats?.lowStockProducts) ? stats.lowStockProducts : [];
  const recentOrders = Array.isArray(stats?.recentOrders) ? stats.recentOrders : [];

  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await dashboardApi.getStats();
        if (active) {
          setStats(data);
        }
      } catch (err) {
        const message = getErrorMessage(err);
        if (active) {
          setError(message);
        }
        toast.error(message, "Dashboard unavailable");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchStats();
    return () => {
      active = false;
    };
  }, [toast]);

  if (loading) {
    return (
      <div className="content-container py-16 md:py-24">
        <PageLoader />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="content-container py-16 md:py-24">
        <ApiErrorState message={error || "Failed to load dashboard"} />
      </div>
    );
  }

  return (
    <div className="content-container py-16 md:py-24">
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
        <Card>
          <div className="text-caption text-ink-muted-80 mb-sm">Total Products</div>
          <div className="text-display-md text-ink">{stats.totalProducts}</div>
        </Card>
        <Card>
          <div className="text-caption text-ink-muted-80 mb-sm">Total Orders</div>
          <div className="text-display-md text-ink">{stats.totalOrders}</div>
        </Card>
        <Card>
          <div className="text-caption text-ink-muted-80 mb-sm">Total Revenue</div>
          <div className="text-display-md text-ink pr-2">
            {(() => {
              const { whole, decimal } = formatMoneyParts(stats.totalRevenue);
              return (
                <span className="inline-block">
                  <span className="inline">{whole}</span>
                  <span className="inline text-[0.45em] align-baseline text-ink-muted-80">
                    {decimal}
                  </span>
                </span>
              );
            })()}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
        <DashboardSection
          title="Low Stock Products"
          to={ROUTES.SELLER_PRODUCTS}
          hasItems={lowStockProducts.length > 0}
          emptyMessage="No low stock products"
        >
          <div className="space-y-md">
            {lowStockProducts.map((product) => (
              <Card key={product.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body-strong text-ink">{product.name}</p>
                    <p className="text-caption text-ink-muted-80">Stock: {product.stock}</p>
                  </div>
                  <Badge variant="warning">Low Stock</Badge>
                </div>
              </Card>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection
          title="Recent Orders"
          to={ROUTES.SELLER_ORDERS}
          hasItems={recentOrders.length > 0}
          emptyMessage="No recent orders"
        >
          <div className="space-y-md">
            {recentOrders.map((order) => (
              <Link key={order.id} to={ROUTES.SELLER_ORDER_DETAIL(order.id)}>
                <Card>
                  <div className="flex items-center justify-between mb-sm">
                    <p className="text-body-strong text-ink">Order #{order.id.slice(0, 8)}</p>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center justify-between text-caption text-ink-muted-80">
                    <span>{formatDate(order.createdAt)}</span>
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </DashboardSection>
      </div>
    </div>
  );
};
