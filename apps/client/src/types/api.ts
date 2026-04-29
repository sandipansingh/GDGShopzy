import type { AxiosResponse } from "axios";

export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiMessageResponse {
  success: true;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  details?: unknown;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedItemsResponse<T> {
  items: T[];
  pagination: Pagination;
}

export const unwrapResponse = <T>(response: AxiosResponse<ApiResponse<T>>) => response.data.data;

export const unwrapMessage = (response: AxiosResponse<ApiMessageResponse>) => response.data.message;

export const getPaginatedItems = <T>(data: T[] | PaginatedItemsResponse<T>) =>
  Array.isArray(data) ? data : data.items;
