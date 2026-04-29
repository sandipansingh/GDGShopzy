import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { sellerProductsApi } from "../api";
import { Product } from "../../../types/product";
import { useToast } from "../../../components/toast/useToast";
import { ApiErrorState } from "../../../components/shared/ApiErrorState";
import { PageLoader } from "../../../components/shared/PageLoader";
import { PageHeader } from "../../../components/shared/PageHeader";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { getErrorMessage } from "../../../lib/api-error";
import { ROUTES } from "../../../lib/routes";
import { SellerProductsTable } from "../components/SellerProductsTable";

export const SellerProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await sellerProductsApi.getProducts();
        if (active) {
          setProducts(data);
        }
      } catch (err) {
        const message = getErrorMessage(err);
        if (active) {
          setError(message);
        }
        toast.error(message, "Products unavailable");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchProducts();
    return () => {
      active = false;
    };
  }, [toast]);

  const refreshProducts = async () => {
    const data = await sellerProductsApi.getProducts();
    setProducts(data);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeleting(id);
      await sellerProductsApi.deleteProduct(id);
      await refreshProducts();
      toast.success("The product was deleted.", "Product removed");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message, "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="content-container py-16 md:py-24">
        <PageLoader />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="content-container py-16 md:py-24">
        <EmptyState
          title="No products yet"
          description="Create your first product to start selling"
          action={
            <Link to={ROUTES.SELLER_PRODUCT_NEW}>
              <Button variant="primary">Create Product</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="content-container py-16 md:py-24">
      <PageHeader
        title="Products"
        action={
          <Link to={ROUTES.SELLER_PRODUCT_NEW}>
            <Button variant="primary">Create Product</Button>
          </Link>
        }
      />

      {error && <ApiErrorState message={error} className="mb-lg" />}

      <SellerProductsTable deletingId={deleting} onDelete={handleDelete} products={products} />
    </div>
  );
};
