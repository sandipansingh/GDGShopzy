import { Router } from "express";
import { asyncHandler } from "../../middleware/async-handler";
import { validate } from "../../middleware/validate.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { checkoutSchema } from "./checkout.schema";
import { checkout } from "./checkout.controller";
import { UserRole } from "@prisma/client";

const router = Router();

router.use(authMiddleware, requireRole(UserRole.BUYER));

router.post("/", validate({ body: checkoutSchema }), asyncHandler(checkout));

export default router;
