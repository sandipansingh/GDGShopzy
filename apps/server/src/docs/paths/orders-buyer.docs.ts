export const ordersBuyerPaths = {
  "/buyer/orders": {
    get: {
      tags: ["Buyer Orders"],
      summary: "List buyer orders",
      description: "Get all orders for authenticated buyer (BUYER only)",
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
  "/buyer/orders/{id}": {
    get: {
      tags: ["Buyer Orders"],
      summary: "Get buyer order",
      description: "Get single order by ID (buyer-scoped, BUYER only)",
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
};
