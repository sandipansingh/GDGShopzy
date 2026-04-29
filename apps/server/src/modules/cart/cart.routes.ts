import { Router } from "express";
import { asyncHandler } from "../../middleware/async-handler";
import { validate } from "../../middleware/validate.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { addCartItemSchema, updateCartItemSchema, cartItemParamsSchema } from "./cart.schema";
import * as controller from "./cart.controller";
import { UserRole } from "@prisma/client";

const router = Router();

router.use(authMiddleware, requireRole(UserRole.BUYER));

router.get("/", asyncHandler(controller.getCart));
router.post("/items", validate({ body: addCartItemSchema }), asyncHandler(controller.addItem));
router.patch(
  "/items/:id",
  validate({ params: cartItemParamsSchema, body: updateCartItemSchema }),
  asyncHandler(controller.updateItem),
);
router.delete(
  "/items/:id",
  validate({ params: cartItemParamsSchema }),
  asyncHandler(controller.removeItem),
);
router.delete("/", asyncHandler(controller.clearCart));

export default router;
