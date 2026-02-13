import { apiRequest } from "./client.js";
import type {
  AuthResponse,
  User,
  Organization,
  Agent,
  AgentListItem,
} from "../types/api.js";

/**
 * Authentication endpoints
 */
export const auth = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
      requireAuth: false,
    });
  },

  async register(
    email: string,
    username: string,
    password: string,
  ): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: { email, username, password },
      requireAuth: false,
    });
  },

  async me(): Promise<User> {
    return apiRequest<User>("/auth/me", {
      method: "GET",
      requireAuth: true,
    });
  },
};

/**
 * Organization endpoints
 */
export const orgs = {
  async list(): Promise<Organization[]> {
    return apiRequest<Organization[]>("/orgs", {
      method: "GET",
      requireAuth: true,
    });
  },

  async create(name: string): Promise<Organization> {
    return apiRequest<Organization>("/orgs", {
      method: "POST",
      body: { name },
      requireAuth: true,
    });
  },
};

/**
 * Agent endpoints
 */
export const agents = {
  async publish(data: {
    org: string;
    name: string;
    version: string;
    content: string;
    description?: string;
    checksum: string;
  }): Promise<Agent> {
    return apiRequest<Agent>("/agents/publish", {
      method: "POST",
      body: data,
      requireAuth: true,
    });
  },

  async get(org: string, name: string, version?: string): Promise<Agent> {
    const endpoint = version
      ? `/agents/@${org}/${name}/${version}`
      : `/agents/@${org}/${name}`;

    return apiRequest<Agent>(endpoint, {
      method: "GET",
      requireAuth: false,
    });
  },

  async listByOrg(org: string): Promise<AgentListItem[]> {
    return apiRequest<AgentListItem[]>(`/agents/@${org}`, {
      method: "GET",
      requireAuth: false,
    });
  },
};
