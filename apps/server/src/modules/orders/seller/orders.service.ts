import { OrderStatus } from "@prisma/client";
import { prisma } from "../../../db/prisma";
import { ApiError } from "../../../utils/api-error";
import { ErrorCode } from "../../../constants/error-codes";
import { buildPaginationMeta } from "../../../utils/pagination";
import { buildCacheKey, deleteCache } from "../../../cache/cache.service";
import { notifyOrderStatusChanged } from "../../email/email-notification.service";
import { logger } from "../../../utils/logger";
import type { UpdateOrderStatusInput } from "../order.schema";

const ORDER_INCLUDE = {
  items: {
    include: {
      product: { select: { id: true, name: true, imageUrl: true } },
    },
  },
  buyer: { select: { id: true, name: true, email: true } },
};

export async function listSellerOrders(sellerId: string, page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where: { sellerId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: ORDER_INCLUDE,
    }),
    prisma.order.count({ where: { sellerId } }),
  ]);

  return { items, pagination: buildPaginationMeta(page, limit, total) };
}

export async function getSellerOrder(sellerId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, sellerId },
    include: ORDER_INCLUDE,
  });

  if (!order) {
    throw new ApiError({ statusCode: 404, message: "Order not found", code: ErrorCode.NOT_FOUND });
  }

  return order;
}

export async function updateOrderStatus(
  sellerId: string,
  orderId: string,
  input: UpdateOrderStatusInput,
) {
  const existingOrder = await getSellerOrder(sellerId, orderId);
  const oldStatus = existingOrder.status;
  const newStatus = input.status as OrderStatus;

  if (oldStatus === newStatus) {
    return existingOrder;
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  await deleteCache(buildCacheKey("seller", "dashboard", sellerId));

  notifyOrderStatusChanged(orderId, oldStatus, newStatus).catch((err) => {
    logger.error("[Order] Failed to send status update emails:", err);
  });

  return updatedOrder;
}
