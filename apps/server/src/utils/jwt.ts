import jwt, { SignOptions } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { env } from "../config/env";
import { ApiError } from "./api-error";
import { ErrorCode } from "../constants/error-codes";

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  sub: string;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new ApiError({
        statusCode: 401,
        message: "Access token has expired",
        code: ErrorCode.TOKEN_EXPIRED,
      });
    }
    throw new ApiError({
      statusCode: 401,
      message: "Invalid access token",
      code: ErrorCode.INVALID_TOKEN,
    });
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new ApiError({
        statusCode: 401,
        message: "Refresh token has expired",
        code: ErrorCode.TOKEN_EXPIRED,
      });
    }
    throw new ApiError({
      statusCode: 401,
      message: "Invalid refresh token",
      code: ErrorCode.INVALID_TOKEN,
    });
  }
}
