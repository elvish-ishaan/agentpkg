'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/auth-context'
import { useUserOrgs } from '@/lib/hooks/use-orgs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateOrgDialog } from '@/components/orgs/create-org-dialog'
import { PublishAgentDialog } from '@/components/agents/publish-agent-dialog'
import { Plus, Package, Users } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const { data: orgs, isLoading } = useUserOrgs()

  // Client-side protection: redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?from=/dashboard')
    }
  }, [authLoading, isAuthenticated, router])

  // Show loading while checking authentication
  if (authLoading || !isAuthenticated) {
    return (
      <div className="container px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 max-w-6xl">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user?.username}!</h1>
        <p className="text-muted-foreground mt-2">
          Manage your organizations and agents from your dashboard
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Organization
            </CardTitle>
            <CardDescription>
              Start collaborating with your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateOrgDialog>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                New Organization
              </Button>
            </CreateOrgDialog>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Publish Agent
            </CardTitle>
            <CardDescription>
              Share your agent with the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PublishAgentDialog>
              <Button className="w-full" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Publish Agent
              </Button>
            </PublishAgentDialog>
          </CardContent>
        </Card>
      </div>

      {/* Organizations Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Organizations</h2>
          <CreateOrgDialog>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New
            </Button>
          </CreateOrgDialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[140px] w-full" />
            ))}
          </div>
        ) : orgs && orgs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orgs.map((org) => (
              <Link key={org.id} href={`/orgs/${org.name}`}>
                <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {org.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">@{org.name}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {org.members?.length || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {org.agents?.length || 0}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                You don't have any organizations yet
              </p>
              <CreateOrgDialog>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Organization
                </Button>
              </CreateOrgDialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
