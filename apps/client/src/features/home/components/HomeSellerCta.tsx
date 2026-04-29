import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { ROUTES } from "../../../lib/routes";

export const HomeSellerCta = () => {
  return (
    <section className="py-20 md:py-[10rem]">
      <div className="content-container">
        <div className="grid gap-8 border border-border bg-muted p-8 md:p-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
          <div className="space-y-5">
            <p className="section-label">Sell with GDGShopzy</p>
            <h2 className="max-w-3xl text-display-md uppercase">
              Manage products, track orders, and grow your business.
            </h2>
            <p className="max-w-2xl text-body text-muted-foreground">
              Set up your seller account, manage your inventory, and invite your team from one
              simple dashboard.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 lg:justify-end">
            <Button asChild variant="primary" size="lg">
              <Link to={ROUTES.REGISTER_SELLER}>Create seller account</Link>
            </Button>
            <Button asChild variant="dark" size="lg">
              <Link to={ROUTES.PRODUCTS}>Browse products</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
