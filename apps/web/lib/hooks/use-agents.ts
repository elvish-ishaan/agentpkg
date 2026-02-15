import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { agentsApi } from '@/lib/api/endpoints/agents'
import { queryKeys } from '@/lib/api/query-keys'
import type { PublishAgentData } from '@/types/api'

export function useAgent(org: string, name: string) {
  return useQuery({
    queryKey: queryKeys.agents.detail(org, name),
    queryFn: () => agentsApi.getAgent(org, name),
    enabled: !!org && !!name,
  })
}

export function useAgentVersion(org: string, name: string, version: string) {
  return useQuery({
    queryKey: queryKeys.agents.version(org, name, version),
    queryFn: () => agentsApi.getAgentVersion(org, name, version),
    enabled: !!org && !!name && !!version,
  })
}

export function useAgentVersions(org: string, name: string) {
  return useQuery({
    queryKey: queryKeys.agents.versions(org, name),
    queryFn: () => agentsApi.listAgentVersions(org, name),
    enabled: !!org && !!name,
  })
}

export function useOrgAgents(org: string) {
  return useQuery({
    queryKey: queryKeys.agents.byOrg(org),
    queryFn: () => agentsApi.listOrgAgents(org),
    enabled: !!org,
  })
}

export function useAllAgents() {
  return useQuery({
    queryKey: queryKeys.agents.list(),
    queryFn: () => agentsApi.listAllAgents(),
  })
}

export function usePublishAgent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PublishAgentData) => agentsApi.publish(data),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.agents.byOrg(variables.orgName),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.agents.detail(variables.orgName, variables.name),
      })
    },
  })
}

export function useDeleteAgent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ org, name }: { org: string; name: string }) =>
      agentsApi.deleteAgent(org, name),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.agents.byOrg(variables.org),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.agents.detail(variables.org, variables.name),
      })
    },
  })
}
