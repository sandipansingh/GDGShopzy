import { z } from "zod";
import { trimString, sanitizePlainText, hasDangerousHtml } from "../../utils/sanitize";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200)
    .transform(trimString)
    .refine((val) => !hasDangerousHtml(val), "Name contains invalid characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000)
    .transform(sanitizePlainText)
    .refine((val) => !hasDangerousHtml(val), "Description contains invalid HTML"),
  category: z.string().min(1, "Category is required").max(100).transform(trimString),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock must be at least 0"),
  imageKey: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productParamsSchema = z.object({
  id: z.string().cuid("Invalid product ID format"),
});

export const publicProductQuerySchema = z.object({
  search: z.string().max(200).optional(),
  category: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  includeOutOfStock: z
    .string()
    .optional()
    .transform((v) => v === "true"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
