export const productsPublicPaths = {
  "/products": {
    get: {
      tags: ["Public Products"],
      summary: "List products",
      description: "Browse products with search, category filter, and pagination (public)",
      parameters: [
        { $ref: "#/components/parameters/searchQuery" },
        { $ref: "#/components/parameters/categoryQuery" },
        { $ref: "#/components/parameters/pageQuery" },
        { $ref: "#/components/parameters/limitQuery" },
        { $ref: "#/components/parameters/includeOutOfStockQuery" },
      ],
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
                    type: "object",
                    properties: {
                      products: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Product" },
                      },
                      pagination: { $ref: "#/components/schemas/Pagination" },
                    },
                  },
                },
              },
            },
          },
        },
        "400": { $ref: "#/components/responses/ValidationError" },
      },
    },
  },
  "/products/{id}": {
    get: {
      tags: ["Public Products"],
      summary: "Get product details",
      description: "Get single product by ID (public)",
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
        "404": { $ref: "#/components/responses/NotFound" },
      },
    },
  },
};
