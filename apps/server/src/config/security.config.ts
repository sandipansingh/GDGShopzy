import helmet from "helmet";
import { env } from "./env";

export const helmetConfig = helmet({
  hidePoweredBy: true,
  noSniff: true,
  frameguard: { action: "deny" },
  referrerPolicy: { policy: "no-referrer" },
  dnsPrefetchControl: { allow: false },
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts:
    env.NODE_ENV === "production"
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      imgSrc: ["'self'", "data:", "blob:"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc:
        env.NODE_ENV === "development"
          ? ["'self'", ...env.CORS_ORIGINS.split(",").map((o) => o.trim())]
          : ["'self'"],
    },
  },
});
