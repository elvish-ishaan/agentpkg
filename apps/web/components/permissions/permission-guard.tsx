'use client'

import React from 'react'
import { useOrg } from '@/lib/contexts/org-context'

interface PermissionGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Only render children if user is an owner of the active organization
 */
export function RequireOwner({ children, fallback = null }: PermissionGuardProps) {
  const { isOwner } = useOrg()

  if (!isOwner) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Only render children if user is a member (or owner) of the active organization
 */
export function RequireMember({ children, fallback = null }: PermissionGuardProps) {
  const { isMember } = useOrg()

  if (!isMember) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Convenience component for delete actions (owner only)
 */
export function CanDelete({ children, fallback = null }: PermissionGuardProps) {
  return <RequireOwner fallback={fallback}>{children}</RequireOwner>
}

/**
 * Convenience component for management actions (owner only)
 */
export function CanManage({ children, fallback = null }: PermissionGuardProps) {
  return <RequireOwner fallback={fallback}>{children}</RequireOwner>
}
