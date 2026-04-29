import { useState, useEffect } from "react";
import { productsApi } from "../api";
import { Product } from "../../../types/product";
import { useToast } from "../../../components/toast/useToast";
import { ApiErrorState } from "../../../components/shared/ApiErrorState";
import { PageHeader } from "../../../components/shared/PageHeader";
import { PaginationControls } from "../../../components/shared/PaginationControls";
import { PageLoader } from "../../../components/shared/PageLoader";
import { ProductCard } from "../components/ProductCard";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { EmptyState } from "../../../components/ui/EmptyState";
import { getErrorMessage } from "../../../lib/api-error";

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const toast = useToast();

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        setError("");
        const data = await productsApi.getProducts({
          search: search || undefined,
          category: category || undefined,
          page,
          limit: 12,
        });
        if (active) {
          setProducts(data.items);
          setTotalPages(data.pagination.totalPages);
        }
      } catch (err) {
        const message = getErrorMessage(err);
        if (active) {
          setError(message);
        }
        toast.error(message, "Catalog unavailable");
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
  }, [category, page, search, toast]);

  if (loading && products.length === 0) {
    return (
      <div className="content-container py-20">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="content-container py-16 md:py-24">
      <PageHeader
        title="Browse our products"
        description="Search by name, filter by category, and explore our complete product catalog."
        meta={
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-muted-foreground">
            {loading ? "Refreshing catalog" : `${products.length} items on this page`}
          </p>
        }
      />

      <div className="grid gap-6 border-b border-border py-8 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <Input
            label="Search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setLoading(true);
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="w-full">
          <Select
            label="Category"
            value={category}
            onChange={(e) => {
              setLoading(true);
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Home">Home</option>
            <option value="Sports">Sports</option>
          </Select>
        </div>
      </div>

      {error && (
        <div className="pt-8">
          <ApiErrorState message={error} />
        </div>
      )}

      {products.length === 0 && !loading && (
        <EmptyState
          title="No products found"
          description="Try a broader search term or clear the category filter to widen the result set."
        />
      )}

      {products.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 py-10 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPrevious={() => {
              setLoading(true);
              setPage((current) => Math.max(1, current - 1));
            }}
            onNext={() => {
              setLoading(true);
              setPage((current) => Math.min(totalPages, current + 1));
            }}
          />
        </>
      )}
    </div>
  );
};
