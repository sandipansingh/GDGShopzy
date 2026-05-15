import { getRedisClient, isRedisReady } from "./redis.client";
import { keyPrefix, cacheTtl } from "../config/redis.config";
import logger from "../utils/logger";

export function buildCacheKey(...parts: string[]): string {
  const key = parts.filter(Boolean).join(":");
  return `${keyPrefix}${key}`;
}

export async function getCache<T>(key: string): Promise<T | null> {
  if (!isRedisReady()) {
    return null;
  }

  try {
    const client = getRedisClient();
    if (!client) return null;

    const value = await client.get(key);
    if (!value) return null;

    return JSON.parse(value) as T;
  } catch (err) {
    logger.error("Cache get error:", { key, error: err });
    return null;
  }
}

export async function setCache<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
  if (!isRedisReady()) {
    return;
  }

  try {
    const client = getRedisClient();
    if (!client) return;

    const ttl = ttlSeconds ?? cacheTtl.defaultCacheTtlSeconds;
    const serialized = JSON.stringify(value);

    await client.setEx(key, ttl, serialized);
  } catch (err) {
    logger.error("Cache set error:", { key, error: err });
  }
}

export async function deleteCache(key: string): Promise<void> {
  if (!isRedisReady()) {
    return;
  }

  try {
    const client = getRedisClient();
    if (!client) return;

    await client.del(key);
  } catch (err) {
    logger.error("Cache delete error:", { key, error: err });
  }
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  if (!isRedisReady()) {
    return;
  }

  try {
    const client = getRedisClient();
    if (!client) return;

    // buildCacheKey already prepends keyPrefix, so callers pass un-prefixed
    // patterns like "products:list:*". We must NOT add the prefix again here.
    const fullPattern = `${keyPrefix}${pattern}`;
    const keys: string[] = [];

    for await (const key of client.scanIterator({ MATCH: fullPattern, COUNT: 100 })) {
      if (typeof key === "string") {
        keys.push(key);
      }
    }

    if (keys.length > 0) {
      await client.del(keys);
      logger.debug(`Deleted ${keys.length} keys matching pattern: ${fullPattern}`);
    }
  } catch (err) {
    logger.error("Cache delete pattern error:", { pattern, error: err });
  }
}

export async function getOrSetCache<T>(
  key: string,
  factory: () => Promise<T>,
  ttlSeconds?: number,
): Promise<T> {
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  const value = await factory();
  await setCache(key, value, ttlSeconds);
  return value;
}
