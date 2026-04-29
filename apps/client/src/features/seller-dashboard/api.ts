import { api } from "../../lib/api";
import { ApiResponse, unwrapResponse } from "../../types/api";
import { Product } from "../../types/product";
import { Order } from "../../types/order";

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockProducts: Product[];
  recentOrders: Order[];
}

export const dashboardApi = {
  getStats: () =>
    api.get<ApiResponse<DashboardStats>>("/seller/dashboard/stats").then(unwrapResponse),
};
