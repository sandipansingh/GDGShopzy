import { Router } from "express";
import { asyncHandler } from "../../../middleware/async-handler";
import { validate } from "../../../middleware/validate.middleware";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { requireRole } from "../../../middleware/role.middleware";
import { sellerContextMiddleware } from "../../../middleware/seller-context.middleware";
import { createProductSchema, updateProductSchema, productParamsSchema } from "../product.schema";
import * as controller from "./products.controller";
import { UserRole } from "@prisma/client";

const router = Router();

router.use(
  authMiddleware,
  requireRole(UserRole.SELLER, UserRole.EMPLOYEE),
  asyncHandler(sellerContextMiddleware),
);

router.get("/", asyncHandler(controller.listProducts));
router.post("/", validate({ body: createProductSchema }), asyncHandler(controller.createProduct));
router.get("/:id", validate({ params: productParamsSchema }), asyncHandler(controller.getProduct));
router.patch(
  "/:id",
  validate({ params: productParamsSchema, body: updateProductSchema }),
  asyncHandler(controller.updateProduct),
);
router.delete(
  "/:id",
  validate({ params: productParamsSchema }),
  asyncHandler(controller.deleteProduct),
);

export default router;
