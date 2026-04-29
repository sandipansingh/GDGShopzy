export const cartPaths = {
  "/buyer/cart": {
    get: {
      tags: ["Buyer Cart"],
      summary: "Get cart",
      description: "Get buyer's cart with items (BUYER only)",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Cart retrieved",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Cart" },
                },
              },
            },
          },
        },
        "401": { $ref: "#/components/responses/Unauthorized" },
        "403": { $ref: "#/components/responses/Forbidden" },
      },
    },
    delete: {
      tags: ["Buyer Cart"],
      summary: "Clear cart",
      description: "Remove all items from cart (BUYER only)",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Cart cleared",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Cart cleared successfully" },
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
  "/buyer/cart/items": {
    post: {
      tags: ["Buyer Cart"],
      summary: "Add item to cart",
      description: "Add product to cart or update quantity if exists (BUYER only)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["productId", "quantity"],
              properties: {
                productId: { type: "string", format: "uuid" },
                quantity: { type: "integer", minimum: 1 },
              },
            },
            example: {
              productId: "123e4567-e89b-12d3-a456-426614174000",
              quantity: 2,
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Item added to cart",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/CartItem" },
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
  "/buyer/cart/items/{id}": {
    patch: {
      tags: ["Buyer Cart"],
      summary: "Update cart item",
      description: "Update cart item quantity (BUYER only)",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/idPath" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["quantity"],
              properties: {
                quantity: { type: "integer", minimum: 1 },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Cart item updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/CartItem" },
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
    delete: {
      tags: ["Buyer Cart"],
      summary: "Remove cart item",
      description: "Remove item from cart (BUYER only)",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/idPath" }],
      responses: {
        "200": {
          description: "Cart item removed",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Item removed from cart" },
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
