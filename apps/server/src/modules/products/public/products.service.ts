import { Prisma } from "@prisma/client";
import { prisma } from "../../../db/prisma";
import { buildPaginationMeta } from "../../../utils/pagination";
import { ApiError } from "../../../utils/api-error";
import { ErrorCode } from "../../../constants/error-codes";
import { buildCacheKey, getOrSetCache } from "../../../cache/cache.service";
import { cacheTtl } from "../../../config/redis.config";
import { transformProduct } from "../product.transformer";

interface ListProductsQuery {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  includeOutOfStock?: boolean;
}

export async function listProducts(query: ListProductsQuery) {
  const page = query.page || 1;
  const limit = query.limit || 12;

  const cacheKey = buildCacheKey(
    "products",
    "list",
    `search=${query.search || ""}`,
    `category=${query.category || ""}`,
    `page=${page}`,
    `limit=${limit}`,
    `stock=${query.includeOutOfStock || false}`,
  );

  return getOrSetCache(
    cacheKey,
    async () => {
      const skip = (page - 1) * limit;

      const where: Prisma.ProductWhereInput = {
        ...(query.search
          ? {
              OR: [
                { name: { contains: query.search, mode: "insensitive" } },
                { description: { contains: query.search, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(query.category ? { category: { equals: query.category, mode: "insensitive" } } : {}),
        ...(!query.includeOutOfStock ? { stock: { gt: 0 } } : {}),
      };

      const [items, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            price: true,
            stock: true,
            imageUrl: true,
            imageKey: true,
            sellerId: true,
            createdAt: true,
          },
        }),
        prisma.product.count({ where }),
      ]);

      return {
        items: items.map(transformProduct),
        pagination: buildPaginationMeta(page, limit, total),
      };
    },
    cacheTtl.productListTtlSeconds,
  );
}

export async function getProduct(productId: string) {
  const cacheKey = buildCacheKey("products", "detail", productId);

  return getOrSetCache(
    cacheKey,
    async () => {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          price: true,
          stock: true,
          imageUrl: true,
          imageKey: true,
          sellerId: true,
          createdAt: true,
          seller: { select: { storeName: true } },
        },
      });

      if (!product) {
        throw new ApiError({
          statusCode: 404,
          message: "Product not found",
          code: ErrorCode.PRODUCT_NOT_FOUND,
        });
      }

      return transformProduct(product);
    },
    cacheTtl.productDetailTtlSeconds,
  );
}
