import { env } from "./env";
import type { RedisClientOptions } from "redis";

export const redisConfig: RedisClientOptions = {
  url: env.REDIS_URL,
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        return new Error("Redis max reconnection attempts reached");
      }
      return Math.min(retries * 100, 3000);
    },
  },
};

export const keyPrefix = env.REDIS_KEY_PREFIX;

export const cacheTtl = {
  defaultCacheTtlSeconds: env.REDIS_CACHE_TTL_SECONDS,
  productListTtlSeconds: env.CACHE_TTL_PRODUCT_LIST_SECONDS,
  productDetailTtlSeconds: env.CACHE_TTL_PRODUCT_DETAIL_SECONDS,
  sellerDashboardTtlSeconds: env.CACHE_TTL_SELLER_DASHBOARD_SECONDS,
};
