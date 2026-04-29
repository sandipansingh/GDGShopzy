import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { ROUTES } from "../../lib/routes";

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas-parchment">
      <div className="text-center">
        <h1 className="text-hero-display text-ink mb-lg">401</h1>
        <p className="text-lead text-ink-muted-80 mb-xl">Unauthorized</p>
        <p className="text-body text-ink-muted-80 mb-xl">You need to sign in to access this page</p>
        <Link to={ROUTES.LOGIN}>
          <Button variant="primary">Sign In</Button>
        </Link>
      </div>
    </div>
  );
};
