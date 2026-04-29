import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock must be 0 or greater"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
