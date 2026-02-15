'use client'

import { use, useMemo } from 'react'
import { useOrg } from '@/lib/hooks/use-orgs'
import { useAuth } from '@/lib/auth/auth-context'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OrgMembers } from '@/components/orgs/org-members'
import { InviteMemberDialog } from '@/components/orgs/invite-member-dialog'
import { UserPlus, Users, Settings, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface OrganizationDetailPageProps {
  params: Promise<{ orgName: string }>
}

export default function OrganizationDetailPage({ params }: OrganizationDetailPageProps) {
  const { orgName } = use(params)
  const { user } = useAuth()
  const { data: org, isLoading } = useOrg(orgName)

  // Compute isOwner from the actual org being viewed
  const isOwner = useMemo(() => {
    if (!org || !user) return false
    // Check via ownerId first (most reliable)
    if (org.ownerId === user.id) return true
    // Fallback: check members list
    const membership = org.members?.find(m => m.userId === user.id || m.user?.username === user.username)
    return membership?.role?.toUpperCase() === 'OWNER'
  }, [org, user])

  if (isLoading) {
    return (
      <PageTemplate title="Loading..." description="Loading organization details">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        </div>
      </PageTemplate>
    )
  }

  if (!org) {
    return (
      <PageTemplate title="Not Found" description="Organization not found">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2" style={{ fontFamily: 'var(--font-della-respira)' }}>
            Organization Not Found
          </h3>
          <p className="text-gray-400 font-body text-center max-w-md mb-4">
            The organization you're looking for doesn't exist or you don't have access.
          </p>
          <Link href="/dashboard/organizations">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Organizations
            </Button>
          </Link>
        </div>
      </PageTemplate>
    )
  }

  return (
    <>
      <PageTemplate
        title={org.name}
        description="Manage organization settings and members"
        actions={
          <Link href="/dashboard/organizations">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        }
      >
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger value="members" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            {isOwner && (
              <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-black">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            )}
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="mt-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-xl" style={{ fontFamily: 'var(--font-della-respira)' }}>
                      Team Members
                    </CardTitle>
                    <CardDescription className="text-gray-400 font-body">
                      Manage who has access to this organization
                    </CardDescription>
                  </div>
                  {isOwner && (
                    <InviteMemberDialog orgName={org.name}>
                      <Button className="bg-white text-black hover:bg-gray-200">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Member
                      </Button>
                    </InviteMemberDialog>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {org.members && org.members.length > 0 ? (
                  <OrgMembers
                    members={org.members}
                    orgName={org.name}
                    isOwner={isOwner}
                    currentUserId={user?.id}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <Users className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-400 font-body text-center">
                      No members found
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Member Permissions Notice */}
            {!isOwner && (
              <Card className="bg-yellow-500/10 border-yellow-500/20 backdrop-blur-sm mt-4">
                <CardContent className="p-6">
                  <p className="text-yellow-500 font-body text-sm">
                    You are a member of this organization. Only owners can manage members and settings.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab (Owner Only) */}
          {isOwner && (
            <TabsContent value="settings" className="mt-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="p-6">
                  <CardTitle className="text-white text-xl" style={{ fontFamily: 'var(--font-della-respira)' }}>
                    Organization Settings
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-body">
                    Manage organization configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-6">
                  {/* Organization Info */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2" style={{ fontFamily: 'var(--font-della-respira)' }}>
                      Organization Name
                    </h3>
                    <p className="text-gray-400 font-body mb-4">
                      This is your organization's unique identifier.
                    </p>
                    <div className="flex items-center gap-4">
                      <code className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono">
                        {org.name}
                      </code>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-lg font-medium text-red-400 mb-2" style={{ fontFamily: 'var(--font-della-respira)' }}>
                      Danger Zone
                    </h3>
                    <Card className="bg-red-500/10 border-red-500/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium mb-1">Delete this organization</h4>
                            <p className="text-sm text-gray-400 font-body">
                              Once deleted, this organization and all its data will be permanently removed.
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              // TODO: Implement delete organization
                              console.log('Delete organization:', org.name)
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </PageTemplate>
    </>
  )
}
