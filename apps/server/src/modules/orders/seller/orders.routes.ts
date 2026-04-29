import { Router } from "express";
import { asyncHandler } from "../../../middleware/async-handler";
import { validate } from "../../../middleware/validate.middleware";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { requireRole } from "../../../middleware/role.middleware";
import { sellerContextMiddleware } from "../../../middleware/seller-context.middleware";
import { orderParamsSchema, updateOrderStatusSchema } from "../order.schema";
import * as controller from "./orders.controller";
import { UserRole } from "@prisma/client";

const router = Router();

router.use(
  authMiddleware,
  requireRole(UserRole.SELLER, UserRole.EMPLOYEE),
  asyncHandler(sellerContextMiddleware),
);

router.get("/", asyncHandler(controller.listOrders));
router.get("/:id", validate({ params: orderParamsSchema }), asyncHandler(controller.getOrder));
router.patch(
  "/:id/status",
  validate({ params: orderParamsSchema, body: updateOrderStatusSchema }),
  asyncHandler(controller.updateOrderStatus),
);

export default router;
