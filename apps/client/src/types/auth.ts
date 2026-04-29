export type UserRole = "BUYER" | "SELLER" | "EMPLOYEE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sellerProfile?: {
    id: string;
    storeName: string;
  } | null;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}
