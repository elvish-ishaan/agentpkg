import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * Read agent file from disk
 */
export function readAgentFile(path: string): string {
  if (!existsSync(path)) {
    throw new Error(
      `No ${path} file found in current directory. Create the file manually (see documentation) or use the web UI.`,
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

/**
 * Read skill file from disk (directory structure: <skill_name>/SKILL.md)
 */
export function readSkillFile(skillDir: string): string {
  const skillPath = join(skillDir, "SKILL.md");
  if (!existsSync(skillPath)) {
    throw new Error(`No SKILL.md file found in ${skillDir}`);
  }
  return readFileSync(skillPath, "utf-8");
}

/**
 * Write skill file to disk (creates directory structure: <skill_name>/SKILL.md)
 */
export function writeSkillFile(skillDir: string, content: string): void {
  // Ensure skill directory exists
  ensureDirectory(skillDir);

  // Write SKILL.md inside the directory
  const skillPath = join(skillDir, "SKILL.md");
  writeFileSync(skillPath, content, "utf-8");
}
