import { createHash } from "node:crypto";

/**
 * Calculate SHA-256 checksum of content
 * Returns hex digest (64 characters)
 */
export function calculateChecksum(content: string): string {
  return createHash("sha256").update(content, "utf-8").digest("hex");
}

/**
 * Verify content matches expected checksum
 */
export function verifyChecksum(content: string, expected: string): boolean {
  const actual = calculateChecksum(content);
  return actual === expected;
}
