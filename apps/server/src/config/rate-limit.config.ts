import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { getRedisClient, isRedisReady } from "../cache/redis.client";
import { keyPrefix } from "./redis.config";
import { env } from "./env";
import { ErrorCode } from "../constants/error-codes";
import { ApiError } from "../utils/api-error";
import logger from "../utils/logger";

function createRateLimitStore(namespace: string) {
  if (isRedisReady()) {
    const client = getRedisClient();
    if (client) {
      return new RedisStore({
        sendCommand: (...args: string[]) => client.sendCommand(args),
        prefix: `${keyPrefix}rate-limit:${namespace}:`,
      });
    }
  }

  if (env.NODE_ENV === "production" && !env.REDIS_REQUIRED) {
    logger.warn(`Rate limiter '${namespace}' using in-memory fallback in production`);
  }

  return undefined;
}

export const globalApiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  store: createRateLimitStore("global"),
  handler: (_req, _res, next) => {
    next(
      new ApiError({
        statusCode: 429,
        message: "Too many requests. Please try again later.",
        code: ErrorCode.RATE_LIMIT_EXCEEDED,
        details: {},
      }),
    );
  },
});

export const authRateLimiter = rateLimit({
  windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  store: createRateLimitStore("auth"),
  handler: (_req, _res, next) => {
    next(
      new ApiError({
        statusCode: 429,
        message: "Too many authentication attempts. Please try again later.",
        code: ErrorCode.RATE_LIMIT_EXCEEDED,
        details: {},
      }),
    );
  },
});

export const uploadRateLimiter = rateLimit({
  windowMs: env.UPLOAD_RATE_LIMIT_WINDOW_MS,
  max: env.UPLOAD_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  store: createRateLimitStore("upload"),
  keyGenerator: (req) => {
    return req.user?.id || req.ip || "unknown";
  },
  handler: (_req, _res, next) => {
    next(
      new ApiError({
        statusCode: 429,
        message: "Too many upload requests. Please try again later.",
        code: ErrorCode.RATE_LIMIT_EXCEEDED,
        details: {},
      }),
    );
  },
});

export const passwordResetRateLimiter = rateLimit({
  windowMs: env.PASSWORD_RESET_RATE_LIMIT_WINDOW_MS,
  max: env.PASSWORD_RESET_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  store: createRateLimitStore("password-reset"),
  handler: (_req, _res, next) => {
    next(
      new ApiError({
        statusCode: 429,
        message: "Too many password reset attempts. Please try again later.",
        code: ErrorCode.RATE_LIMIT_EXCEEDED,
        details: {},
      }),
    );
  },
});
