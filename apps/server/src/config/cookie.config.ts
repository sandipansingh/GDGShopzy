import { CookieOptions } from "express";
import { env } from "./env";
import { parseTimeStringToMs } from "../utils/time";

const isDevelopment = env.NODE_ENV === "development";

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: isDevelopment ? "lax" : "none",
  secure: !isDevelopment,
  maxAge: parseTimeStringToMs(env.JWT_REFRESH_EXPIRES_IN),
};
