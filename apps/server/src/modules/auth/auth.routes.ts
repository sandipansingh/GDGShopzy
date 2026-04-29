import { Router } from "express";
import { asyncHandler } from "../../middleware/async-handler";
import { validate } from "../../middleware/validate.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authRateLimiter, passwordResetRateLimiter } from "../../config/rate-limit.config";
import {
  registerBuyerSchema,
  registerSellerSchema,
  registerEmployeeSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schema";
import * as controller from "./auth.controller";

const router = Router();

router.post(
  "/register/buyer",
  authRateLimiter,
  validate({ body: registerBuyerSchema }),
  asyncHandler(controller.registerBuyer),
);

router.post(
  "/register/seller",
  authRateLimiter,
  validate({ body: registerSellerSchema }),
  asyncHandler(controller.registerSeller),
);

router.post(
  "/register/employee",
  authRateLimiter,
  validate({ body: registerEmployeeSchema }),
  asyncHandler(controller.registerEmployee),
);

router.post(
  "/login",
  authRateLimiter,
  validate({ body: loginSchema }),
  asyncHandler(controller.login),
);

router.post("/refresh", authRateLimiter, asyncHandler(controller.refresh));

router.post("/logout", asyncHandler(controller.logout));
router.get("/me", authMiddleware, asyncHandler(controller.getMe));

router.post(
  "/forgot-password",
  passwordResetRateLimiter,
  validate({ body: forgotPasswordSchema }),
  asyncHandler(controller.forgotPassword),
);

router.post(
  "/reset-password",
  passwordResetRateLimiter,
  validate({ body: resetPasswordSchema }),
  asyncHandler(controller.resetPassword),
);

export default router;
