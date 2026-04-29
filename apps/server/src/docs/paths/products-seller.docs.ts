export const productsSellerPaths = {
  "/seller/products": {
    get: {
      tags: ["Seller Products"],
      summary: "List seller products",
      description: "Get all products for authenticated seller (SELLER/EMPLOYEE only)",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Products retrieved",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Product" },
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
    post: {
      tags: ["Seller Products"],
      summary: "Create product",
      description: "Create new product (SELLER/EMPLOYEE only)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "description", "category", "price", "stock"],
              properties: {
                name: { type: "string", minLength: 1 },
                description: { type: "string", minLength: 1 },
                category: { type: "string", minLength: 1 },
                price: { type: "number", minimum: 0 },
                stock: { type: "integer", minimum: 0 },
                imageUrl: { type: "string", format: "uri", nullable: true },
              },
            },
            example: {
              name: "Wireless Mouse",
              description: "Ergonomic wireless mouse with USB receiver",
              category: "Electronics",
              price: 29.99,
              stock: 100,
              imageUrl: "http://localhost:4001/api/v1/uploads/images/encoded-key",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Product created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Product" },
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
  "/seller/products/{id}": {
    get: {
      tags: ["Seller Products"],
      summary: "Get seller product",
      description: "Get single product by ID (seller-scoped, SELLER/EMPLOYEE only)",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/idPath" }],
      responses: {
        "200": {
          description: "Product retrieved",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Product" },
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
    patch: {
      tags: ["Seller Products"],
      summary: "Update product",
      description: "Update product (partial, SELLER/EMPLOYEE only)",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/idPath" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", minLength: 1 },
                description: { type: "string", minLength: 1 },
                category: { type: "string", minLength: 1 },
                price: { type: "number", minimum: 0 },
                stock: { type: "integer", minimum: 0 },
                imageUrl: { type: "string", format: "uri", nullable: true },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Product updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Product" },
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
      tags: ["Seller Products"],
      summary: "Delete product",
      description: "Delete product (SELLER/EMPLOYEE only)",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/idPath" }],
      responses: {
        "200": {
          description: "Product deleted",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Product deleted successfully" },
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
