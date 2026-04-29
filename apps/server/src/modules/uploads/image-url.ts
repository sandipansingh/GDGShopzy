import { env } from "../../config/env";

export function buildProductImageUrl(imageKey: string | null): string | null {
  if (!imageKey) return null;
  return `${env.PUBLIC_API_URL}/api/v1/uploads/images/${imageKey}`;
}

export function validateImageKey(imageKey: string): boolean {
  if (!imageKey || typeof imageKey !== "string") return false;
  if (imageKey.includes("..")) return false;
  if (imageKey.startsWith("/")) return false;
  if (imageKey.includes("\\")) return false;
  if (imageKey.includes("\0")) return false;
  if (!imageKey.startsWith("products/")) return false;

  const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const hasValidExtension = validExtensions.some((ext) => imageKey.toLowerCase().endsWith(ext));

  return hasValidExtension;
}
