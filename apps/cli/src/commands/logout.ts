import * as clack from "@clack/prompts";
import { removeToken } from "../config/config.js";

export async function logout() {
  try {
    // Remove token from config
    removeToken();

    clack.outro("✓ Logged out successfully");
  } catch (error) {
    clack.cancel("Failed to logout");
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.main) {
  await logout();
}
