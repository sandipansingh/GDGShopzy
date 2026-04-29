import { api } from "../../lib/api";
import { ApiResponse, PaginatedItemsResponse, unwrapResponse } from "../../types/api";
import { Product } from "../../types/product";

export const productsApi = {
  getProducts: (params?: { search?: string; category?: string; page?: number; limit?: number }) =>
    api
      .get<ApiResponse<PaginatedItemsResponse<Product>>>("/products", { params })
      .then(unwrapResponse),

  getProduct: (id: string) => api.get<ApiResponse<Product>>(`/products/${id}`).then(unwrapResponse),
};
