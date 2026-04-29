export const parameters = {
  idPath: {
    name: "id",
    in: "path",
    required: true,
    schema: { type: "string", format: "uuid" },
    description: "Resource ID",
  },
  encodedKeyPath: {
    name: "encodedKey",
    in: "path",
    required: true,
    schema: { type: "string" },
    description: "Base64-encoded object key",
  },
  pageQuery: {
    name: "page",
    in: "query",
    schema: { type: "integer", minimum: 1, default: 1 },
    description: "Page number",
  },
  limitQuery: {
    name: "limit",
    in: "query",
    schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
    description: "Items per page",
  },
  searchQuery: {
    name: "search",
    in: "query",
    schema: { type: "string" },
    description: "Search term",
  },
  categoryQuery: {
    name: "category",
    in: "query",
    schema: { type: "string" },
    description: "Product category filter",
  },
  includeOutOfStockQuery: {
    name: "includeOutOfStock",
    in: "query",
    schema: { type: "boolean", default: false },
    description: "Include out-of-stock products",
  },
};
