import * as clack from "@clack/prompts";
import { apiRequest } from "../api/client.js";
import { saveToken } from "../config/config.js";
import { formatError } from "../utils/errors.js";
import type { AuthResponse } from "../types/api.js";

export async function register() {
  clack.intro("AgentPKG Registration");

  try {
    // Prompt for email
    const email = await clack.text({
      message: "Email:",
      placeholder: "user@example.com",
      validate: (value) => {
        if (!value) return "Email is required";
        if (!value.includes("@")) return "Invalid email format";
      },
    });

    if (clack.isCancel(email)) {
      clack.cancel("Operation cancelled");
      process.exit(0);
    }

    // Prompt for username
    const username = await clack.text({
      message: "Username:",
      placeholder: "myusername",
      validate: (value) => {
        if (!value) return "Username is required";
        if (!/^[a-z][a-z0-9-]*$/.test(value)) {
          return "Username must start with a letter and contain only lowercase letters, numbers, and hyphens";
        }
        if (value.length < 3) {
          return "Username must be at least 3 characters";
        }
      },
    });

    if (clack.isCancel(username)) {
      clack.cancel("Operation cancelled");
      process.exit(0);
    }

    // Prompt for password
    const password = await clack.password({
      message: "Password:",
      validate: (value) => {
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
      },
    });

    if (clack.isCancel(password)) {
      clack.cancel("Operation cancelled");
      process.exit(0);
    }

    // Show spinner while registering
    const spinner = clack.spinner();
    spinner.start("Creating account...");

    // Call register API
    const response = await apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: { email, username, password },
      requireAuth: false,
    });

    // Save token
    saveToken(response.token);

    spinner.stop("Account created successfully");

    clack.outro(
      `✓ Welcome, ${response.user.username}! Your default org '@${response.user.username}' has been created.`,
    );
  } catch (error) {
    clack.cancel(formatError(error));
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.main) {
  await register();
}
