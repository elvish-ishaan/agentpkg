'use client'

import { useOrg } from '@/lib/contexts/org-context'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreateOrgDialog } from '@/components/orgs/create-org-dialog'
import { Crown, Users, Package, Zap, Building2, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function OrganizationsPage() {
  const { userOrgs, activeOrg, isLoading } = useOrg()

  // Calculate stats for each org
  const getOrgStats = (org: any) => {
    const memberCount = org.members?.length || 0
    const agentCount = org.agentCount || org.agents?.length || 0

    return { memberCount, agentCount }
  }

  // Get user's role in an org
  const getUserRole = (org: any): 'OWNER' | 'MEMBER' | null => {
    // Check if user is the owner by ID
    if (org.ownerId) {
      const membership = org.members?.find((m: any) => m.userId === org.ownerId)
      return membership?.role || null
    }
    return null
  }

  return (
    <>
      <PageTemplate
        title="Organizations"
        description="Manage your organizations and teams"
        actions={
          <CreateOrgDialog>
            <Button className="bg-white text-black hover:bg-gray-200">
              <Building2 className="h-4 w-4 mr-2" />
              Create Organization
            </Button>
          </CreateOrgDialog>
        }
      >
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-white/10 animate-pulse mb-4" />
                  <div className="h-6 bg-white/10 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-white/10 rounded animate-pulse w-2/3" />
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && userOrgs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 mb-4">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2" style={{ fontFamily: 'var(--font-della-respira)' }}>
              No organizations yet
            </h3>
            <p className="text-gray-400 font-body text-center max-w-md mb-4">
              Create your first organization to start managing agents and skills.
            </p>
            <CreateOrgDialog>
              <Button className="bg-white text-black hover:bg-gray-200">
                <Building2 className="h-4 w-4 mr-2" />
                Create Organization
              </Button>
            </CreateOrgDialog>
          </div>
        )}

        {/* Organizations Grid */}
        {!isLoading && userOrgs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userOrgs.map((org) => {
              const { memberCount, agentCount } = getOrgStats(org)
              const userRole = getUserRole(org)
              const isOwner = userRole === 'OWNER'
              const isActive = activeOrg?.id === org.id

              return (
                <Card
                  key={org.id}
                  className={`bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all ${
                    isActive ? 'ring-2 ring-white/20' : ''
                  }`}
                >
                  <CardHeader className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                          <span className="text-lg font-bold text-white">
                            {org.name.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <CardTitle
                            className="text-white text-xl flex items-center gap-2"
                            style={{ fontFamily: 'var(--font-della-respira)' }}
                          >
                            {org.name}
                            {isActive && (
                              <Badge
                                variant="secondary"
                                className="bg-white/10 text-white border-white/20 text-xs"
                              >
                                Active
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="mt-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                isOwner
                                  ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                  : 'bg-white/10 text-gray-400 border-white/20'
                              }`}
                            >
                              {isOwner ? (
                                <>
                                  <Crown className="h-3 w-3 mr-1" />
                                  Owner
                                </>
                              ) : (
                                <>
                                  <Users className="h-3 w-3 mr-1" />
                                  Member
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardDescription className="text-gray-400 font-body">
                      Organization workspace for agents and skills
                    </CardDescription>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                          <Users className="h-4 w-4" />
                          <span className="text-xs font-body">Members</span>
                        </div>
                        <span className="text-2xl font-bold text-white">
                          {memberCount}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                          <Package className="h-4 w-4" />
                          <span className="text-xs font-body">Agents</span>
                        </div>
                        <span className="text-2xl font-bold text-white">
                          {agentCount}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                          <Zap className="h-4 w-4" />
                          <span className="text-xs font-body">Skills</span>
                        </div>
                        <span className="text-2xl font-bold text-white">
                          0
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 pt-0">
                    <Link href={`/dashboard/organizations/${org.name}`}>
                      <Button
                        variant="outline"
                        className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        {isOwner ? 'Manage Organization' : 'View Details'}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </PageTemplate>
    </>
  )
}
