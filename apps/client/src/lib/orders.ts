import type { OrderStatus } from "../types/order";

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const statusVariants: Record<OrderStatus, "default" | "success" | "warning" | "error" | "info"> = {
  PENDING: "warning",
  PAID: "info",
  PROCESSING: "info",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "error",
};

export const ORDER_STATUS_OPTIONS = Object.entries(statusLabels).map(([value, label]) => ({
  value: value as OrderStatus,
  label,
}));

export const getOrderStatusLabel = (status: OrderStatus) => statusLabels[status];

export const getOrderStatusVariant = (status: OrderStatus) => statusVariants[status];
