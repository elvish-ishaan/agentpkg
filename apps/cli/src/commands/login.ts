import * as clack from "@clack/prompts";
import { apiRequest } from "../api/client.js";
import { saveToken } from "../config/config.js";
import { formatError } from "../utils/errors.js";
import type { AuthResponse } from "../types/api.js";

export async function login() {
  clack.intro("AgentPKG Login");

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

    // Prompt for password
    const password = await clack.password({
      message: "Password:",
      validate: (value) => {
        if (!value) return "Password is required";
      },
    });

    if (clack.isCancel(password)) {
      clack.cancel("Operation cancelled");
      process.exit(0);
    }

    // Show spinner while logging in
    const spinner = clack.spinner();
    spinner.start("Logging in...");

    // Call login API
    const response = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
      requireAuth: false,
    });

    // Save token
    saveToken(response.token);

    spinner.stop("Logged in successfully");

    clack.outro(`✓ Logged in as ${response.user.username}`);
  } catch (error) {
    clack.cancel(formatError(error));
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.main) {
  await login();
}
