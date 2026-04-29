import { createHash } from "crypto";

/**
 * SHA-256 hash a refresh token for safe DB storage.
 * The raw token lives only in the cookie; the DB stores the hash.
 */
export function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}
