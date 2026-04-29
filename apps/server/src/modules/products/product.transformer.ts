import { Product } from "@prisma/client";
import { buildProductImageUrl } from "../uploads/image-url";

type ProductWithImage = Pick<
  Product,
  | "id"
  | "name"
  | "description"
  | "category"
  | "price"
  | "stock"
  | "imageUrl"
  | "imageKey"
  | "sellerId"
  | "createdAt"
>;

export function transformProduct<T extends ProductWithImage>(product: T): T {
  return {
    ...product,
    imageUrl: product.imageKey ? buildProductImageUrl(product.imageKey) : product.imageUrl,
  };
}
