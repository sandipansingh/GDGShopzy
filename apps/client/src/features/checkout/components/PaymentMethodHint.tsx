import type { PaymentMethod } from "../../../types/order";

const paymentHints: Record<PaymentMethod, string> = {
  CARD: "Card payment is simulated. No real payment will be processed.",
  UPI: "UPI payment is simulated. No real payment will be processed.",
  COD: "Pay with cash when your order is delivered.",
};

interface PaymentMethodHintProps {
  method: PaymentMethod;
}

export const PaymentMethodHint = ({ method }: PaymentMethodHintProps) => {
  return (
    <div className="bg-canvas-parchment rounded-md p-md">
      <p className="text-caption text-ink-muted-80">{paymentHints[method]}</p>
    </div>
  );
};
