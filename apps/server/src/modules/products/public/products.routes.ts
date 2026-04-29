import { Router } from "express";
import { asyncHandler } from "../../../middleware/async-handler";
import { validate } from "../../../middleware/validate.middleware";
import { publicProductQuerySchema, productParamsSchema } from "../product.schema";
import * as controller from "./products.controller";

const router = Router();

router.get(
  "/",
  validate({ query: publicProductQuerySchema }),
  asyncHandler(controller.listProducts),
);
router.get("/:id", validate({ params: productParamsSchema }), asyncHandler(controller.getProduct));

export default router;
