export const dashboardSellerPaths = {
  "/seller/dashboard/stats": {
    get: {
      tags: ["Seller Dashboard"],
      summary: "Get dashboard stats",
      description: "Get seller dashboard statistics (SELLER/EMPLOYEE only)",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Dashboard stats retrieved",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: {
                    type: "object",
                    properties: {
                      totalProducts: { type: "integer", example: 42 },
                      totalOrders: { type: "integer", example: 128 },
                      totalRevenue: { type: "number", format: "double", example: 15420.5 },
                      lowStockProducts: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Product" },
                      },
                      recentOrders: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Order" },
                      },
                    },
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
};
