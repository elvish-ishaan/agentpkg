import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orgsApi } from '@/lib/api/endpoints/orgs'
import { queryKeys } from '@/lib/api/query-keys'
import type { CreateOrgData, AddMemberData } from '@/types/api'

export function useUserOrgs() {
  return useQuery({
    queryKey: queryKeys.orgs.userOrgs(),
    queryFn: () => orgsApi.getUserOrgs(),
  })
}

export function useOrg(name: string) {
  return useQuery({
    queryKey: queryKeys.orgs.detail(name),
    queryFn: () => orgsApi.getOrg(name),
    enabled: !!name,
  })
}

export function useCreateOrg() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOrgData) => orgsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orgs.all })
    },
  })
}

export function useAddMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orgName, data }: { orgName: string; data: AddMemberData }) =>
      orgsApi.addMember(orgName, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orgs.detail(variables.orgName),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.orgs.members(variables.orgName),
      })
    },
  })
}

export function useRemoveMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orgName, userId }: { orgName: string; userId: string }) =>
      orgsApi.removeMember(orgName, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orgs.detail(variables.orgName),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.orgs.members(variables.orgName),
      })
    },
  })
}
