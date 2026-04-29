import { Router } from "express";
import cors from "cors";
import { asyncHandler } from "../../middleware/async-handler";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { sellerContextMiddleware } from "../../middleware/seller-context.middleware";
import { uploadMiddleware } from "./upload.middleware";
import { uploadImage, viewImage } from "./uploads.controller";
import { uploadRateLimiter } from "../../config/rate-limit.config";
import { publicCorsOptions } from "../../config/cors.config";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/product-image",
  uploadRateLimiter,
  authMiddleware,
  requireRole(UserRole.SELLER, UserRole.EMPLOYEE),
  asyncHandler(sellerContextMiddleware),
  uploadMiddleware.single("image"),
  asyncHandler(uploadImage),
);

router.get("/images/:encodedKey(*)", cors(publicCorsOptions), asyncHandler(viewImage));

export default router;
