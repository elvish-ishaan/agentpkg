import { useOrg } from '@/lib/contexts/org-context'

export interface Permissions {
  canDelete: boolean // Owner only
  canManageMembers: boolean // Owner only
  canCreate: boolean // Owner + Member
  canEdit: boolean // Owner + Member
  canView: boolean // Owner + Member
}

export function usePermissions(): Permissions {
  const { isOwner, isMember } = useOrg()

  return {
    canDelete: isOwner,
    canManageMembers: isOwner,
    canCreate: isMember,
    canEdit: isMember,
    canView: isMember,
  }
}
