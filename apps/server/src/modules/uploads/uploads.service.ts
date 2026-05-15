import { v4 as uuidv4 } from "uuid";
import path from "path";
import { Readable } from "stream";
import { getMinioClient } from "./minio.client";
import { env } from "../../config/env";
import { ApiError } from "../../utils/api-error";
import { ErrorCode } from "../../constants/error-codes";
import { buildProductImageUrl, validateImageKey } from "./image-url";

interface UploadResult {
  imageUrl: string;
  imageKey: string;
}

export async function uploadProductImage(
  file: Express.Multer.File,
  sellerId: string,
): Promise<UploadResult> {
  const ext = path.extname(file.originalname).toLowerCase();
  const imageKey = `products/${sellerId}/${uuidv4()}${ext}`;

  const client = getMinioClient();

  await client.putObject(env.MINIO_BUCKET, imageKey, file.buffer, file.size, {
    "Content-Type": file.mimetype,
  });

  const imageUrl = buildProductImageUrl(imageKey) as string;

  return { imageUrl, imageKey };
}

export async function getProductImage(imageKey: string): Promise<{
  stream: Readable;
  contentType: string;
}> {
  if (!validateImageKey(imageKey)) {
    throw new ApiError({
      statusCode: 400,
      message: "Invalid image key",
      code: ErrorCode.INVALID_IMAGE_KEY,
    });
  }

  const client = getMinioClient();

  try {
    const stat = await client.statObject(env.MINIO_BUCKET, imageKey);
    const stream = await client.getObject(env.MINIO_BUCKET, imageKey);

    const contentType = stat.metaData?.["content-type"] || "image/jpeg";

    return { stream, contentType };
  } catch {
    throw new ApiError({
      statusCode: 404,
      message: "Image not found",
      code: ErrorCode.IMAGE_NOT_FOUND,
    });
  }
}
