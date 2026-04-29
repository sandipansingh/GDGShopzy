import { Response } from "express";
import { env } from "../config/env";
import { refreshTokenCookieOptions } from "../config/cookie.config";

export function setRefreshTokenCookie(res: Response, refreshToken: string): void {
  res.cookie(env.REFRESH_COOKIE_NAME, refreshToken, refreshTokenCookieOptions);
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(env.REFRESH_COOKIE_NAME, refreshTokenCookieOptions);
}
