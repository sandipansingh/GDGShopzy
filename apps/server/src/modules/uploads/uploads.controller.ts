import { Request, Response } from "express";
import { uploadProductImage, getProductImage } from "./uploads.service";
import { sendCreated } from "../../utils/api-response";
import { ApiError } from "../../utils/api-error";
import { ErrorCode } from "../../constants/error-codes";

export async function uploadImage(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    throw new ApiError({
      statusCode: 400,
      message: "Image file is required",
      code: ErrorCode.VALIDATION_ERROR,
    });
  }

  const sellerId = req.sellerId;
  if (!sellerId) {
    throw new ApiError({
      statusCode: 400,
      message: "Seller context is required",
      code: ErrorCode.VALIDATION_ERROR,
    });
  }

  const result = await uploadProductImage(req.file, sellerId);
  sendCreated(res, result);
}

export async function viewImage(req: Request, res: Response): Promise<void> {
  const encodedKey = req.params.encodedKey;
  if (!encodedKey || Array.isArray(encodedKey)) {
    throw new ApiError({
      statusCode: 400,
      message: "Image key is required",
      code: ErrorCode.VALIDATION_ERROR,
    });
  }

  const imageKey = decodeURIComponent(encodedKey);
  const { stream, contentType } = await getProductImage(imageKey);

  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  stream.pipe(res);
}
