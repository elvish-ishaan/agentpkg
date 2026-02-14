'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Settings, Users, Package } from 'lucide-react'
import type { Org } from '@/types/api'
import { useAuth } from '@/lib/auth/auth-context'
import { InviteMemberDialog } from './invite-member-dialog'

interface OrgHeaderProps {
  org: Org
}

export function OrgHeader({ org }: OrgHeaderProps) {
  const { user } = useAuth()

  // Check if user is owner by ownerId or by member role
  const isOwner = user && (
    user.id === org.ownerId ||
    org.members?.some(m => m.userId === user.id && m.role === 'OWNER')
  )

  const memberCount = org.members?.length || 0
  const agentCount = org.agents?.length || 0

  return (
    <div className="border-b bg-muted/30">
      <div className="container px-4 py-8">
        <div className="flex items-start gap-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-2xl">
              {org.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold">@{org.name}</h1>
              {isOwner && (
                <div className="flex items-center gap-2">
                  <InviteMemberDialog orgName={org.name} />
                  <Button asChild variant="outline">
                    <Link href={`/orgs/${org.name}/settings`}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>{agentCount} {agentCount === 1 ? 'agent' : 'agents'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
