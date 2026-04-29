import { UserRole } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { hashToken } from "../../utils/token-hash";
import { parseTimeStringToMs } from "../../utils/time";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { env } from "../../config/env";

export function buildTokenPair(userId: string, email: string, role: UserRole) {
  const accessToken = signAccessToken({ sub: userId, email, role });
  const refreshToken = signRefreshToken({ sub: userId });
  return { accessToken, refreshToken };
}

export async function storeRefreshToken(userId: string, rawToken: string): Promise<void> {
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + parseTimeStringToMs(env.JWT_REFRESH_EXPIRES_IN));

  await prisma.refreshToken.upsert({
    where: { tokenHash },
    create: { userId, tokenHash, expiresAt },
    update: { expiresAt, revokedAt: null },
  });
}

export async function findValidRefreshToken(rawToken: string) {
  const tokenHash = hashToken(rawToken);
  return prisma.refreshToken.findFirst({
    where: {
      tokenHash,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
  });
}

export async function revokeRefreshToken(id: string): Promise<void> {
  await prisma.refreshToken.update({
    where: { id },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAllUserTokens(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
