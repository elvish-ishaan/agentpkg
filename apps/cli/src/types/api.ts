/**
 * API Response Types
 * These match the API response formats from apps/api
 */

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  memberCount?: number;
}

export interface Agent {
  id: string;
  orgId: string;
  name: string;
  version: string;
  description: string | null;
  content: string;
  checksum: string;
  downloadUrl: string;
  publishedBy: string;
  createdAt: string;
  org?: {
    name: string;
  };
  publisher?: {
    username: string;
  };
}

export interface AgentListItem {
  name: string;
  latestVersion: string;
  description: string | null;
  publishedAt: string;
  downloadUrl: string;
}
