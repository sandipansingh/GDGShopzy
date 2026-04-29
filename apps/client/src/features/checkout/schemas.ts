import { z } from "zod";

export const checkoutSchema = z.object({
  shippingName: z.string().min(1, "Name is required"),
  shippingPhone: z.string().min(1, "Phone is required"),
  shippingLine1: z.string().min(1, "Address line 1 is required"),
  shippingLine2: z.string().optional(),
  shippingCity: z.string().min(1, "City is required"),
  shippingState: z.string().min(1, "State is required"),
  shippingZip: z.string().min(1, "ZIP code is required"),
  paymentMethod: z.enum(["CARD", "UPI", "COD"]),
  paymentDetails: z.record(z.unknown()).optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
