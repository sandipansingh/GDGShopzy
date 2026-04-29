import { UserRole } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { ApiError } from "../../utils/api-error";
import { ErrorCode } from "../../constants/error-codes";
import { hashPassword } from "../../utils/password";
import { buildTokenPair, storeRefreshToken } from "./token.service";
import { sanitizeUser } from "../../utils/sanitize";

interface BaseRegistrationInput {
  name: string;
  email: string;
  password: string;
}

export interface RegistrationResult {
  user: ReturnType<typeof sanitizeUser>;
  accessToken: string;
  refreshToken: string;
}

export async function checkEmailAvailability(email: string): Promise<void> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError({
      statusCode: 409,
      message: "Email already in use",
      code: ErrorCode.CONFLICT,
    });
  }
}

export async function createUserWithTokens(
  input: BaseRegistrationInput,
  role: UserRole,
  additionalData?: (
    tx: Omit<
      typeof prisma,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >,
  ) => Promise<void>,
): Promise<RegistrationResult> {
  const passwordHash = await hashPassword(input.password);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: { name: input.name, email: input.email, passwordHash, role },
    });

    if (additionalData) {
      await additionalData(tx);
    }

    return created;
  });

  const { accessToken, refreshToken } = buildTokenPair(user.id, user.email, user.role);
  await storeRefreshToken(user.id, refreshToken);

  return { user: sanitizeUser(user), accessToken, refreshToken };
}
