import { z } from "zod";
import { logger } from "../lib/logger";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
});

const parsed = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
});

if (!parsed.success) {
  logger.error("Environment validation failed", parsed.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
