import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const BuyerLayout = () => {
  return (
    <div className="page-shell flex flex-col">
      <a
        href="#main-content"
        className="sr-only left-6 top-4 z-[60] bg-accent px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-accent-foreground focus:not-sr-only focus:absolute"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
