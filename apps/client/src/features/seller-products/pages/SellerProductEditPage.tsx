import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sellerProductsApi } from "../api";
import { Product } from "../../../types/product";
import { ProductForm } from "../components/ProductForm";
import { ProductFormData } from "../schemas";
import { useToast } from "../../../components/toast/useToast";
import { ApiErrorState } from "../../../components/shared/ApiErrorState";
import { PageLoader } from "../../../components/shared/PageLoader";
import { Button } from "../../../components/ui/Button";
import { getErrorMessage } from "../../../lib/api-error";
import { ROUTES } from "../../../lib/routes";

export const SellerProductEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError("");
        const data = await sellerProductsApi.getProduct(id);
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

  const handleSubmit = async (data: ProductFormData) => {
    if (!id) return;
    await sellerProductsApi.updateProduct(id, data);
    toast.success("The product was updated.", "Product saved");
    navigate(ROUTES.SELLER_PRODUCTS);
  };

  if (loading) {
    return (
      <div className="content-container max-w-3xl py-16 md:py-24">
        <PageLoader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="content-container max-w-3xl py-16 md:py-24">
        <ApiErrorState message={error || "Product not found"} />
        <Button
          variant="secondary"
          onClick={() => navigate(ROUTES.SELLER_PRODUCTS)}
          className="mt-lg"
        >
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="content-container max-w-3xl py-16 md:py-24">
      <Button
        variant="secondary"
        onClick={() => navigate(ROUTES.SELLER_PRODUCTS)}
        className="mb-xl"
      >
        ← Back to Products
      </Button>

      <h1 className="text-display-lg text-ink mb-xl">Edit Product</h1>

      <div className="bg-canvas rounded-lg border border-hairline p-xl">
        <ProductForm
          defaultValues={{
            name: product.name,
            description: product.description || undefined,
            price: product.price,
            stock: product.stock,
            category: product.category,
            imageUrl: product.imageUrl || undefined,
          }}
          onSubmit={handleSubmit}
          submitLabel="Update Product"
        />
      </div>
    </div>
  );
};
