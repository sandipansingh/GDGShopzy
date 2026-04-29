import { z } from "zod";

export type PasswordRequirement = {
  id: string;
  label: string;
  test: (value: string) => boolean;
};

export const passwordRequirements: PasswordRequirement[] = [
  {
    id: "min-length",
    label: "At least 8 characters",
    test: (value) => value.length >= 8,
  },
  {
    id: "uppercase",
    label: "At least 1 uppercase letter",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: "number",
    label: "At least 1 number",
    test: (value) => /[0-9]/.test(value),
  },
];

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
  .regex(/[0-9]/, "Password must contain at least 1 number");

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const buyerRegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
});

export const sellerRegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  storeName: z.string().min(1, "Store name is required"),
});

export const employeeRegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  inviteToken: z.string().min(1, "Invite token is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type BuyerRegisterInput = z.infer<typeof buyerRegisterSchema>;
export type SellerRegisterInput = z.infer<typeof sellerRegisterSchema>;
export type EmployeeRegisterInput = z.infer<typeof employeeRegisterSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
