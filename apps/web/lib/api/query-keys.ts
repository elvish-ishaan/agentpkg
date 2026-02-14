// Query key factories for React Query
export const queryKeys = {
  // Auth keys
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
    tokens: () => [...queryKeys.auth.all, 'tokens'] as const,
  },

  // Agent keys
  agents: {
    all: ['agents'] as const,
    lists: () => [...queryKeys.agents.all, 'list'] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.agents.lists(), filters] as const,
    details: () => [...queryKeys.agents.all, 'detail'] as const,
    detail: (org: string, name: string) =>
      [...queryKeys.agents.details(), org, name] as const,
    versions: (org: string, name: string) =>
      [...queryKeys.agents.detail(org, name), 'versions'] as const,
    version: (org: string, name: string, version: string) =>
      [...queryKeys.agents.versions(org, name), version] as const,
    byOrg: (orgName: string) =>
      [...queryKeys.agents.lists(), 'org', orgName] as const,
  },

  // Skill keys
  skills: {
    all: ['skills'] as const,
    lists: () => [...queryKeys.skills.all, 'list'] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.skills.lists(), filters] as const,
    details: () => [...queryKeys.skills.all, 'detail'] as const,
    detail: (org: string, name: string) =>
      [...queryKeys.skills.details(), org, name] as const,
    versions: (org: string, name: string) =>
      [...queryKeys.skills.detail(org, name), 'versions'] as const,
    version: (org: string, name: string, version: string) =>
      [...queryKeys.skills.versions(org, name), version] as const,
    byOrg: (orgName: string) =>
      [...queryKeys.skills.lists(), 'org', orgName] as const,
  },

  // Organization keys
  orgs: {
    all: ['orgs'] as const,
    lists: () => [...queryKeys.orgs.all, 'list'] as const,
    list: () => [...queryKeys.orgs.lists()] as const,
    userOrgs: () => [...queryKeys.orgs.lists(), 'user'] as const,
    details: () => [...queryKeys.orgs.all, 'detail'] as const,
    detail: (name: string) => [...queryKeys.orgs.details(), name] as const,
    members: (name: string) =>
      [...queryKeys.orgs.detail(name), 'members'] as const,
  },
} as const
