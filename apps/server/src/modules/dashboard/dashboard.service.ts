import { prisma } from "../../db/prisma";
import { buildCacheKey, getOrSetCache } from "../../cache/cache.service";
import { cacheTtl } from "../../config/redis.config";

const LOW_STOCK_THRESHOLD = 5;
const RECENT_ORDERS_LIMIT = 5;

export async function getDashboardStats(sellerId: string) {
  const cacheKey = buildCacheKey("seller", "dashboard-v2", sellerId);

  return getOrSetCache(
    cacheKey,
    async () => {
      const [totalProducts, totalOrders, revenueResult, lowStockProducts, recentOrders] =
        await Promise.all([
          prisma.product.count({ where: { sellerId } }),

          prisma.order.count({ where: { sellerId } }),

          prisma.order.aggregate({
            where: { sellerId, status: { not: "CANCELLED" } },
            _sum: { totalAmount: true },
          }),

          prisma.product.findMany({
            where: { sellerId, stock: { lte: LOW_STOCK_THRESHOLD } },
            orderBy: [{ stock: "asc" }, { createdAt: "desc" }],
            take: LOW_STOCK_THRESHOLD,
          }),

          prisma.order.findMany({
            where: { sellerId },
            take: RECENT_ORDERS_LIMIT,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              status: true,
              totalAmount: true,
              paymentMethod: true,
              createdAt: true,
              buyer: { select: { name: true, email: true } },
            },
          }),
        ]);

      const totalRevenue = revenueResult._sum.totalAmount
        ? Number(revenueResult._sum.totalAmount)
        : 0;

      return {
        totalProducts,
        totalOrders,
        totalRevenue,
        lowStockProducts,
        recentOrders,
      };
    },
    cacheTtl.sellerDashboardTtlSeconds,
  );
}
