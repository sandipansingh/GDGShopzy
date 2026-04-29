import { createClient } from "redis";
import type {
  RedisClientType as BaseRedisClientType,
  RedisModules,
  RedisFunctions,
  RedisScripts,
} from "redis";
import { redisConfig } from "../config/redis.config";
import { env } from "../config/env";
import logger from "../utils/logger";

type RedisClientType = BaseRedisClientType<RedisModules, RedisFunctions, RedisScripts>;

let redisClient: RedisClientType | null = null;
let isConnected = false;

export async function connectRedis(): Promise<void> {
  if (redisClient) {
    return;
  }

  try {
    const client = createClient(redisConfig) as RedisClientType;
    redisClient = client;

    client.on("error", (err) => {
      logger.error("Redis client error:", { error: err });
      isConnected = false;
    });

    client.on("connect", () => {
      logger.info("Redis client connecting...");
    });

    client.on("ready", () => {
      logger.info("Redis client ready");
      isConnected = true;
    });

    client.on("reconnecting", () => {
      logger.warn("Redis client reconnecting...");
      isConnected = false;
    });

    await client.connect();
  } catch (err) {
    logger.error("Failed to connect to Redis:", { error: err });

    if (env.REDIS_REQUIRED) {
      throw new Error("Redis connection required but failed");
    }

    logger.warn("Redis unavailable. Cache and rate limiting will use fallback.");
    redisClient = null;
    isConnected = false;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.quit();
      logger.info("Redis disconnected");
    } catch (err) {
      logger.error("Error disconnecting Redis:", { error: err });
    } finally {
      redisClient = null;
      isConnected = false;
    }
  }
}

export function getRedisClient(): RedisClientType | null {
  return redisClient;
}

export function isRedisReady(): boolean {
  return isConnected && redisClient !== null;
}
