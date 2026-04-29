import type { OrderStatus } from "../../types/order";
import { getOrderStatusLabel, getOrderStatusVariant } from "../../lib/orders";
import { Badge } from "../ui/Badge";

interface StatusBadgeProps {
  status: OrderStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return <Badge variant={getOrderStatusVariant(status)}>{getOrderStatusLabel(status)}</Badge>;
};
