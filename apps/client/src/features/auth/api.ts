import { api } from "../../lib/api";
import { ApiMessageResponse, ApiResponse, unwrapMessage, unwrapResponse } from "../../types/api";
import { AuthResponse } from "../../types/auth";
import type {
  BuyerRegisterInput,
  EmployeeRegisterInput,
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  SellerRegisterInput,
} from "./schemas";

export const authApi = {
  registerBuyer: (data: BuyerRegisterInput) =>
    api.post<ApiResponse<AuthResponse>>("/auth/register/buyer", data).then(unwrapResponse),

  registerSeller: (data: SellerRegisterInput) =>
    api.post<ApiResponse<AuthResponse>>("/auth/register/seller", data).then(unwrapResponse),

  registerEmployee: (data: EmployeeRegisterInput) =>
    api.post<ApiResponse<AuthResponse>>("/auth/register/employee", data).then(unwrapResponse),

  login: (data: LoginInput) =>
    api.post<ApiResponse<AuthResponse>>("/auth/login", data).then(unwrapResponse),

  forgotPassword: (data: ForgotPasswordInput) =>
    api.post<ApiMessageResponse>("/auth/forgot-password", data).then(unwrapMessage),

  resetPassword: (data: ResetPasswordInput) =>
    api.post<ApiMessageResponse>("/auth/reset-password", data).then(unwrapMessage),
};
