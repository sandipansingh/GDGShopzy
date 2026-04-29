export const uploadsPaths = {
  "/uploads/product-image": {
    post: {
      tags: ["Uploads"],
      summary: "Upload product image",
      description:
        "Upload product image (SELLER/EMPLOYEE only). Max 5MB. Formats: jpg, jpeg, png, webp. Returns backend-proxied URL.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["image"],
              properties: {
                image: {
                  type: "string",
                  format: "binary",
                  description: "Image file (max 5MB)",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Image uploaded successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: {
                    type: "object",
                    properties: {
                      imageUrl: {
                        type: "string",
                        format: "uri",
                        example: "http://localhost:4001/api/v1/uploads/images/encoded-key",
                      },
                      objectKey: { type: "string" },
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
        "413": { $ref: "#/components/responses/PayloadTooLarge" },
        "415": { $ref: "#/components/responses/UnsupportedMediaType" },
        "429": { $ref: "#/components/responses/RateLimitExceeded" },
      },
    },
  },
  "/uploads/images/{encodedKey}": {
    get: {
      tags: ["Uploads"],
      summary: "View image",
      description: "Get image by encoded key (public endpoint, backend-proxied from MinIO)",
      parameters: [{ $ref: "#/components/parameters/encodedKeyPath" }],
      responses: {
        "200": {
          description: "Image retrieved",
          content: {
            "image/jpeg": { schema: { type: "string", format: "binary" } },
            "image/png": { schema: { type: "string", format: "binary" } },
            "image/webp": { schema: { type: "string", format: "binary" } },
          },
        },
        "400": { $ref: "#/components/responses/ValidationError" },
        "404": { $ref: "#/components/responses/NotFound" },
      },
    },
  },
};
