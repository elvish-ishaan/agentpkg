import { apiClient } from '../client'
import type { Agent, AgentVersion, PublishAgentData } from '@/types/api'

export const agentsApi = {
  // Publish a new agent or version
  publish: async (data: PublishAgentData): Promise<AgentVersion> => {
    const response = await apiClient.post('/agents/publish', data)
    return response.data
  },

  // Get agent details with latest version
  getAgent: async (org: string, name: string): Promise<Agent> => {
    const response = await apiClient.get(`/agents/@${org}/${name}`)
    return response.data
  },

  // Get specific agent version
  getAgentVersion: async (
    org: string,
    name: string,
    version: string
  ): Promise<AgentVersion> => {
    const response = await apiClient.get(`/agents/@${org}/${name}/${version}`)
    return response.data
  },

  // List all versions of an agent
  listAgentVersions: async (org: string, name: string): Promise<AgentVersion[]> => {
    const response = await apiClient.get(`/agents/@${org}/${name}/versions`)
    return response.data
  },

  // List all agents for an organization
  listOrgAgents: async (org: string): Promise<Agent[]> => {
    const response = await apiClient.get(`/agents/@${org}`)
    return response.data
  },

  // List all agents (optional: add later if backend supports)
  listAllAgents: async (): Promise<Agent[]> => {
    const response = await apiClient.get('/agents')
    return response.data
  },

  // Update agent access level
  updateAgentAccess: async (
    org: string,
    name: string,
    access: 'PRIVATE' | 'PUBLIC'
  ): Promise<Agent> => {
    const response = await apiClient.patch(`/agents/@${org}/${name}/access`, {
      access,
    })
    return response.data
  },
}

// Export individual functions for easier importing
export const {
  publish: publishAgent,
  getAgent,
  getAgentVersion,
  listAgentVersions,
  listOrgAgents,
  listAllAgents,
  updateAgentAccess,
} = agentsApi
