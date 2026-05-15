import { Request, Response } from "express";
import { sendSuccess } from "../../utils/api-response";
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

  // Check database
  let dbStatus: ServiceStatus = "ok";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    logger.warn("[Health] Database check failed", { error: err });
    dbStatus = "unavailable";
  }

  // Check Redis (optional — degraded if unavailable, not a hard failure)
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

  // Return 200 even when degraded so load balancers keep the instance alive.
  // Use 503 only if the database (critical dependency) is completely down.
  const httpStatus = dbStatus === "unavailable" ? 503 : 200;
  res.status(httpStatus).json({ success: true, data: body });
}
