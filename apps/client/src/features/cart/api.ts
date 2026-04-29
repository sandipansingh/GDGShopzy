import { api } from "../../lib/api";
import { ApiResponse, unwrapResponse } from "../../types/api";
import { Cart, CartItem } from "../../types/cart";

export const cartApi = {
  getCart: () => api.get<ApiResponse<Cart>>("/buyer/cart").then(unwrapResponse),

  addItem: (data: { productId: string; quantity: number }) =>
    api.post<ApiResponse<CartItem>>("/buyer/cart/items", data).then(unwrapResponse),

  updateItem: (id: string, quantity: number) =>
    api.patch<ApiResponse<CartItem>>(`/buyer/cart/items/${id}`, { quantity }).then(unwrapResponse),

  removeItem: async (id: string) => {
    await api.delete(`/buyer/cart/items/${id}`);
  },

  clearCart: async () => {
    await api.delete("/buyer/cart");
  },
};
