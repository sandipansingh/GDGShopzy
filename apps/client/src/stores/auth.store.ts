import { create } from "zustand";
import { AuthUser } from "../types/auth";
import { api, refreshAccessToken } from "../lib/api";
import { ApiResponse, unwrapResponse } from "../types/api";

let refreshSessionPromise: Promise<void> | null = null;

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  setSession: (user: AuthUser, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearSession: () => void;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  setSession: (user, accessToken) => {
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isInitialized: true,
    });
  },

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  clearSession: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: true,
    });
  },

  refreshSession: async () => {
    if (get().isInitialized) {
      return;
    }

    if (refreshSessionPromise) {
      return refreshSessionPromise;
    }

    set({ isLoading: true });
    refreshSessionPromise = (async () => {
      try {
        const accessToken = await refreshAccessToken();
        set({ accessToken });

        const userData = await api.get<ApiResponse<AuthUser>>("/auth/me", {
          skipAuthRefresh: true,
        });
        set({
          user: unwrapResponse(userData),
          isAuthenticated: true,
          isInitialized: true,
        });
      } catch {
        get().clearSession();
      } finally {
        set({ isLoading: false });
        refreshSessionPromise = null;
      }
    })();

    return refreshSessionPromise;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      get().clearSession();
    }
  },
}));
