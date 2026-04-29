import { Product } from "./product";

export type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentMethod = "CARD" | "UPI" | "COD";

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product: Product;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  shippingName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutData {
  shippingName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  paymentMethod: PaymentMethod;
  paymentDetails?: Record<string, unknown>;
}
