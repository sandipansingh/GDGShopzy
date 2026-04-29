import { prisma } from "../../../db/prisma";
import { ApiError } from "../../../utils/api-error";
import { ErrorCode } from "../../../constants/error-codes";
import { buildPaginationMeta } from "../../../utils/pagination";

const ORDER_INCLUDE = {
  items: {
    include: {
      product: {
        select: { id: true, name: true, imageUrl: true, category: true },
      },
    },
  },
  seller: { select: { storeName: true, id: true } },
};

export async function listBuyerOrders(buyerId: string, page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where: { buyerId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: ORDER_INCLUDE,
    }),
    prisma.order.count({ where: { buyerId } }),
  ]);

  return { items, pagination: buildPaginationMeta(page, limit, total) };
}

export async function getBuyerOrder(buyerId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, buyerId },
    include: ORDER_INCLUDE,
  });

  if (!order) {
    throw new ApiError({ statusCode: 404, message: "Order not found", code: ErrorCode.NOT_FOUND });
  }

  return order;
}
