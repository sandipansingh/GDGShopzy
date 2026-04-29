import multer from "multer";
import { Request } from "express";
import { ApiError } from "../../utils/api-error";
import { ErrorCode } from "../../constants/error-codes";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError({
        statusCode: 400,
        message: "Only jpg, jpeg, png, and webp images are allowed",
        code: ErrorCode.VALIDATION_ERROR,
      }),
    );
  }
}

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter,
});
