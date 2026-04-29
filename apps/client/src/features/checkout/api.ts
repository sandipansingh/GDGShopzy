import { api } from "../../lib/api";
import { ApiResponse, unwrapResponse } from "../../types/api";
import { CheckoutData, Order } from "../../types/order";

export const checkoutApi = {
  checkout: (data: CheckoutData) =>
    api.post<ApiResponse<{ orders: Order[] }>>("/buyer/checkout", data).then(unwrapResponse),
};
