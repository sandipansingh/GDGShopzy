import { Link } from "react-router-dom";
import { ProductImage } from "../../../components/shared/ProductImage";
import { ProductStockBadge } from "../../../components/shared/ProductStockBadge";
import { Button } from "../../../components/ui/Button";
import { formatMoney } from "../../../lib/format";
import { ROUTES } from "../../../lib/routes";
import type { Product } from "../../../types/product";

interface SellerProductsTableProps {
  deletingId: string | null;
  onDelete: (id: string) => void;
  products: Product[];
}

export const SellerProductsTable = ({
  deletingId,
  onDelete,
  products,
}: SellerProductsTableProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-canvas">
      <table className="w-full">
        <thead className="bg-canvas-parchment">
          <tr>
            <th className="p-md text-left text-caption-strong text-ink">Product</th>
            <th className="p-md text-left text-caption-strong text-ink">Price</th>
            <th className="p-md text-left text-caption-strong text-ink">Stock</th>
            <th className="p-md text-left text-caption-strong text-ink">Category</th>
            <th className="p-md text-left text-caption-strong text-ink">Status</th>
            <th className="p-md text-right text-caption-strong text-ink">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-hairline">
              <td className="p-md">
                <div className="flex items-center gap-md">
                  <ProductImage
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-12 w-12 flex-shrink-0 rounded-md bg-canvas-parchment"
                    emptyLabel="No image"
                  />
                  <span className="text-body text-ink">{product.name}</span>
                </div>
              </td>
              <td className="p-md text-body text-ink">{formatMoney(product.price)}</td>
              <td className="p-md text-body text-ink">{product.stock}</td>
              <td className="p-md text-body text-ink">{product.category}</td>
              <td className="p-md">
                <ProductStockBadge stock={product.stock} />
              </td>
              <td className="p-md">
                <div className="flex items-center justify-end gap-sm">
                  <Link to={ROUTES.SELLER_PRODUCT_EDIT(product.id)}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                    isLoading={deletingId === product.id}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
