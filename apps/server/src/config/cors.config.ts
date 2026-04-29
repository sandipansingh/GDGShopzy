import { CorsOptions } from "cors";
import { env } from "./env";

const allowedOrigins = env.CORS_ORIGINS.split(",").map((o) => o.trim());

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (env.NODE_ENV === "development" && !origin) {
      return callback(null, true);
    }

    if (!origin) {
      return callback(new Error("CORS: No origin header provided"));
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
  credentials: env.CORS_CREDENTIALS,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
