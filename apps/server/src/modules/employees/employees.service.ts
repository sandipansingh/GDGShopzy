import { v4 as uuidv4 } from "uuid";
import { prisma } from "../../db/prisma";
import { ApiError } from "../../utils/api-error";
import { ErrorCode } from "../../constants/error-codes";
import { env } from "../../config/env";
import { notifyEmployeeInviteCreated } from "../email/email-notification.service";
import { logger } from "../../utils/logger";
import type { InviteEmployeeInput } from "./employees.schema";

const MAX_EMPLOYEES = 2;

export async function inviteEmployee(sellerId: string, input: InviteEmployeeInput) {
  const activeCount = await prisma.employee.count({ where: { sellerId } });
  if (activeCount >= MAX_EMPLOYEES) {
    throw new ApiError({
      statusCode: 400,
      message: `Employee limit of ${MAX_EMPLOYEES} reached`,
      code: ErrorCode.EMPLOYEE_LIMIT_REACHED,
    });
  }

  const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
  if (existingUser) {
    const existingEmployee = await prisma.employee.findFirst({
      where: { userId: existingUser.id, sellerId },
    });
    if (existingEmployee) {
      throw new ApiError({
        statusCode: 409,
        message: "This employee is already linked to your store",
        code: ErrorCode.CONFLICT,
      });
    }
  }

  const pendingInvite = await prisma.employeeInvite.findFirst({
    where: {
      email: input.email,
      sellerId,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });
  if (pendingInvite) {
    throw new ApiError({
      statusCode: 409,
      message: "An active invite already exists for this email",
      code: ErrorCode.CONFLICT,
    });
  }

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + env.EMPLOYEE_INVITE_EXPIRES_HOURS * 60 * 60 * 1000);

  await prisma.employeeInvite.create({
    data: { email: input.email, token, sellerId, expiresAt },
  });

  const inviteLink = `${env.CLIENT_URL}/register/employee?token=${token}`;

  notifyEmployeeInviteCreated(input.email, token, expiresAt, sellerId).catch((err) => {
    logger.error("[Employee] Failed to send invite email:", err);
  });

  return { inviteLink, token, expiresAt };
}

export async function listEmployees(sellerId: string) {
  return prisma.employee.findMany({
    where: { sellerId },
    include: {
      user: { select: { id: true, name: true, email: true, createdAt: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function removeEmployee(sellerId: string, employeeId: string): Promise<void> {
  const employee = await prisma.employee.findFirst({
    where: { id: employeeId, sellerId },
  });

  if (!employee) {
    throw new ApiError({
      statusCode: 404,
      message: "Employee not found",
      code: ErrorCode.NOT_FOUND,
    });
  }

  await prisma.employee.delete({ where: { id: employeeId } });
}
