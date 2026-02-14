// User types
export interface User {
  id: string
  email: string
  username: string
  createdAt: string
  updatedAt: string
}

// Organization types
export interface Org {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  ownerId: string
  members?: OrgMember[]
  agents?: Agent[]
}

export interface OrgMember {
  id: string
  userId: string
  orgId: string
  role: 'OWNER' | 'MEMBER'
  createdAt: string
  user?: User
}

// Agent types
export interface Agent {
  id: string
  name: string
  description: string
  orgId: string
  downloads?: number
  createdAt: string
  updatedAt: string
  org?: Org
  versions?: AgentVersion[]
  latestVersion?: AgentVersion
}

export interface AgentVersion {
  id: string
  agentId: string
  version: string
  content: string
  publishedById: string
  createdAt: string
  updatedAt: string
  publishedBy?: User
  agent?: Agent
}

// API Token types
export interface ApiToken {
  id: string
  name: string
  token?: string
  userId: string
  lastUsedAt: string | null
  createdAt: string
}

// Request types
export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
}

export interface CreateOrgData {
  name: string
}

export interface PublishAgentData {
  orgName: string
  name: string
  version: string
  description: string
  content: string
}

export interface AddMemberData {
  userId: string
}

export interface CreateTokenData {
  name: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: string
  message?: string
}
