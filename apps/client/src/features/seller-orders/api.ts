import { api } from "../../lib/api";
import {
  ApiResponse,
  PaginatedItemsResponse,
  getPaginatedItems,
  unwrapResponse,
} from "../../types/api";
import { Order, OrderStatus } from "../../types/order";

export const sellerOrdersApi = {
  getOrders: () =>
    api
      .get<ApiResponse<Order[] | PaginatedItemsResponse<Order>>>("/seller/orders")
      .then(unwrapResponse)
      .then(getPaginatedItems),

  getOrder: (id: string) =>
    api.get<ApiResponse<Order>>(`/seller/orders/${id}`).then(unwrapResponse),

  updateStatus: (id: string, status: OrderStatus) =>
    api.patch<ApiResponse<Order>>(`/seller/orders/${id}/status`, { status }).then(unwrapResponse),
};
