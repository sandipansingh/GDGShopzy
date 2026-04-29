import { prisma } from "../../../db/prisma";
import { ApiError } from "../../../utils/api-error";
import { ErrorCode } from "../../../constants/error-codes";
import { buildPaginationMeta } from "../../../utils/pagination";
import { buildCacheKey, deleteCache, deleteCachePattern } from "../../../cache/cache.service";
import { transformProduct } from "../product.transformer";
import type { CreateProductInput, UpdateProductInput } from "../product.schema";

async function invalidateProductCaches(productId: string, sellerId: string): Promise<void> {
  await Promise.all([
    deleteCachePattern("products:list:*"),
    deleteCache(buildCacheKey("products", "detail", productId)),
    deleteCache(buildCacheKey("seller", "dashboard", sellerId)),
  ]);
}

export async function listSellerProducts(sellerId: string, page: number = 1, limit: number = 12) {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where: { sellerId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where: { sellerId } }),
  ]);

  return {
    items: items.map(transformProduct),
    pagination: buildPaginationMeta(page, limit, total),
  };
}

export async function getSellerProduct(sellerId: string, productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId, sellerId },
  });

  if (!product) {
    throw new ApiError({
      statusCode: 404,
      message: "Product not found",
      code: ErrorCode.PRODUCT_NOT_FOUND,
    });
  }

  return transformProduct(product);
}

export async function createProduct(sellerId: string, input: CreateProductInput) {
  const product = await prisma.product.create({
    data: {
      sellerId,
      name: input.name,
      description: input.description,
      category: input.category,
      price: input.price,
      stock: input.stock,
      imageKey: input.imageKey,
      imageUrl: input.imageUrl,
    },
  });

  await invalidateProductCaches(product.id, sellerId);

  return transformProduct(product);
}

export async function updateProduct(
  sellerId: string,
  productId: string,
  input: UpdateProductInput,
) {
  await getSellerProduct(sellerId, productId);

  const product = await prisma.product.update({
    where: { id: productId },
    data: input,
  });

  await invalidateProductCaches(productId, sellerId);

  return transformProduct(product);
}

export async function deleteProduct(sellerId: string, productId: string): Promise<void> {
  await getSellerProduct(sellerId, productId);
  await prisma.product.delete({ where: { id: productId } });
  await invalidateProductCaches(productId, sellerId);
}
