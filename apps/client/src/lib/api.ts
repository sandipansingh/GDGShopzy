import axios, { InternalAxiosRequestConfig } from "axios";
import { env } from "../config/env";
import { parseApiError } from "./api-error";
import { logger } from "./logger";
import { useAuthStore } from "../stores/auth.store";
import { ApiResponse, unwrapResponse } from "../types/api";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
  }
}

export const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const authClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;
const authPaths = [
  "/auth/login",
  "/auth/refresh",
  "/auth/logout",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const shouldSkipAuthRefresh = (config: InternalAxiosRequestConfig) => {
  if (config.skipAuthRefresh || config._retry) {
    return true;
  }

  const requestUrl = config.url ?? "";
  return authPaths.some((path) => requestUrl.includes(path));
};

export const refreshAccessToken = async () => {
  const response = await authClient.post<ApiResponse<{ accessToken: string }>>("/auth/refresh", {});

  return unwrapResponse(response).accessToken;
};

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const originalRequest = axios.isAxiosError(error) ? error.config : undefined;

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      originalRequest &&
      !shouldSkipAuthRefresh(originalRequest)
    ) {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken()
          .then((accessToken) => {
            useAuthStore.getState().setAccessToken(accessToken);
            return accessToken;
          })
          .catch((refreshError) => {
            const parsedRefreshError = parseApiError(refreshError);
            if (import.meta.env.DEV || parsedRefreshError.status !== 401) {
              logger.warn("Session refresh failed", parsedRefreshError);
            }
            useAuthStore.getState().clearSession();
            throw refreshError;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        const newToken = await refreshPromise;
        originalRequest._retry = true;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
