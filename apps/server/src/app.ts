import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import hpp from "hpp";
import morgan from "morgan";
import { helmetConfig } from "./config/security.config";
import { corsOptions } from "./config/cors.config";
import { globalApiRateLimiter } from "./config/rate-limit.config";
import { env } from "./config/env";
import healthRoutes from "./modules/health/health.routes";
import v1Router from "./routes/v1.routes";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import logger from "./utils/logger";

const app = express();

if (env.TRUST_PROXY) {
  app.set("trust proxy", 1);
}

app.use(helmetConfig);
app.use(compression());

app.use("/api/v1/health", healthRoutes);

app.use(cors(corsOptions));

app.use(express.json({ limit: env.REQUEST_BODY_LIMIT }));
app.use(express.urlencoded({ extended: false, limit: env.REQUEST_BODY_LIMIT }));
app.use(cookieParser());
app.use(hpp());

app.use(
  morgan(env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: {
      write: (message: string) => logger.http(message.trim()),
    },
  }),
);

app.use("/api/v1", globalApiRateLimiter, v1Router);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
