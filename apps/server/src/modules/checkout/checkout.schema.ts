import { z } from "zod";
import { trimString, sanitizePlainText, hasDangerousHtml } from "../../utils/sanitize";

const shippingTextSchema = z
  .string()
  .min(1)
  .max(200)
  .transform(sanitizePlainText)
  .refine((val) => !hasDangerousHtml(val), "Field contains invalid characters");

export const checkoutSchema = z.object({
  shippingName: shippingTextSchema,
  shippingPhone: z.string().min(1, "Shipping phone is required").max(20).transform(trimString),
  shippingLine1: shippingTextSchema,
  shippingLine2: z.string().max(200).transform(sanitizePlainText).optional(),
  shippingCity: shippingTextSchema,
  shippingState: shippingTextSchema,
  shippingZip: z.string().min(1, "ZIP code is required").max(20).transform(trimString),
  paymentMethod: z.enum(["CARD", "UPI", "COD"]),
  paymentDetails: z
    .object({
      cardLast4: z.string().max(4).optional(),
      upiId: z.string().max(100).optional(),
    })
    .optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
