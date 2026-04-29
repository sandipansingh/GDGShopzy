import type { UserRole } from "../types/auth";
import { ROUTES } from "./routes";

export const isBuyer = (role?: UserRole | null): role is "BUYER" => role === "BUYER";

export const isSeller = (role?: UserRole | null): role is "SELLER" => role === "SELLER";

export const isEmployee = (role?: UserRole | null): role is "EMPLOYEE" => role === "EMPLOYEE";

export const isSellerStaff = (role?: UserRole | null): role is "SELLER" | "EMPLOYEE" =>
  isSeller(role) || isEmployee(role);

export const getRoleHomePath = (role: UserRole) =>
  isBuyer(role) ? ROUTES.PRODUCTS : ROUTES.SELLER_DASHBOARD;
