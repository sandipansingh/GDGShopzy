import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/api-error";
import { ErrorCode } from "../constants/error-codes";

interface ValidateSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

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
      if (err instanceof ZodError) {
        throw new ApiError({
          statusCode: 400,
          message: "Validation failed",
          code: ErrorCode.VALIDATION_ERROR,
          details: err.flatten().fieldErrors,
        });
      }
      next(err);
    }
  };
}
