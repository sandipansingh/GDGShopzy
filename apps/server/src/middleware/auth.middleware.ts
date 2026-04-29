import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../utils/api-error";
import { ErrorCode } from "../constants/error-codes";
import { UserRole } from "@prisma/client";

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError({
      statusCode: 401,
      message: "Authorization header missing or malformed",
      code: ErrorCode.UNAUTHORIZED,
    });
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  req.user = {
    id: payload.sub,
    email: payload.email,
    role: payload.role as UserRole,
  };

  next();
}
