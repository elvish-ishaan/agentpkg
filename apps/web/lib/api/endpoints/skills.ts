import { apiClient } from '../client'
import type { Skill, SkillVersion, PublishSkillData } from '@/types/api'

export const skillsApi = {
  // Publish a new skill or version
  publish: async (data: PublishSkillData): Promise<SkillVersion> => {
    const response = await apiClient.post('/skills/publish', data)
    return response.data
  },

  // Get skill details with latest version
  getSkill: async (org: string, name: string): Promise<Skill> => {
    const response = await apiClient.get(`/skills/@${org}/${name}`)
    return response.data
  },

  // Get specific skill version
  getSkillVersion: async (
    org: string,
    name: string,
    version: string
  ): Promise<SkillVersion> => {
    const response = await apiClient.get(`/skills/@${org}/${name}/${version}`)
    return response.data
  },

  // List all versions of a skill
  listSkillVersions: async (org: string, name: string): Promise<SkillVersion[]> => {
    const response = await apiClient.get(`/skills/@${org}/${name}/versions`)
    return response.data
  },

  // List all skills for an organization
  listOrgSkills: async (org: string): Promise<Skill[]> => {
    const response = await apiClient.get(`/skills/@${org}`)
    return response.data
  },

  // List all skills
  listAllSkills: async (): Promise<Skill[]> => {
    const response = await apiClient.get('/skills')
    return response.data
  },

  // Update skill access level
  updateSkillAccess: async (
    org: string,
    name: string,
    access: 'PRIVATE' | 'PUBLIC'
  ): Promise<Skill> => {
    const response = await apiClient.patch(`/skills/@${org}/${name}/access`, {
      access,
    })
    return response.data
  },
}

// Export individual functions for easier importing
export const {
  publish: publishSkill,
  getSkill,
  getSkillVersion,
  listSkillVersions,
  listOrgSkills,
  listAllSkills,
  updateSkillAccess,
} = skillsApi
