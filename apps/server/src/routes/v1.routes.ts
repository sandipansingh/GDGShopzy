import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import uploadRoutes from "../modules/uploads/uploads.routes";
import publicProductRoutes from "../modules/products/public/products.routes";
import sellerProductRoutes from "../modules/products/seller/products.routes";
import cartRoutes from "../modules/cart/cart.routes";
import checkoutRoutes from "../modules/checkout/checkout.routes";
import buyerOrderRoutes from "../modules/orders/buyer/orders.routes";
import sellerOrderRoutes from "../modules/orders/seller/orders.routes";
import employeeRoutes from "../modules/employees/employees.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";
import docsRoutes from "../docs/docs.routes";

const router = Router();

router.use("/", docsRoutes);
router.use("/auth", authRoutes);
router.use("/products", publicProductRoutes);
router.use("/uploads", uploadRoutes);
router.use("/seller/products", sellerProductRoutes);
router.use("/seller/orders", sellerOrderRoutes);
router.use("/seller/employees", employeeRoutes);
router.use("/seller/dashboard", dashboardRoutes);
router.use("/buyer/cart", cartRoutes);
router.use("/buyer/checkout", checkoutRoutes);
router.use("/buyer/orders", buyerOrderRoutes);

export default router;
