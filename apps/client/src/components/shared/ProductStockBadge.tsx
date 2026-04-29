import { Badge } from "../ui/Badge";

interface ProductStockBadgeProps {
  stock: number;
  showCount?: boolean;
}

export const ProductStockBadge = ({ stock, showCount = false }: ProductStockBadgeProps) => {
  if (stock === 0) {
    return <Badge variant="error">Out of Stock</Badge>;
  }

  if (stock <= 10) {
    return <Badge variant="warning">{showCount ? `Low Stock (${stock})` : "Low Stock"}</Badge>;
  }

  return <Badge variant="success">In Stock</Badge>;
};
