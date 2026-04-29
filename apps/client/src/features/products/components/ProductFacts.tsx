interface ProductFactsProps {
  category: string;
  stock: number;
}

export const ProductFacts = ({ category, stock }: ProductFactsProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col justify-center rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
        <p className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-muted-foreground">
          Category
        </p>
        <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">{category}</p>
      </div>
      <div className="flex flex-col justify-center rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
        <p className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-muted-foreground">
          Stock Available
        </p>
        <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
          {stock} <span className="text-sm font-normal text-muted-foreground">units</span>
        </p>
      </div>
    </div>
  );
};
