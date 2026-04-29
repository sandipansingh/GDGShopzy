import { Request, Response } from "express";
import * as authService from "./auth.service";
import { sendSuccess, sendCreated } from "../../utils/api-response";
import { setRefreshTokenCookie, clearRefreshTokenCookie } from "../../utils/cookie.util";
import { env } from "../../config/env";
import { ApiError } from "../../utils/api-error";
import { ErrorCode } from "../../constants/error-codes";

export async function registerBuyer(req: Request, res: Response): Promise<void> {
  const result = await authService.registerBuyer(req.body);
  setRefreshTokenCookie(res, result.refreshToken);
  sendCreated(
    res,
    { user: result.user, accessToken: result.accessToken },
    "Account created successfully",
  );
}

export async function registerSeller(req: Request, res: Response): Promise<void> {
  const result = await authService.registerSeller(req.body);
  setRefreshTokenCookie(res, result.refreshToken);
  sendCreated(
    res,
    { user: result.user, accessToken: result.accessToken },
    "Seller account created successfully",
  );
}

export async function registerEmployee(req: Request, res: Response): Promise<void> {
  const result = await authService.registerEmployee(req.body);
  setRefreshTokenCookie(res, result.refreshToken);
  sendCreated(
    res,
    { user: result.user, accessToken: result.accessToken },
    "Employee account created successfully",
  );
}

export async function login(req: Request, res: Response): Promise<void> {
  const result = await authService.login(req.body);
  setRefreshTokenCookie(res, result.refreshToken);
  sendSuccess(res, { user: result.user, accessToken: result.accessToken });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const rawToken = req.cookies[env.REFRESH_COOKIE_NAME] as string | undefined;
  if (!rawToken) {
    throw new ApiError({
      statusCode: 401,
      message: "Refresh token missing",
      code: ErrorCode.UNAUTHORIZED,
    });
  }

  const result = await authService.refreshTokens(rawToken);
  setRefreshTokenCookie(res, result.refreshToken);
  sendSuccess(res, { accessToken: result.accessToken });
}

export async function logout(req: Request, res: Response): Promise<void> {
  const rawToken = req.cookies[env.REFRESH_COOKIE_NAME] as string | undefined;
  if (rawToken) {
    await authService.logout(rawToken);
  }
  clearRefreshTokenCookie(res);
  sendSuccess(res, null, "Logged out successfully");
}

export async function getMe(req: Request, res: Response): Promise<void> {
  const user = await authService.getMe(req.user!.id);
  sendSuccess(res, user);
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  await authService.forgotPassword(req.body);
  sendSuccess(
    res,
    null,
    "If an account exists for this email, a password reset link has been sent.",
  );
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  await authService.resetPassword(req.body);
  sendSuccess(res, null, "Password has been reset successfully.");
}
