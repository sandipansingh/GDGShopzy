import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { ROUTES } from "../../lib/routes";

export const ForbiddenPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas-parchment">
      <div className="text-center">
        <h1 className="text-hero-display text-ink mb-lg">403</h1>
        <p className="text-lead text-ink-muted-80 mb-xl">Forbidden</p>
        <p className="text-body text-ink-muted-80 mb-xl">
          You don&apos;t have permission to access this page
        </p>
        <Link to={ROUTES.HOME}>
          <Button variant="primary">Go Home</Button>
        </Link>
      </div>
    </div>
  );
};
