import { useEffect } from "react";
import { AppProviders } from "./providers";
import { AppRoutes } from "../routes/AppRoutes";
import { useAuthStore } from "../stores/auth.store";

export const App = () => {
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      void useAuthStore.getState().refreshSession();
    }
  }, [isInitialized]);

  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};
