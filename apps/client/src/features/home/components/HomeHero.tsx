import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { ROUTES } from "../../../lib/routes";

const highlights = [
  "Browse products from trusted sellers",
  "Clear pricing and real-time stock information",
  "Smooth checkout and order tracking",
];

export const HomeHero = () => {
  return (
    <section className="border-b border-border">
      <div className="content-container grid min-h-[100dvh] gap-16 py-24 pb-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.75fr)] lg:items-end lg:py-28 lg:pb-24">
        <div className="relative space-y-8">
          <div className="accent-rule" />
          <p className="section-label">Shop smarter with GDGShopzy</p>
          <div className="space-y-6">
            <h1 className="max-w-5xl font-display text-hero-display uppercase">
              Discover products
              <br />
              you'll love.
            </h1>
            <p className="max-w-2xl text-lead text-muted-foreground">
              Discover products from trusted sellers, manage your cart, and checkout with a smooth
              buying experience.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Button asChild variant="primary" size="lg">
              <Link to={ROUTES.PRODUCTS}>Browse products</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to={ROUTES.REGISTER_SELLER}>Become a seller</Link>
            </Button>
          </div>
          <div className="grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
            {highlights.map((text, index) => (
              <div key={text}>
                <p className="font-display text-4xl uppercase tracking-[-0.05em] text-foreground md:text-5xl">
                  {`0${index + 1}`}
                </p>
                <p className="mt-2 text-body text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-8 lg:border-l lg:pl-10 lg:pt-0">
          <p className="section-label">Why choose GDGShopzy</p>
          <div className="space-y-6">
            <div className="border-b border-border pb-6">
              <h2 className="text-3xl uppercase tracking-[-0.05em] md:text-4xl">
                Simple and reliable shopping.
              </h2>
              <p className="mt-3 text-body text-muted-foreground">
                Find what you need, add it to your cart, and complete checkout in minutes.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="min-w-0 border border-border p-6">
                <p className="section-label">For buyers</p>
                <p className="mt-3 break-words text-xl uppercase leading-tight tracking-[-0.04em] text-foreground md:text-2xl">
                  Shop with confidence.
                </p>
              </div>
              <div className="min-w-0 border border-border p-6">
                <p className="section-label">For sellers</p>
                <p className="mt-3 break-words text-xl uppercase leading-tight tracking-[-0.04em] text-foreground md:text-2xl">
                  Grow your business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
