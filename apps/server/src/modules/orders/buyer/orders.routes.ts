import { Router } from "express";
import { asyncHandler } from "../../../middleware/async-handler";
import { validate } from "../../../middleware/validate.middleware";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { requireRole } from "../../../middleware/role.middleware";
import { orderParamsSchema } from "../order.schema";
import * as controller from "./orders.controller";
import { UserRole } from "@prisma/client";

const router = Router();

router.use(authMiddleware, requireRole(UserRole.BUYER));

router.get("/", asyncHandler(controller.listOrders));
router.get("/:id", validate({ params: orderParamsSchema }), asyncHandler(controller.getOrder));

export default router;
