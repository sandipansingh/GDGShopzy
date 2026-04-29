import logger from "../utils/logger";

interface OpenApiSpec {
  openapi: string;
  info: unknown;
  paths: Record<string, unknown>;
}

export function validateOpenApiSpec(spec: unknown): boolean {
  try {
    if (!spec || typeof spec !== "object") {
      logger.error("OpenAPI spec is not an object");
      return false;
    }

    const specObj = spec as Partial<OpenApiSpec>;

    if (!specObj.openapi || !specObj.info || !specObj.paths) {
      logger.error("OpenAPI spec missing required fields (openapi, info, paths)");
      return false;
    }

    if (specObj.openapi !== "3.1.0" && !specObj.openapi.startsWith("3.")) {
      logger.warn(`OpenAPI version ${specObj.openapi} may not be fully supported`);
    }

    const pathCount = Object.keys(specObj.paths).length;
    logger.info(`OpenAPI spec validated successfully with ${pathCount} paths`);

    return true;
  } catch (error) {
    logger.error("Error validating OpenAPI spec:", { error });
    return false;
  }
}
