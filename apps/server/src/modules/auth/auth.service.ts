import { UserRole } from "@prisma/client";
import { randomBytes } from "crypto";
import { prisma } from "../../db/prisma";
import { comparePassword, hashPassword } from "../../utils/password";
import { verifyRefreshToken } from "../../utils/jwt";
import { ApiError } from "../../utils/api-error";
import { ErrorCode } from "../../constants/error-codes";
import {
  buildTokenPair,
  storeRefreshToken,
  findValidRefreshToken,
  revokeRefreshToken,
} from "./token.service";
import { hashToken } from "../../utils/token-hash";
import { env } from "../../config/env";
import { sanitizeUser } from "../../utils/sanitize";
import {
  notifyPasswordResetRequested,
  notifyPasswordResetCompleted,
} from "../email/email-notification.service";
import {
  checkEmailAvailability,
  createUserWithTokens,
  type RegistrationResult,
} from "./registration.util";
import type {
  RegisterBuyerInput,
  RegisterSellerInput,
  RegisterEmployeeInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "./auth.schema";

export async function registerBuyer(input: RegisterBuyerInput): Promise<RegistrationResult> {
  await checkEmailAvailability(input.email);

  return createUserWithTokens(input, UserRole.BUYER, async (tx) => {
    const user = await tx.user.findUnique({ where: { email: input.email } });
    if (user) {
      await tx.cart.create({ data: { buyerId: user.id } });
    }
  });
}

export async function registerSeller(input: RegisterSellerInput): Promise<RegistrationResult> {
  await checkEmailAvailability(input.email);

  return createUserWithTokens(input, UserRole.SELLER, async (tx) => {
    const user = await tx.user.findUnique({ where: { email: input.email } });
    if (user) {
      await tx.seller.create({ data: { ownerId: user.id, storeName: input.storeName } });
    }
  });
}

export async function registerEmployee(input: RegisterEmployeeInput): Promise<RegistrationResult> {
  const invite = await prisma.employeeInvite.findUnique({ where: { token: input.inviteToken } });

  if (!invite || invite.usedAt !== null) {
    throw new ApiError({
      statusCode: 400,
      message: "Invalid invite token",
      code: ErrorCode.INVITE_INVALID,
    });
  }
  if (invite.expiresAt < new Date()) {
    throw new ApiError({
      statusCode: 400,
      message: "Invite token has expired",
      code: ErrorCode.INVITE_EXPIRED,
    });
  }

  await checkEmailAvailability(input.email);

  return createUserWithTokens(input, UserRole.EMPLOYEE, async (tx) => {
    const user = await tx.user.findUnique({ where: { email: input.email } });
    if (user) {
      await tx.employee.create({ data: { userId: user.id, sellerId: invite.sellerId } });
      await tx.employeeInvite.update({ where: { id: invite.id }, data: { usedAt: new Date() } });
    }
  });
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: "Invalid email or password",
      code: ErrorCode.INVALID_CREDENTIALS,
    });
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw new ApiError({
      statusCode: 401,
      message: "Invalid email or password",
      code: ErrorCode.INVALID_CREDENTIALS,
    });
  }

  const { accessToken, refreshToken } = buildTokenPair(user.id, user.email, user.role);
  await storeRefreshToken(user.id, refreshToken);

  return { user: sanitizeUser(user), accessToken, refreshToken };
}

export async function refreshTokens(rawToken: string) {
  const payload = verifyRefreshToken(rawToken);
  const stored = await findValidRefreshToken(rawToken);

  if (!stored) {
    throw new ApiError({
      statusCode: 401,
      message: "Invalid or revoked refresh token",
      code: ErrorCode.INVALID_TOKEN,
    });
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: "User not found",
      code: ErrorCode.UNAUTHORIZED,
    });
  }

  await revokeRefreshToken(stored.id);
  const { accessToken, refreshToken: newRefreshToken } = buildTokenPair(
    user.id,
    user.email,
    user.role,
  );
  await storeRefreshToken(user.id, newRefreshToken);

  return { accessToken, refreshToken: newRefreshToken };
}

export async function logout(rawToken: string): Promise<void> {
  const stored = await findValidRefreshToken(rawToken);
  if (stored) {
    await revokeRefreshToken(stored.id);
  }
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) {
    throw new ApiError({ statusCode: 404, message: "User not found", code: ErrorCode.NOT_FOUND });
  }
  return user;
}

export async function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    return;
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + env.PASSWORD_RESET_TOKEN_EXPIRES_MINUTES * 60 * 1000);

  await prisma.$transaction(async (tx) => {
    await tx.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    await tx.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });
  });

  await notifyPasswordResetRequested(user.id, rawToken);
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const tokenHash = hashToken(input.token);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!resetToken || resetToken.usedAt !== null) {
    throw new ApiError({
      statusCode: 400,
      message: "Invalid or expired reset token",
      code: ErrorCode.PASSWORD_RESET_TOKEN_INVALID,
    });
  }

  if (resetToken.expiresAt < new Date()) {
    throw new ApiError({
      statusCode: 400,
      message: "Invalid or expired reset token",
      code: ErrorCode.PASSWORD_RESET_TOKEN_EXPIRED,
    });
  }

  const passwordHash = await hashPassword(input.password);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    });

    await tx.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    });

    await tx.refreshToken.updateMany({
      where: { userId: resetToken.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  });

  await notifyPasswordResetCompleted(resetToken.userId);
}
