export const authPaths = {
  "/auth/register/buyer": {
    post: {
      tags: ["Auth"],
      summary: "Register as buyer",
      description: "Create a new buyer account",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password"],
              properties: {
                name: { type: "string", minLength: 1 },
                email: { type: "string", format: "email" },
                password: { type: "string", minLength: 8 },
              },
            },
            example: {
              name: "John Doe",
              email: "john@example.com",
              password: "SecurePass123!",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Buyer registered successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: {
                    type: "object",
                    properties: {
                      user: { $ref: "#/components/schemas/AuthUser" },
                      accessToken: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        "400": { $ref: "#/components/responses/ValidationError" },
        "409": { $ref: "#/components/responses/Conflict" },
        "429": { $ref: "#/components/responses/RateLimitExceeded" },
      },
    },
  },
  "/auth/register/seller": {
    post: {
      tags: ["Auth"],
      summary: "Register as seller",
      description: "Create a new seller account with store",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password", "storeName"],
              properties: {
                name: { type: "string", minLength: 1 },
                email: { type: "string", format: "email" },
                password: { type: "string", minLength: 8 },
                storeName: { type: "string", minLength: 1 },
              },
            },
            example: {
              name: "Jane Smith",
              email: "jane@example.com",
              password: "SecurePass123!",
              storeName: "Jane's Electronics",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Seller registered successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: {
                    type: "object",
                    properties: {
                      user: { $ref: "#/components/schemas/AuthUser" },
                      accessToken: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        "400": { $ref: "#/components/responses/ValidationError" },
        "409": { $ref: "#/components/responses/Conflict" },
        "429": { $ref: "#/components/responses/RateLimitExceeded" },
      },
    },
  },
  "/auth/register/employee": {
    post: {
      tags: ["Auth"],
      summary: "Register as employee",
      description: "Create employee account using invite token",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password", "inviteToken"],
              properties: {
                name: { type: "string", minLength: 1 },
                email: { type: "string", format: "email" },
                password: { type: "string", minLength: 8 },
                inviteToken: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Employee registered successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: {
                    type: "object",
                    properties: {
                      user: { $ref: "#/components/schemas/AuthUser" },
                      accessToken: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        "400": { $ref: "#/components/responses/ValidationError" },
        "409": { $ref: "#/components/responses/Conflict" },
        "429": { $ref: "#/components/responses/RateLimitExceeded" },
      },
    },
  },
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login",
      description: "Authenticate user and receive access token",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", format: "email" },
                password: { type: "string" },
              },
            },
            example: {
              email: "john@example.com",
              password: "SecurePass123!",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: {
                    type: "object",
                    properties: {
                      user: { $ref: "#/components/schemas/AuthUser" },
                      accessToken: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        "400": { $ref: "#/components/responses/ValidationError" },
        "401": { $ref: "#/components/responses/Unauthorized" },
        "429": { $ref: "#/components/responses/RateLimitExceeded" },
      },
    },
  },
  "/auth/refresh": {
    post: {
      tags: ["Auth"],
      summary: "Refresh access token",
      description: "Get new access token using refresh token cookie",
      security: [{ refreshCookie: [] }],
      responses: {
        "200": {
          description: "Token refreshed successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: {
                    type: "object",
                    properties: {
                      accessToken: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        "401": { $ref: "#/components/responses/Unauthorized" },
        "429": { $ref: "#/components/responses/RateLimitExceeded" },
      },
    },
  },
  "/auth/logout": {
    post: {
      tags: ["Auth"],
      summary: "Logout",
      description: "Revoke refresh token and clear cookie",
      security: [{ refreshCookie: [] }],
      responses: {
        "200": {
          description: "Logout successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Logged out successfully" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/auth/me": {
    get: {
      tags: ["Auth"],
      summary: "Get current user",
      description: "Get authenticated user profile",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "User profile retrieved",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
        "401": { $ref: "#/components/responses/Unauthorized" },
      },
    },
  },
  "/auth/forgot-password": {
    post: {
      tags: ["Auth"],
      summary: "Request password reset",
      description:
        "Send password reset email. Response does not reveal whether email exists for security.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: { type: "string", format: "email" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Request processed",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "If email exists, reset link has been sent",
                  },
                },
              },
            },
          },
        },
        "400": { $ref: "#/components/responses/ValidationError" },
        "429": { $ref: "#/components/responses/RateLimitExceeded" },
      },
    },
  },
  "/auth/reset-password": {
    post: {
      tags: ["Auth"],
      summary: "Reset password",
      description: "Reset password using token from email",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["token", "password"],
              properties: {
                token: { type: "string" },
                password: { type: "string", minLength: 8 },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Password reset successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Password reset successfully" },
                },
              },
            },
          },
        },
        "400": { $ref: "#/components/responses/ValidationError" },
        "429": { $ref: "#/components/responses/RateLimitExceeded" },
      },
    },
  },
};
