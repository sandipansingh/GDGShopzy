import { api } from "../../lib/api";
import {
  ApiResponse,
  PaginatedItemsResponse,
  getPaginatedItems,
  unwrapResponse,
} from "../../types/api";
import { Order } from "../../types/order";

export const buyerOrdersApi = {
  getOrders: () =>
    api
      .get<ApiResponse<Order[] | PaginatedItemsResponse<Order>>>("/buyer/orders")
      .then(unwrapResponse)
      .then(getPaginatedItems),

  getOrder: (id: string) => api.get<ApiResponse<Order>>(`/buyer/orders/${id}`).then(unwrapResponse),
};
