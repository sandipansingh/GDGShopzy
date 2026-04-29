export const responses = {
  ValidationError: {
    description: "Validation error",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validation failed" },
            code: { type: "string", example: "VALIDATION_ERROR" },
            details: { type: "object" },
          },
        },
      },
    },
  },
  Unauthorized: {
    description: "Unauthorized - missing or invalid token",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Unauthorized" },
            code: { type: "string", example: "UNAUTHORIZED" },
          },
        },
      },
    },
  },
  Forbidden: {
    description: "Forbidden - insufficient permissions",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Forbidden" },
            code: { type: "string", example: "FORBIDDEN" },
          },
        },
      },
    },
  },
  NotFound: {
    description: "Resource not found",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Not found" },
            code: { type: "string", example: "NOT_FOUND" },
          },
        },
      },
    },
  },
  Conflict: {
    description: "Conflict - resource already exists",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Conflict" },
            code: { type: "string", example: "CONFLICT" },
          },
        },
      },
    },
  },
  PayloadTooLarge: {
    description: "Payload too large",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Payload too large" },
            code: { type: "string", example: "PAYLOAD_TOO_LARGE" },
          },
        },
      },
    },
  },
  UnsupportedMediaType: {
    description: "Unsupported media type",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Unsupported media type" },
            code: { type: "string", example: "UNSUPPORTED_MEDIA_TYPE" },
          },
        },
      },
    },
  },
  RateLimitExceeded: {
    description: "Rate limit exceeded",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Too many requests" },
            code: { type: "string", example: "RATE_LIMIT_EXCEEDED" },
          },
        },
      },
    },
  },
  InternalServerError: {
    description: "Internal server error",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Internal server error" },
            code: { type: "string", example: "INTERNAL_SERVER_ERROR" },
          },
        },
      },
    },
  },
};
