import { Link } from "react-router-dom";
import { ROUTES } from "../../lib/routes";

export const Footer = () => {
  return (
    <footer className="border-t border-border py-20">
      <div className="content-container">
        <div className="grid gap-12 border-b border-border pb-12 lg:grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(0,0.7fr))]">
          <div className="space-y-5">
            <p className="section-label">GDGShopzy</p>
            <h2 className="max-w-md font-display text-4xl uppercase leading-none tracking-[-0.05em] text-foreground md:text-5xl">
              Shop smarter. Sell better.
            </h2>
            <p className="max-w-xl text-body text-muted-foreground">
              A modern marketplace connecting buyers with trusted sellers. Browse products, manage
              your cart, and complete checkout with ease.
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-muted-foreground">
              Shop
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to={ROUTES.PRODUCTS} className="text-body text-foreground">
                  All Products
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-muted-foreground">
              Account
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to={ROUTES.LOGIN} className="text-body text-foreground">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to={ROUTES.REGISTER_BUYER} className="text-body text-foreground">
                  Register as Buyer
                </Link>
              </li>
              <li>
                <Link to={ROUTES.REGISTER_SELLER} className="text-body text-foreground">
                  Register as Seller
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-fine-print text-muted-foreground">
            © {new Date().getFullYear()} GDGShopzy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
