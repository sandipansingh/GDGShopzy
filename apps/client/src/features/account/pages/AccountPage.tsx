import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { ROUTES } from "../../../lib/routes";
import { useAuthStore } from "../../../stores/auth.store";

export const AccountPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="content-container flex max-w-4xl flex-1 flex-col gap-xl py-16 md:py-24">
      <header className="rounded-lg bg-canvas-parchment p-xl">
        <p className="text-caption-strong text-primary">Your Account</p>
        <h1 className="mt-sm text-display-md text-ink">{user?.name ?? "Buyer Account"}</h1>
        <p className="mt-sm text-body text-ink-muted-80">
          Signed in as {user?.email ?? "an authenticated buyer"}.
        </p>
      </header>

      <section className="grid gap-lg md:grid-cols-2">
        <div className="rounded-lg border border-hairline bg-canvas p-xl">
          <h2 className="text-tagline text-ink">Orders</h2>
          <p className="mt-sm text-body text-ink-muted-80">
            Review current and past purchases from your buyer dashboard.
          </p>
          <Link to={ROUTES.BUYER_ORDERS} className="mt-lg inline-block">
            <Button variant="primary">View Orders</Button>
          </Link>
        </div>

        <div className="rounded-lg border border-hairline bg-canvas p-xl">
          <h2 className="text-tagline text-ink">Cart</h2>
          <p className="mt-sm text-body text-ink-muted-80">
            Continue checkout or update the items you plan to buy.
          </p>
          <Link to={ROUTES.BUYER_CART} className="mt-lg inline-block">
            <Button variant="secondary">Open Cart</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
