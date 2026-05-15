import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema } from "zod";

interface ValidateSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

/**
 * Validates and coerces req.body / req.params / req.query against Zod schemas.
 * On failure, ZodError is forwarded to the global errorMiddleware which formats
 * it consistently as { success: false, code: "VALIDATION_ERROR", details: ... }.
 * We intentionally do NOT re-wrap ZodError here to avoid two different error
 * shapes for the same validation failure.
 */
export function validate(schemas: ValidateSchemas): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as typeof req.query;
      }
      next();
    } catch (err) {
      // Forward ZodError (and any other error) to the global error handler
      next(err);
    }
  };
}
