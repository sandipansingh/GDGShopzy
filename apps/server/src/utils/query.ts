import { z } from "zod";

/**
 * Parses and coerces ?page and ?limit query params.
 * Returns validated numbers with safe defaults.
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;

/**
 * Parses :id route params as a non-empty string.
 * Express guarantees params are strings, but this validates they are present and non-empty.
 */
export const idParamSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export type IdParam = z.infer<typeof idParamSchema>;
