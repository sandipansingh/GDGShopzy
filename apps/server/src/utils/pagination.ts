import { PaginationMeta } from "../types/api";

export interface ParsedPagination {
  page: number;
  limit: number;
  skip: number;
}

export function parsePagination(
  rawPage: unknown,
  rawLimit: unknown,
  defaultLimit = 12,
): ParsedPagination {
  const page = Math.max(1, Number(rawPage) || 1);
  const limit = Math.min(100, Math.max(1, Number(rawLimit) || defaultLimit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
