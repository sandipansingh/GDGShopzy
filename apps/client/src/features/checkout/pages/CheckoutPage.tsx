import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { checkoutApi } from "../api";
import { CheckoutProgress } from "../components/CheckoutProgress";
import { PaymentMethodHint } from "../components/PaymentMethodHint";
import { checkoutSchema, CheckoutFormData } from "../schemas";
import { useToast } from "../../../components/toast/useToast";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { getErrorMessage } from "../../../lib/api-error";
import { ROUTES } from "../../../lib/routes";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const toast = useToast();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "CARD" },
  });

  const paymentMethod = useWatch({ control, name: "paymentMethod", defaultValue: "CARD" });

  const handleNext = async () => {
    const isValid = await trigger([
      "shippingName",
      "shippingPhone",
      "shippingLine1",
      "shippingCity",
      "shippingState",
      "shippingZip",
    ]);
    if (isValid) setStep(2);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setError("");
      const result = await checkoutApi.checkout(data);
      toast.success("Your order has been placed successfully.", "Checkout complete");
      navigate(ROUTES.BUYER_CHECKOUT_CONFIRMATION, { state: { orders: result.orders } });
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message, "Checkout failed");
    }
  };

  return (
    <div className="content-container max-w-3xl py-16 md:py-24">
      <h1 className="text-display-lg text-ink mb-xl">Checkout</h1>

      <CheckoutProgress step={step} />

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg">
        {step === 1 && (
          <div className="bg-canvas rounded-lg border border-hairline p-xl">
            <h2 className="text-tagline text-ink mb-lg">Shipping Address</h2>
            <div className="space-y-lg">
              <Input
                label="Full Name"
                {...register("shippingName")}
                error={errors.shippingName?.message}
              />
              <Input
                label="Phone"
                {...register("shippingPhone")}
                error={errors.shippingPhone?.message}
              />
              <Input
                label="Address Line 1"
                {...register("shippingLine1")}
                error={errors.shippingLine1?.message}
              />
              <Input label="Address Line 2 (Optional)" {...register("shippingLine2")} />
              <div className="grid grid-cols-2 gap-md">
                <Input
                  label="City"
                  {...register("shippingCity")}
                  error={errors.shippingCity?.message}
                />
                <Input
                  label="State"
                  {...register("shippingState")}
                  error={errors.shippingState?.message}
                />
              </div>
              <Input
                label="ZIP Code"
                {...register("shippingZip")}
                error={errors.shippingZip?.message}
              />
            </div>
            <Button type="button" variant="primary" className="w-full mt-lg" onClick={handleNext}>
              Continue to Payment
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-canvas rounded-lg border border-hairline p-xl">
            <h2 className="text-tagline text-ink mb-lg">Payment Method</h2>
            <div className="space-y-lg">
              <Select
                label="Payment Method"
                {...register("paymentMethod")}
                error={errors.paymentMethod?.message}
              >
                <option value="CARD">Credit/Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="COD">Cash on Delivery</option>
              </Select>

              <PaymentMethodHint method={paymentMethod} />
            </div>

            <div className="flex gap-md mt-lg">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>
                Place Order
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
