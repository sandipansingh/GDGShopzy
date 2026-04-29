import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productsApi } from "../api";
import { Product } from "../../../types/product";
import { ProductFacts } from "../components/ProductFacts";
import { ProductPurchasePanel } from "../components/ProductPurchasePanel";
import { useToast } from "../../../components/toast/useToast";
import { ApiErrorState } from "../../../components/shared/ApiErrorState";
import { PageLoader } from "../../../components/shared/PageLoader";
import { ProductImage } from "../../../components/shared/ProductImage";
import { ProductStockBadge } from "../../../components/shared/ProductStockBadge";
import { Button } from "../../../components/ui/Button";
import { getErrorMessage } from "../../../lib/api-error";
import { isBuyer } from "../../../lib/auth";
import { formatMoney } from "../../../lib/format";
import { useAuthStore } from "../../../stores/auth.store";
import { useCartStore } from "../../../stores/cart.store";
import { ROUTES } from "../../../lib/routes";

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const toast = useToast();
  const userRole = useAuthStore((state) => state.user?.role);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError("");
        const data = await productsApi.getProduct(id);
        setProduct(data);
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        toast.error(message, "Product unavailable");
      } finally {
        setLoading(false);
      }
    };

    void fetchProduct();
  }, [id, toast]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setAdding(true);
      await addItem(product.id, quantity);
      toast.success(`${product.name} was added to your cart.`, "Cart updated");
      navigate(ROUTES.BUYER_CART);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message, "Cart update failed");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="content-container py-20">
        <PageLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-container py-16 md:py-24">
        <ApiErrorState message={error} />
        <Button variant="dark" onClick={() => navigate(ROUTES.PRODUCTS)} className="mt-6">
          Back to Products
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="content-container py-16 md:py-24">
        <ApiErrorState message="Product not found" />
        <Button variant="dark" onClick={() => navigate(ROUTES.PRODUCTS)} className="mt-6">
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
      <button
        onClick={() => navigate(ROUTES.PRODUCTS)}
        className="mb-10 flex w-fit items-center gap-2 text-sm font-medium tracking-wider uppercase text-muted-foreground"
      >
        <span>&larr;</span> Back to Products
      </button>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Image Gallery Column */}
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-8 sm:p-12">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            className="z-10 flex h-full w-full items-center justify-center"
            imageClassName="h-full w-full object-contain drop-shadow-2xl"
          />
        </div>

        {/* Product Details Column */}
        <div className="flex flex-col space-y-10 lg:pt-4">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[0.65rem] font-bold tracking-[0.2em] uppercase text-muted-foreground backdrop-blur-md">
                {product.category}
              </span>
              <ProductStockBadge stock={product.stock} showCount />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {product.name}
              </h1>
              <p className="text-3xl font-light tracking-tight text-accent sm:text-4xl">
                {formatMoney(product.price)}
              </p>
            </div>

            {product.description?.trim() && (
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground/80">
                {product.description}
              </p>
            )}
          </div>

          <div className="h-px w-full bg-gradient-to-r from-border to-transparent" />

          <ProductFacts category={product.category} stock={product.stock} />

          {isBuyer(userRole) && product.stock > 0 && (
            <div className="pt-4">
              <ProductPurchasePanel
                quantity={quantity}
                stock={product.stock}
                isLoading={adding}
                onQuantityChange={setQuantity}
                onSubmit={handleAddToCart}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
