export const schemas = {
  UserRole: {
    type: "string",
    enum: ["BUYER", "SELLER", "EMPLOYEE"],
  },
  OrderStatus: {
    type: "string",
    enum: ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
  },
  PaymentMethod: {
    type: "string",
    enum: ["CARD", "UPI", "COD"],
  },
  User: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string" },
      email: { type: "string", format: "email" },
      role: { $ref: "#/components/schemas/UserRole" },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  AuthUser: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string" },
      email: { type: "string", format: "email" },
      role: { $ref: "#/components/schemas/UserRole" },
    },
  },
  Product: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      sellerId: { type: "string", format: "uuid" },
      name: { type: "string" },
      description: { type: "string" },
      category: { type: "string" },
      price: { type: "number", format: "double" },
      stock: { type: "integer" },
      imageUrl: { type: "string", format: "uri", nullable: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  CartItem: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      productId: { type: "string", format: "uuid" },
      quantity: { type: "integer" },
      product: { $ref: "#/components/schemas/Product" },
      lineTotal: { type: "number", format: "double" },
    },
  },
  Cart: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      buyerId: { type: "string", format: "uuid" },
      items: {
        type: "array",
        items: { $ref: "#/components/schemas/CartItem" },
      },
      totalAmount: { type: "number", format: "double" },
    },
  },
  OrderItem: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      productId: { type: "string", format: "uuid" },
      quantity: { type: "integer" },
      unitPrice: { type: "number", format: "double" },
      product: { $ref: "#/components/schemas/Product" },
    },
  },
  Order: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      buyerId: { type: "string", format: "uuid" },
      sellerId: { type: "string", format: "uuid" },
      status: { $ref: "#/components/schemas/OrderStatus" },
      totalAmount: { type: "number", format: "double" },
      paymentMethod: { $ref: "#/components/schemas/PaymentMethod" },
      shippingName: { type: "string" },
      shippingPhone: { type: "string" },
      shippingLine1: { type: "string" },
      shippingLine2: { type: "string", nullable: true },
      shippingCity: { type: "string" },
      shippingState: { type: "string" },
      shippingZip: { type: "string" },
      items: {
        type: "array",
        items: { $ref: "#/components/schemas/OrderItem" },
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  Employee: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      userId: { type: "string", format: "uuid" },
      sellerId: { type: "string", format: "uuid" },
      user: { $ref: "#/components/schemas/User" },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  Pagination: {
    type: "object",
    properties: {
      page: { type: "integer" },
      limit: { type: "integer" },
      total: { type: "integer" },
      totalPages: { type: "integer" },
    },
  },
};
