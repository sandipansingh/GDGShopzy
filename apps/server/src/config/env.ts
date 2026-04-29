import { z } from "zod";

const booleanString = z
  .string()
  .transform((val) => val === "true" || val === "1")
  .or(z.boolean());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SERVER_PORT: z.coerce.number().default(4001),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CLIENT_URL: z.string().url("CLIENT_URL must be a valid URL"),

  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET must be at least 16 chars"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET must be at least 16 chars"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  REFRESH_COOKIE_NAME: z.string().default("refreshToken"),

  CORS_ORIGINS: z.string().default("http://localhost:5173"),
  CORS_CREDENTIALS: booleanString.default(true),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  AUTH_RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().default(10),
  UPLOAD_RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  UPLOAD_RATE_LIMIT_MAX: z.coerce.number().default(30),
  TRUST_PROXY: booleanString.default(false),

  REQUEST_BODY_LIMIT: z.string().default("1mb"),

  REDIS_URL: z.string().default("redis://localhost:6379"),
  REDIS_USERNAME: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_REQUIRED: booleanString.default(false),
  REDIS_KEY_PREFIX: z.string().default("ecommerce:"),
  REDIS_CACHE_TTL_SECONDS: z.coerce.number().default(60),
  CACHE_TTL_PRODUCT_LIST_SECONDS: z.coerce.number().default(60),
  CACHE_TTL_PRODUCT_DETAIL_SECONDS: z.coerce.number().default(300),
  CACHE_TTL_SELLER_DASHBOARD_SECONDS: z.coerce.number().default(60),

  MINIO_ENDPOINT: z.string().min(1, "MINIO_ENDPOINT is required"),
  MINIO_PORT: z.coerce.number().default(9000),
  MINIO_ACCESS_KEY: z.string().min(1, "MINIO_ACCESS_KEY is required"),
  MINIO_SECRET_KEY: z.string().min(1, "MINIO_SECRET_KEY is required"),
  MINIO_BUCKET: z.string().min(1, "MINIO_BUCKET is required"),
  MINIO_USE_SSL: booleanString.default(false),

  PUBLIC_API_URL: z.string().url("PUBLIC_API_URL must be a valid URL"),

  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("GDGShopzy <noreply@example.com>"),
  EMAIL_REPLY_TO: z.string().optional(),
  EMAIL_ENABLED: booleanString.default(false),
  EMAIL_ORDER_NOTIFICATIONS_ENABLED: booleanString.default(true),
  EMAIL_AUTH_NOTIFICATIONS_ENABLED: booleanString.default(true),
  EMAIL_EMPLOYEE_INVITES_ENABLED: booleanString.default(true),
  EMAIL_NOTIFY_EMPLOYEES_ON_NEW_ORDER: booleanString.default(false),
  EMAIL_ORDER_STATUS_SELLER_CONFIRMATION_ENABLED: booleanString.default(false),
  PASSWORD_RESET_TOKEN_EXPIRES_MINUTES: z.coerce.number().default(30),
  EMPLOYEE_INVITE_EXPIRES_HOURS: z.coerce.number().default(48),
  PASSWORD_RESET_RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  PASSWORD_RESET_RATE_LIMIT_MAX: z.coerce.number().default(5),

  API_DOCS_ENABLED: booleanString.default(true),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const errors = result.error.flatten().fieldErrors;
  process.stderr.write("Invalid environment variables:\n");
  process.stderr.write(JSON.stringify(errors, null, 2) + "\n");
  process.exit(1);
}

export const env = result.data;
export type Env = typeof env;
