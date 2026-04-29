import { prisma } from "../../db/prisma";
import { emailConfig } from "./email.config";
import { buildClientUrl } from "./email.utils";
import { logger } from "../../utils/logger";
import {
  sendEmployeeInviteEmail,
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail,
  sendBuyerOrderConfirmationEmail,
  sendSellerNewOrderNotificationEmail,
  sendBuyerOrderStatusUpdateEmail,
  sendSellerOrderStatusUpdateNotificationEmail,
} from "./email.service";

export async function notifyEmployeeInviteCreated(
  email: string,
  token: string,
  expiresAt: Date,
  sellerId: string,
) {
  try {
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
      select: { storeName: true },
    });

    if (!seller) return;

    const inviteLink = buildClientUrl(`/register/employee?token=${token}`);

    await sendEmployeeInviteEmail({
      toEmail: email,
      storeName: seller.storeName,
      inviteLink,
      expiresAt,
    });
  } catch (error) {
    logger.error("[Email] Failed to send employee invite:", error);
  }
}

export async function notifyPasswordResetRequested(userId: string, token: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    if (!user) return;

    const resetLink = buildClientUrl(`/reset-password?token=${token}`);

    await sendPasswordResetEmail({
      toEmail: user.email,
      userName: user.name,
      resetLink,
      expiresMinutes: emailConfig.passwordResetTokenExpiresMinutes,
    });
  } catch (error) {
    logger.error("[Email] Failed to send password reset:", error);
  }
}

export async function notifyPasswordResetCompleted(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    if (!user) return;

    await sendPasswordResetConfirmationEmail({
      toEmail: user.email,
      userName: user.name,
    });
  } catch (error) {
    logger.error("[Email] Failed to send password reset confirmation:", error);
  }
}

export async function notifyCheckoutCompleted(
  buyerId: string,
  orderIds: string[],
  shippingInfo: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  },
  paymentMethod: string,
) {
  try {
    const [buyer, orders] = await Promise.all([
      prisma.user.findUnique({
        where: { id: buyerId },
        select: { name: true, email: true },
      }),
      prisma.order.findMany({
        where: { id: { in: orderIds } },
        include: {
          items: {
            include: {
              product: { select: { name: true } },
            },
          },
          seller: {
            select: {
              id: true,
              storeName: true,
              owner: { select: { email: true } },
            },
          },
        },
      }),
    ]);

    if (!buyer || orders.length === 0) return;

    const buyerOrders = orders.map((order) => ({
      orderId: order.id,
      items: order.items.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
      })),
      totalAmount: Number(order.totalAmount),
    }));

    await sendBuyerOrderConfirmationEmail({
      toEmail: buyer.email,
      buyerName: buyer.name,
      orders: buyerOrders,
      shippingAddress: shippingInfo,
      paymentMethod,
    });

    const sellerNotifications = orders.map(async (order) => {
      await sendSellerNewOrderNotificationEmail({
        toEmail: order.seller.owner.email,
        storeName: order.seller.storeName,
        orderId: order.id,
        buyerName: buyer.name,
        buyerEmail: buyer.email,
        items: order.items.map((item) => ({
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
        })),
        totalAmount: Number(order.totalAmount),
        shippingCity: order.shippingCity,
        shippingState: order.shippingState,
      });

      if (emailConfig.notifyEmployeesOnNewOrder) {
        const employees = await prisma.employee.findMany({
          where: { sellerId: order.seller.id },
          include: { user: { select: { email: true } } },
        });

        await Promise.all(
          employees.map((emp) =>
            sendSellerNewOrderNotificationEmail({
              toEmail: emp.user.email,
              storeName: order.seller.storeName,
              orderId: order.id,
              buyerName: buyer.name,
              buyerEmail: buyer.email,
              items: order.items.map((item) => ({
                productName: item.product.name,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
              })),
              totalAmount: Number(order.totalAmount),
              shippingCity: order.shippingCity,
              shippingState: order.shippingState,
            }),
          ),
        );
      }
    });

    await Promise.all(sellerNotifications);
  } catch (error) {
    logger.error("[Email] Failed to send checkout notifications:", error);
  }
}

export async function notifyOrderStatusChanged(
  orderId: string,
  oldStatus: string,
  newStatus: string,
) {
  if (oldStatus === newStatus) return;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: { select: { name: true, email: true } },
        seller: {
          select: {
            storeName: true,
            owner: { select: { email: true } },
          },
        },
      },
    });

    if (!order) return;

    await sendBuyerOrderStatusUpdateEmail({
      toEmail: order.buyer.email,
      buyerName: order.buyer.name,
      orderId: order.id,
      oldStatus,
      newStatus,
      totalAmount: Number(order.totalAmount),
    });

    await sendSellerOrderStatusUpdateNotificationEmail({
      toEmail: order.seller.owner.email,
      storeName: order.seller.storeName,
      orderId: order.id,
      oldStatus,
      newStatus,
    });
  } catch (error) {
    logger.error("[Email] Failed to send order status update notifications:", error);
  }
}
