import { z } from "zod";
import {
  trimString,
  normalizeEmail,
  sanitizePlainText,
  hasDangerousHtml,
} from "../../utils/sanitize";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100)
  .transform(trimString)
  .refine((val) => !hasDangerousHtml(val), "Name contains invalid characters");

const emailSchema = z.string().email("Invalid email address").transform(normalizeEmail);

const storeNameSchema = z
  .string()
  .min(1, "Store name is required")
  .max(200)
  .transform(sanitizePlainText)
  .refine((val) => !hasDangerousHtml(val), "Store name contains invalid characters");

export const registerBuyerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const registerSellerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  storeName: storeNameSchema,
});

export const registerEmployeeSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  inviteToken: z.string().min(1, "Invite token is required"),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: passwordSchema,
});

export type RegisterBuyerInput = z.infer<typeof registerBuyerSchema>;
export type RegisterSellerInput = z.infer<typeof registerSellerSchema>;
export type RegisterEmployeeInput = z.infer<typeof registerEmployeeSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
