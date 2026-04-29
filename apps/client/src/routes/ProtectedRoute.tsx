import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { ROUTES } from "../lib/routes";
import { PageLoader } from "../components/shared/PageLoader";

export const ProtectedRoute = () => {
  const { isAuthenticated, isInitialized, isLoading } = useAuthStore();
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen">
        <PageLoader minHeightClassName="min-h-screen" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
