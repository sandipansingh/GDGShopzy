import { Button } from "../../../components/ui/Button";

interface ProductPurchasePanelProps {
  quantity: number;
  stock: number;
  isLoading: boolean;
  onQuantityChange: (value: number) => void;
  onSubmit: () => void;
}

export const ProductPurchasePanel = ({
  quantity,
  stock,
  isLoading,
  onQuantityChange,
  onSubmit,
}: ProductPurchasePanelProps) => {
  const inputId = "product-quantity";

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
      <div className="space-y-3">
        <label
          htmlFor={inputId}
          className="block text-[0.65rem] font-bold tracking-[0.2em] uppercase text-muted-foreground"
        >
          Quantity
        </label>
        <div className="relative">
          <input
            id={inputId}
            type="number"
            min="1"
            max={stock}
            value={quantity}
            onChange={(event) =>
              onQuantityChange(Math.max(1, Number.parseInt(event.target.value) || 1))
            }
            className="h-14 w-32 rounded-xl border border-white/10 bg-white/5 px-4 text-lg font-medium text-foreground outline-none focus:border-accent focus:bg-white/10 focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>
      <Button
        variant="secondary"
        size="lg"
        className="h-14 w-full flex-1 rounded-xl sm:w-auto"
        onClick={onSubmit}
        isLoading={isLoading}
      >
        Add to Cart
      </Button>
    </div>
  );
};
