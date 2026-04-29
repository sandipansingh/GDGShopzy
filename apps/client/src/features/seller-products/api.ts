import { api } from "../../lib/api";
import { ApiResponse, PaginatedItemsResponse, unwrapResponse } from "../../types/api";
import { Product } from "../../types/product";
import type { ProductFormData } from "./schemas";

export const sellerProductsApi = {
  getProducts: () =>
    api
      .get<ApiResponse<PaginatedItemsResponse<Product>>>("/seller/products")
      .then(unwrapResponse)
      .then((data) => data.items),

  getProduct: (id: string) =>
    api.get<ApiResponse<Product>>(`/seller/products/${id}`).then(unwrapResponse),

  createProduct: (data: ProductFormData) =>
    api.post<ApiResponse<Product>>("/seller/products", data).then(unwrapResponse),

  updateProduct: (id: string, data: Partial<ProductFormData>) =>
    api.patch<ApiResponse<Product>>(`/seller/products/${id}`, data).then(unwrapResponse),

  deleteProduct: async (id: string) => {
    await api.delete(`/seller/products/${id}`);
  },
};
