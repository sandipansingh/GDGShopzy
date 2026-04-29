import { Router } from "express";
import { asyncHandler } from "../../middleware/async-handler";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { sellerContextMiddleware } from "../../middleware/seller-context.middleware";
import { getStats } from "./dashboard.controller";
import { UserRole } from "@prisma/client";

const router = Router();

router.use(
  authMiddleware,
  requireRole(UserRole.SELLER, UserRole.EMPLOYEE),
  asyncHandler(sellerContextMiddleware),
);

router.get("/stats", asyncHandler(getStats));

export default router;
