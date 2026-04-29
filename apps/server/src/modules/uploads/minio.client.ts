import * as Minio from "minio";
import { env } from "../../config/env";
import logger from "../../utils/logger";

let minioClientInstance: Minio.Client | null = null;

export function getMinioClient(): Minio.Client {
  if (!minioClientInstance) {
    const config = {
      endPoint: env.MINIO_ENDPOINT,
      port: env.MINIO_PORT,
      useSSL: env.MINIO_USE_SSL,
      accessKey: env.MINIO_ACCESS_KEY,
      secretKey: env.MINIO_SECRET_KEY,
    };

    logger.info("Initializing MinIO client", {
      endPoint: config.endPoint,
      port: config.port,
      useSSL: config.useSSL,
      bucket: env.MINIO_BUCKET,
    });

    minioClientInstance = new Minio.Client(config);
  }
  return minioClientInstance;
}

export async function ensureBucketExists(): Promise<void> {
  const maxRetries = 5;
  const retryDelay = 2000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = getMinioClient();

      logger.info(`Checking MinIO bucket (attempt ${attempt}/${maxRetries})...`);

      const exists = await client.bucketExists(env.MINIO_BUCKET);

      if (!exists) {
        logger.info(`Creating MinIO bucket: ${env.MINIO_BUCKET}`);
        await client.makeBucket(env.MINIO_BUCKET);
        logger.info(`MinIO bucket created successfully: ${env.MINIO_BUCKET}`);
      } else {
        logger.info(`MinIO bucket already exists: ${env.MINIO_BUCKET}`);
      }

      return;
    } catch (error: unknown) {
      const err = error as Error & { code?: string; errno?: number; syscall?: string };
      const errorDetails = {
        message: err.message,
        code: err.code,
        errno: err.errno,
        syscall: err.syscall,
        attempt: `${attempt}/${maxRetries}`,
      };

      if (attempt === maxRetries) {
        logger.error("MinIO connection failed after all retries", errorDetails);
        throw error;
      }

      logger.warn("MinIO connection attempt failed, retrying...", errorDetails);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
}
