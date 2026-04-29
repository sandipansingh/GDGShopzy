import { prisma } from "../../db/prisma";
import { ApiError } from "../../utils/api-error";
import { ErrorCode } from "../../constants/error-codes";
import type { AddCartItemInput, UpdateCartItemInput } from "./cart.schema";

async function getOrCreateCart(buyerId: string) {
  return prisma.cart.upsert({
    where: { buyerId },
    update: {},
    create: { buyerId },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, price: true, stock: true, imageUrl: true } },
        },
      },
    },
  });
}

export async function getCart(buyerId: string) {
  return getOrCreateCart(buyerId);
}

export async function addItem(buyerId: string, input: AddCartItemInput) {
  const cart = await getOrCreateCart(buyerId);

  const product = await prisma.product.findUnique({ where: { id: input.productId } });
  if (!product) {
    throw new ApiError({
      statusCode: 404,
      message: "Product not found",
      code: ErrorCode.PRODUCT_NOT_FOUND,
    });
  }
  if (product.stock <= 0) {
    throw new ApiError({
      statusCode: 400,
      message: "Product is out of stock",
      code: ErrorCode.OUT_OF_STOCK,
    });
  }

  const existing = cart.items.find((i) => i.productId === input.productId);
  const newQuantity = (existing?.quantity ?? 0) + input.quantity;

  if (newQuantity > product.stock) {
    throw new ApiError({
      statusCode: 400,
      message: `Only ${product.stock} units available`,
      code: ErrorCode.OUT_OF_STOCK,
    });
  }

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQuantity },
    });
  }

  return prisma.cartItem.create({
    data: { cartId: cart.id, productId: input.productId, quantity: input.quantity },
  });
}

export async function updateItem(buyerId: string, itemId: string, input: UpdateCartItemInput) {
  const cart = await prisma.cart.findUnique({ where: { buyerId } });
  if (!cart) {
    throw new ApiError({ statusCode: 404, message: "Cart not found", code: ErrorCode.NOT_FOUND });
  }

  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
  if (!item) {
    throw new ApiError({
      statusCode: 404,
      message: "Cart item not found",
      code: ErrorCode.NOT_FOUND,
    });
  }

  const product = await prisma.product.findUnique({ where: { id: item.productId } });
  if (product && input.quantity > product.stock) {
    throw new ApiError({
      statusCode: 400,
      message: `Only ${product.stock} units available`,
      code: ErrorCode.OUT_OF_STOCK,
    });
  }

  return prisma.cartItem.update({ where: { id: itemId }, data: { quantity: input.quantity } });
}

export async function removeItem(buyerId: string, itemId: string): Promise<void> {
  const cart = await prisma.cart.findUnique({ where: { buyerId } });
  if (!cart) {
    throw new ApiError({ statusCode: 404, message: "Cart not found", code: ErrorCode.NOT_FOUND });
  }

  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
  if (!item) {
    throw new ApiError({
      statusCode: 404,
      message: "Cart item not found",
      code: ErrorCode.NOT_FOUND,
    });
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
}

export async function clearCart(buyerId: string): Promise<void> {
  const cart = await prisma.cart.findUnique({ where: { buyerId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}
