'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { useUserOrgs } from '@/lib/hooks/use-orgs'
import type { Org } from '@/types/api'

interface OrgContextType {
  activeOrg: Org | null
  userRole: 'OWNER' | 'MEMBER' | null
  isOwner: boolean
  isMember: boolean
  isLoading: boolean
  switchOrg: (orgName: string) => void
  userOrgs: Org[]
}

const OrgContext = createContext<OrgContextType | undefined>(undefined)

const ACTIVE_ORG_KEY = 'agentpkg:activeOrg'

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { data: userOrgs = [], isLoading: isLoadingOrgs } = useUserOrgs()
  const [activeOrgName, setActiveOrgName] = useState<string | null>(null)

  // Initialize active org from localStorage or default to first org
  useEffect(() => {
    if (isLoadingOrgs || !userOrgs.length) return

    // Try to restore from localStorage
    const savedOrgName = localStorage.getItem(ACTIVE_ORG_KEY)

    if (savedOrgName) {
      // Check if user still has access to saved org
      const savedOrg = userOrgs.find(org => org.name === savedOrgName)
      if (savedOrg) {
        setActiveOrgName(savedOrgName)
        return
      }
    }

    // Default to first org if no saved org or saved org not found
    if (!activeOrgName && userOrgs.length > 0) {
      setActiveOrgName(userOrgs[0]!.name)
    }
  }, [userOrgs, isLoadingOrgs, activeOrgName])

  // Get the active org object
  const activeOrg = useMemo(() => {
    if (!activeOrgName || !userOrgs.length) return null
    return userOrgs.find(org => org.name === activeOrgName) || null
  }, [activeOrgName, userOrgs])

  // Compute user's role in the active org
  const userRole = useMemo(() => {
    if (!activeOrg || !user) return null
    // Check ownerId first
    if (activeOrg.ownerId === user.id) return 'OWNER' as const
    // Fallback: check members list
    const membership = activeOrg.members?.find(m => m.userId === user.id || m.user?.username === user.username)
    if (!membership?.role) return null
    return membership.role.toUpperCase() as 'OWNER' | 'MEMBER'
  }, [activeOrg, user])

  // Helper booleans
  const isOwner = userRole === 'OWNER'
  const isMember = userRole === 'MEMBER' || userRole === 'OWNER'

  // Switch to a different organization
  const switchOrg = (orgName: string) => {
    const targetOrg = userOrgs.find(org => org.name === orgName)
    if (targetOrg) {
      setActiveOrgName(orgName)
      localStorage.setItem(ACTIVE_ORG_KEY, orgName)
    }
  }

  const value: OrgContextType = {
    activeOrg,
    userRole,
    isOwner,
    isMember,
    isLoading: isLoadingOrgs,
    switchOrg,
    userOrgs,
  }

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>
}

export function useOrg() {
  const context = useContext(OrgContext)
  if (context === undefined) {
    throw new Error('useOrg must be used within an OrgProvider')
  }
  return context
}
