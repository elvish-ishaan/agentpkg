/**
 * Format errors for display to users
 * Converts API and network errors into readable, actionable messages
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    // Check if it's an API error response
    if ("status" in error && typeof (error as any).status === "number") {
      const status = (error as any).status;
      const message = error.message;

      switch (status) {
        case 401:
          return "Not logged in. Run 'agentpkg login' first.";
        case 403:
          if (message.includes("not a member")) {
            return `You are not a member of this organization. Contact an owner to be added.`;
          }
          if (message.includes("not an owner") || message.includes("owner")) {
            return "Only organization owners can perform this action.";
          }
          return "Permission denied. " + message;
        case 404:
          return "Resource not found. Check the organization or agent name.";
        case 409:
          if (message.includes("already exists")) {
            return message + " Use a different version.";
          }
          return message;
        case 429:
          return "Rate limit exceeded. Please wait and try again.";
        case 500:
        case 502:
        case 503:
          return "Server error. Please try again later.";
        default:
          return message || "An error occurred.";
      }
    }

    // Network errors
    if (
      error.message.includes("ECONNREFUSED") ||
      error.message.includes("fetch failed")
    ) {
      return "Cannot connect to AgentPKG API. Check your connection or API_URL.";
    }

    if (error.message.includes("timeout")) {
      return "Request timed out. Please try again.";
    }

    return error.message;
  }

  return "An unexpected error occurred.";
}

/**
 * Create an API error with status code
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
