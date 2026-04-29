export const employeesSellerPaths = {
  "/seller/employees/invite": {
    post: {
      tags: ["Seller Employees"],
      summary: "Invite employee",
      description: "Send employee invite email (SELLER only, not EMPLOYEE)",
      security: [{ bearerAuth: [] }],
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
            example: {
              email: "employee@example.com",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Employee invite sent",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: {
                    type: "object",
                    properties: {
                      inviteLink: {
                        type: "string",
                        format: "uri",
                        example: "http://localhost:5173/register/employee?token=abc123",
                      },
                      expiresAt: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
        },
        "400": { $ref: "#/components/responses/ValidationError" },
        "401": { $ref: "#/components/responses/Unauthorized" },
        "403": { $ref: "#/components/responses/Forbidden" },
      },
    },
  },
  "/seller/employees": {
    get: {
      tags: ["Seller Employees"],
      summary: "List employees",
      description: "Get all employees for seller (SELLER only, not EMPLOYEE)",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Employees retrieved",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Employee" },
                  },
                },
              },
            },
          },
        },
        "401": { $ref: "#/components/responses/Unauthorized" },
        "403": { $ref: "#/components/responses/Forbidden" },
      },
    },
  },
  "/seller/employees/{id}": {
    delete: {
      tags: ["Seller Employees"],
      summary: "Remove employee",
      description: "Remove employee from seller (SELLER only, not EMPLOYEE)",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/idPath" }],
      responses: {
        "200": {
          description: "Employee removed",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Employee removed successfully" },
                },
              },
            },
          },
        },
        "400": { $ref: "#/components/responses/ValidationError" },
        "401": { $ref: "#/components/responses/Unauthorized" },
        "403": { $ref: "#/components/responses/Forbidden" },
        "404": { $ref: "#/components/responses/NotFound" },
      },
    },
  },
};
