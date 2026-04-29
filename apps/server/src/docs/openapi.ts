import { env } from "../config/env";
import logger from "../utils/logger";
import { validateOpenApiSpec } from "./validate-schema";

import { securitySchemes } from "./components/security";
import { schemas } from "./components/schemas";
import { responses } from "./components/responses";
import { parameters } from "./components/parameters";

import { healthPaths } from "./paths/health.docs";
import { authPaths } from "./paths/auth.docs";
import { uploadsPaths } from "./paths/uploads.docs";
import { productsPublicPaths } from "./paths/products-public.docs";
import { productsSellerPaths } from "./paths/products-seller.docs";
import { cartPaths } from "./paths/cart.docs";
import { checkoutPaths } from "./paths/checkout.docs";
import { ordersBuyerPaths } from "./paths/orders-buyer.docs";
import { ordersSellerPaths } from "./paths/orders-seller.docs";
import { dashboardSellerPaths } from "./paths/dashboard-seller.docs";
import { employeesSellerPaths } from "./paths/employees-seller.docs";

const baseUrl = env.PUBLIC_API_URL || "http://localhost:4001";
const apiUrl = `${baseUrl}/api/v1`;

const fallbackSpec = {
  openapi: "3.1.0",
  info: {
    title: "GDGShopzy API",
    version: "1.0.0",
    description:
      "REST API for GDGShopzy multi-role e-commerce platform (Schema generation failed - using fallback)",
  },
  servers: [
    {
      url: apiUrl,
      description: env.NODE_ENV === "production" ? "Production" : "Development",
    },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {},
};

function generateOpenApiSpec() {
  try {
    logger.info("Generating OpenAPI specification...");

    const spec = {
      openapi: "3.1.0",
      info: {
        title: "GDGShopzy API",
        version: "1.0.0",
        description:
          "REST API for GDGShopzy multi-role e-commerce platform with buyers, sellers, employees, products, cart, checkout, orders, uploads, auth, and notifications.",
      },
      servers: [
        {
          url: apiUrl,
          description: env.NODE_ENV === "production" ? "Production" : "Development",
        },
      ],
      tags: [
        { name: "Health", description: "Health check endpoints" },
        { name: "Auth", description: "Authentication and authorization" },
        { name: "Uploads", description: "Image upload and retrieval" },
        { name: "Public Products", description: "Public product browsing" },
        { name: "Seller Products", description: "Seller product management" },
        { name: "Buyer Cart", description: "Shopping cart management" },
        { name: "Checkout", description: "Checkout and order creation" },
        { name: "Buyer Orders", description: "Buyer order management" },
        { name: "Seller Orders", description: "Seller order fulfillment" },
        {
          name: "Seller Dashboard",
          description: "Seller dashboard and analytics",
        },
        { name: "Seller Employees", description: "Employee management" },
      ],
      paths: {
        ...healthPaths,
        ...authPaths,
        ...uploadsPaths,
        ...productsPublicPaths,
        ...productsSellerPaths,
        ...cartPaths,
        ...checkoutPaths,
        ...ordersBuyerPaths,
        ...ordersSellerPaths,
        ...dashboardSellerPaths,
        ...employeesSellerPaths,
      },
      components: {
        securitySchemes,
        schemas,
        responses,
        parameters,
      },
    };

    if (validateOpenApiSpec(spec)) {
      logger.info("OpenAPI specification generated successfully");
      return spec;
    }

    logger.warn("OpenAPI spec validation failed, using fallback");
    return fallbackSpec;
  } catch (error) {
    logger.error("Failed to generate OpenAPI spec, using fallback:", { error });
    return fallbackSpec;
  }
}

let cachedSpec = generateOpenApiSpec();

export const openApiSpec = cachedSpec;

export function regenerateOpenApiSpec() {
  logger.info("Regenerating OpenAPI specification...");
  cachedSpec = generateOpenApiSpec();
  return cachedSpec;
}
