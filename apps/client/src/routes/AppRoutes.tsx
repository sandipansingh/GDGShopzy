import { Routes, Route } from "react-router-dom";
import { PublicLayout } from "../components/layout/PublicLayout";
import { AuthLayout } from "../components/layout/AuthLayout";
import { BuyerLayout } from "../components/layout/BuyerLayout";
import { SellerLayout } from "../components/layout/SellerLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";
import { ROUTES } from "../lib/routes";
import { AccountPage } from "../features/account/pages/AccountPage";

import { HomePage } from "../features/home/pages/HomePage";
import { ProductsPage } from "../features/products/pages/ProductsPage";
import { ProductDetailPage } from "../features/products/pages/ProductDetailPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { BuyerRegisterPage } from "../features/auth/pages/BuyerRegisterPage";
import { SellerRegisterPage } from "../features/auth/pages/SellerRegisterPage";
import { EmployeeRegisterPage } from "../features/auth/pages/EmployeeRegisterPage";
import { ForgotPasswordPage } from "../features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../features/auth/pages/ResetPasswordPage";
import { CartPage } from "../features/cart/pages/CartPage";
import { CheckoutPage } from "../features/checkout/pages/CheckoutPage";
import { OrderConfirmationPage } from "../features/checkout/pages/OrderConfirmationPage";
import { BuyerOrdersPage } from "../features/buyer-orders/pages/BuyerOrdersPage";
import { BuyerOrderDetailPage } from "../features/buyer-orders/pages/BuyerOrderDetailPage";
import { SellerDashboardPage } from "../features/seller-dashboard/pages/SellerDashboardPage";
import { SellerProductsPage } from "../features/seller-products/pages/SellerProductsPage";
import { SellerProductCreatePage } from "../features/seller-products/pages/SellerProductCreatePage";
import { SellerProductEditPage } from "../features/seller-products/pages/SellerProductEditPage";
import { SellerOrdersPage } from "../features/seller-orders/pages/SellerOrdersPage";
import { SellerOrderDetailPage } from "../features/seller-orders/pages/SellerOrderDetailPage";
import { SellerEmployeesPage } from "../features/seller-employees/pages/SellerEmployeesPage";
import { UnauthorizedPage } from "../features/errors/UnauthorizedPage";
import { ForbiddenPage } from "../features/errors/ForbiddenPage";
import { NotFoundPage } from "../features/errors/NotFoundPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
        <Route path={ROUTES.PRODUCT_DETAIL(":id")} element={<ProductDetailPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER_BUYER} element={<BuyerRegisterPage />} />
        <Route path={ROUTES.REGISTER_SELLER} element={<SellerRegisterPage />} />
        <Route path={ROUTES.REGISTER_EMPLOYEE} element={<EmployeeRegisterPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={["BUYER"]} />}>
          <Route element={<BuyerLayout />}>
            <Route path={ROUTES.BUYER_ACCOUNT} element={<AccountPage />} />
            <Route path={ROUTES.BUYER_CART} element={<CartPage />} />
            <Route path={ROUTES.BUYER_CHECKOUT} element={<CheckoutPage />} />
            <Route path={ROUTES.BUYER_CHECKOUT_CONFIRMATION} element={<OrderConfirmationPage />} />
            <Route path={ROUTES.BUYER_ORDERS} element={<BuyerOrdersPage />} />
            <Route path={ROUTES.BUYER_ORDER_DETAIL(":id")} element={<BuyerOrderDetailPage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={["SELLER", "EMPLOYEE"]} />}>
          <Route element={<SellerLayout />}>
            <Route path={ROUTES.SELLER_DASHBOARD} element={<SellerDashboardPage />} />
            <Route path={ROUTES.SELLER_PRODUCTS} element={<SellerProductsPage />} />
            <Route path={ROUTES.SELLER_PRODUCT_NEW} element={<SellerProductCreatePage />} />
            <Route path={ROUTES.SELLER_PRODUCT_EDIT(":id")} element={<SellerProductEditPage />} />
            <Route path={ROUTES.SELLER_ORDERS} element={<SellerOrdersPage />} />
            <Route path={ROUTES.SELLER_ORDER_DETAIL(":id")} element={<SellerOrderDetailPage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={["SELLER"]} />}>
          <Route element={<SellerLayout />}>
            <Route path={ROUTES.SELLER_EMPLOYEES} element={<SellerEmployeesPage />} />
          </Route>
        </Route>
      </Route>

      <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
      <Route path={ROUTES.FORBIDDEN} element={<ForbiddenPage />} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
