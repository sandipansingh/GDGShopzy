export const ordersSellerPaths = {
  "/seller/orders": {
    get: {
      tags: ["Seller Orders"],
      summary: "List seller orders",
      description: "Get all incoming orders for seller (SELLER/EMPLOYEE only)",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Orders retrieved",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Order" },
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
  "/seller/orders/{id}": {
    get: {
      tags: ["Seller Orders"],
      summary: "Get seller order",
      description: "Get single order by ID (seller-scoped, SELLER/EMPLOYEE only)",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/idPath" }],
      responses: {
        "200": {
          description: "Order retrieved",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Order" },
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
  "/seller/orders/{id}/status": {
    patch: {
      tags: ["Seller Orders"],
      summary: "Update order status",
      description:
        "Update order status (SELLER/EMPLOYEE only). May trigger buyer email notification.",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/idPath" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["status"],
              properties: {
                status: { $ref: "#/components/schemas/OrderStatus" },
              },
            },
            example: {
              status: "SHIPPED",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Order status updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Order" },
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
