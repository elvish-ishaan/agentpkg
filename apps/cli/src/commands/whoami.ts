import * as clack from "@clack/prompts";
import { apiRequest } from "../api/client.js";
import { formatError } from "../utils/errors.js";
import type { User } from "../types/api.js";

export async function whoami() {
  try {
    // Show spinner while fetching user info
    const spinner = clack.spinner();
    spinner.start("Fetching user info...");

    // Call whoami API
    const user = await apiRequest<User>("/auth/me", {
      method: "GET",
      requireAuth: true,
    });

    spinner.stop("User info fetched");

    // Display user info in a formatted way
    console.log("");
    console.log(`  ID:       ${user.id}`);
    console.log(`  Email:    ${user.email}`);
    console.log(`  Username: ${user.username}`);
    console.log(`  Joined:   ${new Date(user.createdAt).toLocaleDateString()}`);
    console.log("");
  } catch (error) {
    clack.cancel(formatError(error));
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.main) {
  await whoami();
}
