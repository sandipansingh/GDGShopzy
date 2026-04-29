import { Router, Request, Response } from "express";
import { apiReference } from "@scalar/express-api-reference";
import { openApiSpec, regenerateOpenApiSpec } from "./openapi";
import { env } from "../config/env";
import logger from "../utils/logger";

const router = Router();

if (!env.API_DOCS_ENABLED) {
  const disabledHandler = (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: "API documentation is disabled",
      code: "NOT_FOUND",
    });
  };

  router.use("/docs", disabledHandler);
  router.get("/openapi.json", disabledHandler);
} else {
  router.get("/openapi.json", (req: Request, res: Response) => {
    try {
      res.json(openApiSpec);
    } catch (error) {
      logger.error("Error serving OpenAPI spec:", { error });
      res.status(500).json({
        success: false,
        message: "Failed to generate OpenAPI specification",
        code: "INTERNAL_ERROR",
      });
    }
  });

  if (env.NODE_ENV !== "production") {
    router.post("/regenerate", (req: Request, res: Response) => {
      try {
        const newSpec = regenerateOpenApiSpec();
        res.json({
          success: true,
          message: "OpenAPI specification regenerated successfully",
          data: {
            pathCount: Object.keys(newSpec.paths).length,
          },
        });
      } catch (error) {
        logger.error("Error regenerating OpenAPI spec:", { error });
        res.status(500).json({
          success: false,
          message: "Failed to regenerate OpenAPI specification",
          code: "INTERNAL_ERROR",
        });
      }
    });
  }

  const scalarDocsCsp = [
    "default-src 'self'",
    "base-uri 'self'",
    "font-src 'self' https: data:",
    "img-src 'self' https: data:",
    "style-src 'self' https: 'unsafe-inline'",
    "script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'",
    "connect-src 'self' https:",
    "object-src 'none'",
    "frame-ancestors 'self'",
  ].join("; ");

  router.use("/docs", (req, res, next) => {
    res.setHeader("Content-Security-Policy", scalarDocsCsp);
    next();
  });

  router.use(
    "/docs",
    apiReference({
      theme: "default",
      spec: {
        content: openApiSpec,
      },
    } as Parameters<typeof apiReference>[0]),
  );
}

export default router;
