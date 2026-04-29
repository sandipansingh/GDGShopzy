import { Outlet, Navigate } from "react-router-dom";
import { getRoleHomePath } from "../../lib/auth";
import { useAuthStore } from "../../stores/auth.store";

export const AuthLayout = () => {
  const { isAuthenticated, isInitialized, user } = useAuthStore();

  if (isInitialized && isAuthenticated && user) {
    return <Navigate to={getRoleHomePath(user.role)} replace />;
  }

  return (
    <div className="min-h-screen bg-canvas-parchment flex items-center justify-center py-section px-lg">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};
