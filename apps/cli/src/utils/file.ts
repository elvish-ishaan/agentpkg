import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Read agent file from disk
 */
export function readAgentFile(path: string): string {
  if (!existsSync(path)) {
    throw new Error(
      `No ${path} file found in current directory. Run 'agentpkg init' to create one.`,
    );
  }

  return readFileSync(path, "utf-8");
}

/**
 * Write agent file to disk
 */
export function writeAgentFile(path: string, content: string): void {
  // Ensure directory exists (only if it's not current directory)
  const dir = dirname(path);
  if (dir !== "." && dir !== "") {
    ensureDirectory(dir);
  }

  writeFileSync(path, content, "utf-8");
}

/**
 * Ensure directory exists (create if missing)
 */
export function ensureDirectory(path: string): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
