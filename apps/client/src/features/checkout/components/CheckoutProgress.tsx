interface CheckoutProgressProps {
  step: number;
}

export const CheckoutProgress = ({ step }: CheckoutProgressProps) => {
  return (
    <div className="flex items-center justify-center mb-xl">
      <div className="flex items-center gap-md">
        {[1, 2].map((value) => (
          <div key={value} className="flex items-center gap-md">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= value ? "bg-primary text-canvas" : "bg-canvas-parchment text-ink-muted-80"
              }`}
            >
              {value}
            </div>
            {value === 1 && <div className="w-24 h-1 bg-canvas-parchment" />}
          </div>
        ))}
      </div>
    </div>
  );
};
