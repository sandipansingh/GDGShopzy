import { CorsOptions } from "cors";
import { env } from "./env";

const allowedOrigins = env.CORS_ORIGINS.split(",").map((o) => o.trim());

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
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

export const publicCorsOptions: CorsOptions = {
  origin: "*",
  credentials: false,
  methods: ["GET", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};
