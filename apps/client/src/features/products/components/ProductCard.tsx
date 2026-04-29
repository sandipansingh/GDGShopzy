import { Link } from "react-router-dom";
import { Product } from "../../../types/product";
import { useToast } from "../../../components/toast/useToast";
import { ProductImage } from "../../../components/shared/ProductImage";
import { ProductStockBadge } from "../../../components/shared/ProductStockBadge";
import { Button } from "../../../components/ui/Button";
import { getErrorMessage } from "../../../lib/api-error";
import { isBuyer } from "../../../lib/auth";
import { formatMoney } from "../../../lib/format";
import { ROUTES } from "../../../lib/routes";
import { useAuthStore } from "../../../stores/auth.store";
import { useCartStore } from "../../../stores/cart.store";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const user = useAuthStore((state) => state.user);
  const addItem = useCartStore((state) => state.addItem);
  const toast = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await addItem(product.id, 1);
      toast.success(`${product.name} was added to your cart.`, "Cart updated");
    } catch (error) {
      toast.error(getErrorMessage(error), "Cart update failed");
    }
  };

  return (
    <Link to={ROUTES.PRODUCT_DETAIL(product.id)} className="block">
      <article className="flex h-full flex-col border border-border bg-card">
        <div className="h-1 w-16 bg-accent" />
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          className="aspect-square overflow-hidden border-b border-border bg-muted"
          imageClassName="h-full w-full object-cover"
        />
        <div className="flex flex-1 flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-3">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted-foreground">
                {product.category}
              </p>
              <h3 className="text-2xl uppercase tracking-[-0.04em] text-foreground line-clamp-2">
                {product.name}
              </h3>
            </div>
            <ProductStockBadge stock={product.stock} />
          </div>
          <p className="max-w-[48ch] text-body text-muted-foreground line-clamp-3">
            {product.description?.trim() || "Product details are available on the detail page."}
          </p>
          <div className="mt-auto flex items-end justify-between gap-4 border-t border-border pt-5">
            <div>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                Price
              </p>
              <p className="font-display text-4xl tracking-[-0.05em] text-foreground">
                {formatMoney(product.price)}
              </p>
            </div>
            <p className="text-right font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              {product.stock > 0 ? `${product.stock} in stock` : "Unavailable"}
            </p>
          </div>
          {isBuyer(user?.role) && product.stock > 0 && (
            <Button
              variant="primary"
              size="sm"
              className="mt-2 self-start"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          )}
        </div>
      </article>
    </Link>
  );
};
