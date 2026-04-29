import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { MulterError } from "multer";
import { ApiError } from "../utils/api-error";
import { ErrorCode } from "../constants/error-codes";
import { env } from "../config/env";
import logger from "../utils/logger";

interface ErrorResponse {
  success: false;
  message: string;
  code: string;
  details?: unknown;
  stack?: string;
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isDev = env.NODE_ENV === "development";

  if (err instanceof ApiError) {
    const body: ErrorResponse = {
      success: false,
      message: err.message,
      code: err.code,
      ...(err.details !== undefined ? { details: err.details } : {}),
      ...(isDev ? { stack: err.stack } : {}),
    };
    res.status(err.statusCode).json(body);
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      code: ErrorCode.VALIDATION_ERROR,
      details: err.flatten().fieldErrors,
    } satisfies ErrorResponse);
    return;
  }

  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({
        success: false,
        message: "File size exceeds the maximum allowed limit",
        code: ErrorCode.FILE_TOO_LARGE,
        details: {},
      } satisfies ErrorResponse);
      return;
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(400).json({
        success: false,
        message: "Invalid file field name",
        code: ErrorCode.INVALID_FILE_TYPE,
        details: {},
      } satisfies ErrorResponse);
      return;
    }
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "A record with this value already exists",
        code: ErrorCode.CONFLICT,
      } satisfies ErrorResponse);
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Record not found",
        code: ErrorCode.NOT_FOUND,
      } satisfies ErrorResponse);
      return;
    }
  }

  if (err instanceof Error && err.message.includes("CORS")) {
    res.status(403).json({
      success: false,
      message: "Origin not allowed",
      code: ErrorCode.INVALID_ORIGIN,
      details: {},
    } satisfies ErrorResponse);
    return;
  }

  logger.error("[Unhandled Error]", { error: err });
  res.status(500).json({
    success: false,
    message: isDev && err instanceof Error ? err.message : "Internal server error",
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    ...(isDev && err instanceof Error ? { stack: err.stack } : {}),
  } satisfies ErrorResponse);
}
