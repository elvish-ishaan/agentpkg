import { readConfig } from "../config/config.js";
import { ApiError } from "../utils/errors.js";

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  requireAuth?: boolean;
}

/**
 * Base HTTP client for API requests
 * Handles authentication, error mapping, and JSON parsing
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const config = readConfig();
  const { method = "GET", body, requireAuth = true } = options;

  // Build headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add authentication if required
  if (requireAuth) {
    if (!config.token) {
      throw new ApiError("Not logged in. Run 'agentpkg login' first.", 401);
    }
    headers["Authorization"] = `Bearer ${config.token}`;
  }

  // Build URL
  const url = `${config.apiUrl}${endpoint}`;

  try {
    // Make request
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Parse response
    const json = await response.json();

    // Handle errors
    if (!response.ok) {
      throw new ApiError(
        json.error || json.message || "Request failed",
        response.status,
      );
    }

    // Unwrap the data field from the API response
    // API returns { success: true, data: T }
    return json.data as T;
  } catch (error) {
    // Re-throw ApiErrors
    if (error instanceof ApiError) {
      throw error;
    }

    // Wrap other errors
    if (error instanceof Error) {
      throw new ApiError(error.message, 0);
    }

    throw new ApiError("An unexpected error occurred", 0);
  }
}
