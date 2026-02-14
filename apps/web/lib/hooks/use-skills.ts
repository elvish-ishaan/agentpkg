import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { skillsApi } from '@/lib/api/endpoints/skills'
import { queryKeys } from '@/lib/api/query-keys'
import type { PublishSkillData } from '@/types/api'

export function useSkill(org: string, name: string) {
  return useQuery({
    queryKey: queryKeys.skills.detail(org, name),
    queryFn: () => skillsApi.getSkill(org, name),
    enabled: !!org && !!name,
  })
}

export function useSkillVersion(org: string, name: string, version: string) {
  return useQuery({
    queryKey: queryKeys.skills.version(org, name, version),
    queryFn: () => skillsApi.getSkillVersion(org, name, version),
    enabled: !!org && !!name && !!version,
  })
}

export function useSkillVersions(org: string, name: string) {
  return useQuery({
    queryKey: queryKeys.skills.versions(org, name),
    queryFn: () => skillsApi.listSkillVersions(org, name),
    enabled: !!org && !!name,
  })
}

export function useOrgSkills(org: string) {
  return useQuery({
    queryKey: queryKeys.skills.byOrg(org),
    queryFn: () => skillsApi.listOrgSkills(org),
    enabled: !!org,
  })
}

export function useAllSkills() {
  return useQuery({
    queryKey: queryKeys.skills.list(),
    queryFn: () => skillsApi.listAllSkills(),
  })
}

export function usePublishSkill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PublishSkillData) => skillsApi.publish(data),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.skills.byOrg(variables.orgName),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.skills.detail(variables.orgName, variables.name),
      })
    },
  })
}
