import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { ROUTES } from "../../lib/routes";
import { Button } from "../ui/Button";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="content-container flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-10">
          <Link to={ROUTES.HOME} className="inline-flex flex-col">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
              Marketplace
            </span>
            <span className="font-display text-xl uppercase tracking-[-0.04em] text-foreground">
              GDGShopzy
            </span>
          </Link>
          <div className="flex flex-wrap gap-5">
            <Link
              to={ROUTES.HOME}
              className={`text-nav-link ${
                location.pathname === ROUTES.HOME ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to={ROUTES.PRODUCTS}
              className={`text-nav-link ${
                location.pathname === ROUTES.PRODUCTS ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Products
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          {isAuthenticated ? (
            <>
              {user?.role === "BUYER" && (
                <>
                  <Link to={ROUTES.BUYER_ACCOUNT}>
                    <Button variant="dark" size="default">
                      Account
                    </Button>
                  </Link>
                  <Link to={ROUTES.BUYER_CART}>
                    <Button variant="dark" size="default">
                      Cart
                    </Button>
                  </Link>
                  <Link to={ROUTES.BUYER_ORDERS}>
                    <Button variant="dark" size="default">
                      Orders
                    </Button>
                  </Link>
                </>
              )}
              {(user?.role === "SELLER" || user?.role === "EMPLOYEE") && (
                <Link to={ROUTES.SELLER_DASHBOARD}>
                  <Button variant="dark" size="default">
                    Dashboard
                  </Button>
                </Link>
              )}
              <Button variant="secondary" size="default" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="primary" size="default">
                <Link to={ROUTES.LOGIN}>Sign In</Link>
              </Button>
              <Button asChild variant="secondary" size="default">
                <Link to={ROUTES.REGISTER_BUYER}>Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
