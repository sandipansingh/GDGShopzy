import { useNavigate } from "react-router-dom";
import { sellerProductsApi } from "../api";
import { ProductForm } from "../components/ProductForm";
import { ProductFormData } from "../schemas";
import { useToast } from "../../../components/toast/useToast";
import { Button } from "../../../components/ui/Button";
import { ROUTES } from "../../../lib/routes";

export const SellerProductCreatePage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (data: ProductFormData) => {
    await sellerProductsApi.createProduct(data);
    toast.success("The product was created.", "Product saved");
    navigate(ROUTES.SELLER_PRODUCTS);
  };

  return (
    <div className="content-container max-w-3xl py-16 md:py-24">
      <Button
        variant="secondary"
        onClick={() => navigate(ROUTES.SELLER_PRODUCTS)}
        className="mb-xl"
      >
        ← Back to Products
      </Button>

      <h1 className="text-display-lg text-ink mb-xl">Create Product</h1>

      <div className="bg-canvas rounded-lg border border-hairline p-xl">
        <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
      </div>
    </div>
  );
};
