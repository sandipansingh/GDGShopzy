export const checkoutPaths = {
  "/buyer/checkout": {
    post: {
      tags: ["Checkout"],
      summary: "Checkout cart",
      description:
        "Create orders from cart items grouped by seller. Static payment flow (no real gateway). BUYER only.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "shippingName",
                "shippingPhone",
                "shippingLine1",
                "shippingCity",
                "shippingState",
                "shippingZip",
                "paymentMethod",
              ],
              properties: {
                shippingName: { type: "string", minLength: 1 },
                shippingPhone: { type: "string", minLength: 1 },
                shippingLine1: { type: "string", minLength: 1 },
                shippingLine2: { type: "string", nullable: true },
                shippingCity: { type: "string", minLength: 1 },
                shippingState: { type: "string", minLength: 1 },
                shippingZip: { type: "string", minLength: 1 },
                paymentMethod: { $ref: "#/components/schemas/PaymentMethod" },
                paymentDetails: { type: "object", nullable: true },
              },
            },
            example: {
              shippingName: "John Doe",
              shippingPhone: "+1234567890",
              shippingLine1: "123 Main St",
              shippingLine2: "Apt 4B",
              shippingCity: "New York",
              shippingState: "NY",
              shippingZip: "10001",
              paymentMethod: "CARD",
              paymentDetails: {},
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Orders created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: {
                    type: "object",
                    properties: {
                      orders: {
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
        "400": { $ref: "#/components/responses/ValidationError" },
        "401": { $ref: "#/components/responses/Unauthorized" },
        "403": { $ref: "#/components/responses/Forbidden" },
      },
    },
  },
};
