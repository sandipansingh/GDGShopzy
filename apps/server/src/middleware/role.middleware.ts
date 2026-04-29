import { Request, Response, NextFunction, RequestHandler } from "express";
import { UserRole } from "@prisma/client";
import { ApiError } from "../utils/api-error";
import { ErrorCode } from "../constants/error-codes";

export function requireRole(...allowedRoles: UserRole[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ApiError({
        statusCode: 401,
        message: "Authentication required",
        code: ErrorCode.UNAUTHORIZED,
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError({
        statusCode: 403,
        message: "You do not have permission to access this resource",
        code: ErrorCode.FORBIDDEN,
      });
    }

    next();
  };
}
