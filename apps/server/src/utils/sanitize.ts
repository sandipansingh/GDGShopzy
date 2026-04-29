import { UserRole } from "@prisma/client";

export function trimString(value: string): string {
  return value.trim();
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function sanitizePlainText(value: string): string {
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}

export function hasDangerousHtml(value: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /on\w+\s*=/i,
    /javascript:/i,
  ];

  return dangerousPatterns.some((pattern) => pattern.test(value));
}

export function sanitizeUser(user: { id: string; name: string; email: string; role: UserRole }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
