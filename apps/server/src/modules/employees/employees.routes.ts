import { Router } from "express";
import { asyncHandler } from "../../middleware/async-handler";
import { validate } from "../../middleware/validate.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { sellerContextMiddleware } from "../../middleware/seller-context.middleware";
import { inviteEmployeeSchema, employeeParamsSchema } from "./employees.schema";
import * as controller from "./employees.controller";
import { UserRole } from "@prisma/client";

const router = Router();

router.use(authMiddleware, requireRole(UserRole.SELLER), asyncHandler(sellerContextMiddleware));

router.post(
  "/invite",
  validate({ body: inviteEmployeeSchema }),
  asyncHandler(controller.inviteEmployee),
);
router.get("/", asyncHandler(controller.listEmployees));
router.delete(
  "/:id",
  validate({ params: employeeParamsSchema }),
  asyncHandler(controller.removeEmployee),
);

export default router;
