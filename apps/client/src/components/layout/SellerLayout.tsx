import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { ROUTES } from "../../lib/routes";
import { Button } from "../ui/Button";

export const SellerLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const navItems = [
    { label: "Dashboard", path: ROUTES.SELLER_DASHBOARD },
    { label: "Products", path: ROUTES.SELLER_PRODUCTS },
    { label: "Orders", path: ROUTES.SELLER_ORDERS },
    ...(user?.role === "SELLER" ? [{ label: "Employees", path: ROUTES.SELLER_EMPLOYEES }] : []),
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-surface-black text-body-on-dark flex flex-col">
        <div className="p-lg border-b border-ink-muted-80">
          <h1 className="text-tagline">Seller Portal</h1>
          <p className="text-caption text-body-muted mt-xs">
            {user?.sellerProfile?.storeName || user?.name}
          </p>
        </div>
        <nav className="flex-1 p-lg">
          <ul className="space-y-sm">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-sm py-xs rounded-sm text-button-utility ${
                    location.pathname === item.path
                      ? "bg-primary text-white"
                      : "hover:bg-ink-muted-80"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-lg border-t border-ink-muted-80">
          <Button variant="dark" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 bg-canvas-parchment">
        <Outlet />
      </main>
    </div>
  );
};
