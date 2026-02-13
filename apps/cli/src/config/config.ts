import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { CONFIG_DIR, CONFIG_FILE, DEFAULT_API_URL } from "./paths.js";

export interface Config {
  apiUrl: string;
  token?: string;
}

/**
 * Read configuration from ~/.agentpkg/config.json
 * Returns default config if file doesn't exist
 */
export function readConfig(): Config {
  try {
    if (!existsSync(CONFIG_FILE)) {
      return {
        apiUrl: process.env.AGENTPKG_API_URL || DEFAULT_API_URL,
      };
    }

    const content = readFileSync(CONFIG_FILE, "utf-8");
    const config = JSON.parse(content) as Config;

    // Allow environment variable to override API URL
    if (process.env.AGENTPKG_API_URL) {
      config.apiUrl = process.env.AGENTPKG_API_URL;
    }

    return config;
  } catch (error) {
    // If config is corrupted, return default
    return {
      apiUrl: process.env.AGENTPKG_API_URL || DEFAULT_API_URL,
    };
  }
}

/**
 * Write configuration to ~/.agentpkg/config.json
 * Creates directory if it doesn't exist
 */
export function writeConfig(config: Config): void {
  // Ensure config directory exists
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }

  // Write config file
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
}

/**
 * Get authentication token from config
 */
export function getToken(): string | undefined {
  const config = readConfig();
  return config.token;
}

/**
 * Save authentication token to config
 */
export function saveToken(token: string): void {
  const config = readConfig();
  config.token = token;
  writeConfig(config);
}

/**
 * Remove authentication token from config
 */
export function removeToken(): void {
  const config = readConfig();
  delete config.token;
  writeConfig(config);
}
