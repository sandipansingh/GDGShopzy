import { ErrorCodeType } from "../constants/error-codes";

interface ApiErrorOptions {
  statusCode: number;
  message: string;
  code: ErrorCodeType;
  details?: unknown;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCodeType;
  public readonly details?: unknown;

  constructor({ statusCode, message, code, details }: ApiErrorOptions) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
