import { z } from "zod";

export const orderParamsSchema = z.object({
  id: z.string().cuid("Invalid order ID format"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
