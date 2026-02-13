'use client'

import { use } from 'react'
import { useOrg } from '@/lib/hooks/use-orgs'
import { useAuth } from '@/lib/auth/auth-context'
import { OrgMembers } from '@/components/orgs/org-members'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { redirect } from 'next/navigation'

interface OrgSettingsPageProps {
  params: Promise<{
    orgName: string
  }>
}

export default function OrgSettingsPage({ params }: OrgSettingsPageProps) {
  const { orgName } = use(params)
  const { user } = useAuth()

  const { data: org, isLoading, error } = useOrg(orgName)

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error || !org) {
    return (
      <div className="container px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Organization not found'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Check if user is owner
  const isOwner = user?.id === org.ownerId

  if (!isOwner) {
    return (
      <div className="container px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access organization settings.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <p className="text-muted-foreground mt-2">@{org.name}</p>
      </div>

      <div className="space-y-8">
        <OrgMembers
          members={org.members || []}
          orgName={org.name}
          isOwner={isOwner}
          currentUserId={user?.id}
        />
      </div>
    </div>
  )
}
