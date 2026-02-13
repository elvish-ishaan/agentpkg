import { apiClient } from '../client'
import type { Org, CreateOrgData, AddMemberData } from '@/types/api'

export const orgsApi = {
  // Create a new organization
  create: async (data: CreateOrgData): Promise<Org> => {
    const response = await apiClient.post('/orgs', data)
    return response.data
  },

  // Get user's organizations
  getUserOrgs: async (): Promise<Org[]> => {
    const response = await apiClient.get('/orgs')
    return response.data
  },

  // Get organization details
  getOrg: async (name: string): Promise<Org> => {
    const response = await apiClient.get(`/orgs/${name}`)
    return response.data
  },

  // Add member to organization
  addMember: async (orgName: string, data: AddMemberData): Promise<void> => {
    await apiClient.post(`/orgs/${orgName}/members`, data)
  },

  // Remove member from organization (optional: add if backend supports)
  removeMember: async (orgName: string, userId: string): Promise<void> => {
    await apiClient.delete(`/orgs/${orgName}/members/${userId}`)
  },
}
