import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import { prisma } from "../db/prisma";
import { ApiError } from "../utils/api-error";
import { ErrorCode } from "../constants/error-codes";

export async function sellerContextMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.user) {
    throw new ApiError({
      statusCode: 401,
      message: "Authentication required",
      code: ErrorCode.UNAUTHORIZED,
    });
  }

  const { id, role } = req.user;

  if (role === UserRole.BUYER) {
    throw new ApiError({
      statusCode: 403,
      message: "Buyers cannot access seller resources",
      code: ErrorCode.FORBIDDEN,
    });
  }

  if (role === UserRole.SELLER) {
    const seller = await prisma.seller.findUnique({ where: { ownerId: id } });
    if (!seller) {
      throw new ApiError({
        statusCode: 404,
        message: "Seller profile not found",
        code: ErrorCode.NOT_FOUND,
      });
    }
    req.sellerId = seller.id;
    next();
    return;
  }

  if (role === UserRole.EMPLOYEE) {
    const employee = await prisma.employee.findUnique({ where: { userId: id } });
    if (!employee) {
      throw new ApiError({
        statusCode: 404,
        message: "Employee profile not found",
        code: ErrorCode.NOT_FOUND,
      });
    }
    req.sellerId = employee.sellerId;
    next();
    return;
  }

  throw new ApiError({
    statusCode: 403,
    message: "Access denied",
    code: ErrorCode.FORBIDDEN,
  });
}
