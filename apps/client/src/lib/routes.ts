import type { UserRole } from "../types/auth";

export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  LOGIN: "/login",
  REGISTER_BUYER: "/register/buyer",
  REGISTER_SELLER: "/register/seller",
  REGISTER_EMPLOYEE: "/register/employee",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  UNAUTHORIZED: "/unauthorized",
  FORBIDDEN: "/forbidden",
  NOT_FOUND: "/404",

  BUYER_ACCOUNT: "/account",
  BUYER_CART: "/cart",
  BUYER_CHECKOUT: "/checkout",
  BUYER_CHECKOUT_CONFIRMATION: "/checkout/confirmation",
  BUYER_ORDERS: "/orders",
  BUYER_ORDER_DETAIL: (id: string) => `/orders/${id}`,

  SELLER_DASHBOARD: "/seller/dashboard",
  SELLER_PRODUCTS: "/seller/products",
  SELLER_PRODUCT_NEW: "/seller/products/new",
  SELLER_PRODUCT_EDIT: (id: string) => `/seller/products/${id}/edit`,
  SELLER_ORDERS: "/seller/orders",
  SELLER_ORDER_DETAIL: (id: string) => `/seller/orders/${id}`,
  SELLER_EMPLOYEES: "/seller/employees",
} as const;

export const canAccessProtectedPath = (role: UserRole, path: string) => {
  if (
    path === ROUTES.BUYER_ACCOUNT ||
    path === ROUTES.BUYER_CART ||
    path === ROUTES.BUYER_CHECKOUT ||
    path === ROUTES.BUYER_CHECKOUT_CONFIRMATION ||
    path === ROUTES.BUYER_ORDERS ||
    path.startsWith("/orders/")
  ) {
    return role === "BUYER";
  }

  if (
    path === ROUTES.SELLER_DASHBOARD ||
    path === ROUTES.SELLER_PRODUCTS ||
    path === ROUTES.SELLER_PRODUCT_NEW ||
    path === ROUTES.SELLER_ORDERS ||
    path.startsWith("/seller/products/") ||
    path.startsWith("/seller/orders/")
  ) {
    return role === "SELLER" || role === "EMPLOYEE";
  }

  if (path === ROUTES.SELLER_EMPLOYEES) {
    return role === "SELLER";
  }

  return false;
};
