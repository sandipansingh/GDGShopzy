import { Request, Response } from "express";
import { prisma } from "../../db/prisma";
import { isRedisReady, getRedisClient } from "../../cache/redis.client";
import logger from "../../utils/logger";

type ServiceStatus = "ok" | "degraded" | "unavailable";

interface HealthStatus {
  status: "ok" | "degraded";
  timestamp: string;
  services: {
    database: ServiceStatus;
    cache: ServiceStatus;
  };
}

export async function healthCheck(_req: Request, res: Response): Promise<void> {
  const timestamp = new Date().toISOString();

  let dbStatus: ServiceStatus = "ok";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    logger.warn("[Health] Database check failed", { error: err });
    dbStatus = "unavailable";
  }

  let cacheStatus: ServiceStatus = "ok";
  if (!isRedisReady()) {
    cacheStatus = "unavailable";
  } else {
    try {
      const client = getRedisClient();
      await client?.ping();
    } catch (err) {
      logger.warn("[Health] Redis ping failed", { error: err });
      cacheStatus = "degraded";
    }
  }

  const overallStatus = dbStatus === "unavailable" ? "degraded" : "ok";

  const body: HealthStatus = {
    status: overallStatus,
    timestamp,
    services: {
      database: dbStatus,
      cache: cacheStatus,
    },
  };

  const httpStatus = dbStatus === "unavailable" ? 503 : 200;
  res.status(httpStatus).json({ success: true, data: body });
}
