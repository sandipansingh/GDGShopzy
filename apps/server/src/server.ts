import { createServer } from "http";
import app from "./app";
import { env } from "./config/env";
import logger from "./utils/logger";
import { prisma } from "./db/prisma";
import { ensureBucketExists } from "./modules/uploads/minio.client";
import { connectRedis, disconnectRedis } from "./cache/redis.client";
import { validateOpenApiSpec } from "./docs/validate-schema";
import { openApiSpec } from "./docs/openapi";

const PORT = env.SERVER_PORT;

async function startServer(): Promise<void> {
  if (env.API_DOCS_ENABLED) {
    logger.info("Validating OpenAPI specification...");
    const isValid = validateOpenApiSpec(openApiSpec);
    if (!isValid) {
      logger.warn("OpenAPI spec validation failed - docs may not work correctly");
    }
  }

  try {
    await connectRedis();
  } catch (err) {
    logger.error("Redis connection failed:", { error: err });
    if (env.REDIS_REQUIRED) {
      process.exit(1);
    }
  }

  try {
    await ensureBucketExists();
  } catch (err) {
    logger.warn("MinIO not available, uploads will fail until MinIO is reachable.", { error: err });
  }

  const server = createServer(app);

  server.listen(PORT, () => {
    logger.info(`Server Status: Listening on port ${PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
    if (env.API_DOCS_ENABLED) {
      logger.info(`API Docs: ${env.PUBLIC_API_URL || `http://localhost:${PORT}`}/api/v1/docs`);
    }
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`\n${signal} received, shutting down gracefully...`);

    server.close(async () => {
      logger.info("HTTP server closed.");
      await Promise.all([disconnectRedis(), prisma.$disconnect()]);
      logger.info("Redis and Prisma disconnected.");
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown after timeout.");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Rejection:", { reason });
    shutdown("unhandledRejection");
  });
}

startServer().catch((err) => {
  logger.error("Failed to start server:", { error: err });
  process.exit(1);
});
