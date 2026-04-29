import { OrderStatus, PaymentMethod } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { ApiError } from "../../utils/api-error";
import { ErrorCode } from "../../constants/error-codes";
import { buildCacheKey, deleteCache, deleteCachePattern } from "../../cache/cache.service";
import { notifyCheckoutCompleted } from "../email/email-notification.service";
import { logger } from "../../utils/logger";
import type { CheckoutInput } from "./checkout.schema";

export async function placeOrder(buyerId: string, input: CheckoutInput) {
  const cart = await prisma.cart.findUnique({
    where: { buyerId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new ApiError({ statusCode: 400, message: "Cart is empty", code: ErrorCode.CART_EMPTY });
  }

  const paymentMethod = input.paymentMethod as PaymentMethod;
  const orderStatus: OrderStatus = paymentMethod === "COD" ? OrderStatus.PENDING : OrderStatus.PAID;

  const sellerMap = new Map<string, typeof cart.items>();
  for (const item of cart.items) {
    const sellerId = item.product.sellerId;
    const group = sellerMap.get(sellerId) ?? [];
    group.push(item);
    sellerMap.set(sellerId, group);
  }

  const shippingBase = {
    shippingName: input.shippingName,
    shippingPhone: input.shippingPhone,
    shippingLine1: input.shippingLine1,
    shippingLine2: input.shippingLine2,
    shippingCity: input.shippingCity,
    shippingState: input.shippingState,
    shippingZip: input.shippingZip,
  };

  const createdOrders = await prisma.$transaction(async (tx) => {
    const orders: { id: string; sellerId: string; totalAmount: number }[] = [];

    for (const [sellerId, items] of sellerMap.entries()) {
      for (const item of items) {
        const freshProduct = await tx.product.findUnique({ where: { id: item.productId } });
        if (!freshProduct || freshProduct.stock < item.quantity) {
          throw new ApiError({
            statusCode: 400,
            message: `Product "${item.product.name}" has insufficient stock`,
            code: ErrorCode.OUT_OF_STOCK,
          });
        }
      }

      const totalAmount = items.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0,
      );

      const order = await tx.order.create({
        data: {
          buyerId,
          sellerId,
          status: orderStatus,
          totalAmount,
          paymentMethod,
          ...shippingBase,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price,
            })),
          },
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      orders.push({
        id: order.id,
        sellerId: order.sellerId,
        totalAmount: Number(order.totalAmount),
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return orders;
  });

  const affectedProductIds = new Set<string>();
  const affectedSellerIds = new Set<string>();

  for (const item of cart.items) {
    affectedProductIds.add(item.productId);
    affectedSellerIds.add(item.product.sellerId);
  }

  await Promise.all([
    deleteCachePattern("products:list:*"),
    ...Array.from(affectedProductIds).map((productId) =>
      deleteCache(buildCacheKey("products", "detail", productId)),
    ),
    ...Array.from(affectedSellerIds).map((sellerId) =>
      deleteCache(buildCacheKey("seller", "dashboard", sellerId)),
    ),
  ]);

  notifyCheckoutCompleted(
    buyerId,
    createdOrders.map((o) => o.id),
    {
      name: shippingBase.shippingName,
      phone: shippingBase.shippingPhone,
      line1: shippingBase.shippingLine1,
      line2: shippingBase.shippingLine2,
      city: shippingBase.shippingCity,
      state: shippingBase.shippingState,
      zip: shippingBase.shippingZip,
    },
    paymentMethod,
  ).catch((err) => {
    logger.error("[Checkout] Failed to send order emails:", err);
  });

  const fullOrders = await prisma.order.findMany({
    where: { id: { in: createdOrders.map((o) => o.id) } },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return fullOrders.map((order) => ({
    ...order,
    totalAmount: Number(order.totalAmount),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
    })),
  }));
}
