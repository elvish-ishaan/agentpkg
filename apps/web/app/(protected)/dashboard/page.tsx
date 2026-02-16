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
import { Plus, Package, Users, TrendingUp, Star } from 'lucide-react'
import { motion } from 'motion/react'

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
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="space-y-6 sm:space-y-8">
          <Skeleton className="h-10 sm:h-12 w-48 sm:w-64 bg-white/10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Skeleton className="h-28 sm:h-32 bg-white/10" />
            <Skeleton className="h-28 sm:h-32 bg-white/10" />
            <Skeleton className="h-28 sm:h-32 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Skeleton className="h-44 sm:h-48 bg-white/10" />
            <Skeleton className="h-44 sm:h-48 bg-white/10" />
          </div>
        </div>
      </div>
    )
  }

  // Mock stats - replace with real data from your API
  const stats = [
    { label: 'Total Agents', value: orgs?.reduce((acc, org) => acc + (org.agents?.length || 0), 0) || 0, icon: Package, color: 'text-blue-400' },
    { label: 'Organizations', value: orgs?.length || 0, icon: Users, color: 'text-green-400' },
    { label: 'Total Skills', value: '0', icon: Star, color: 'text-purple-400' },
  ]

  return (
    <div className="min-h-screen w-full relative">
      {/* Dark Background with Pattern */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: '#000000',
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #1a1a1a 0.5px, transparent 1px),
            radial-gradient(circle at 75% 75%, #0d0d0d 0.5px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
          imageRendering: 'pixelated',
        }}
      />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2"
            style={{ fontFamily: 'var(--font-della-respira)' }}
          >
            Welcome back, {user?.username}!
          </h1>
          <p className="text-base sm:text-lg text-gray-400 font-body font-light">
            Manage your organizations and agents from your dashboard
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-400 font-body mb-1">
                          {stat.label}
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold text-white">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 ${stat.color}`}>
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-3 mb-6 sm:mb-8"
        >
          <CreateOrgDialog>
            <Button className="bg-white text-black hover:bg-gray-200 font-body">
              <Plus className="mr-2 h-4 w-4" />
              Create Organization
            </Button>
          </CreateOrgDialog>

          <PublishAgentDialog>
            <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-body" variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Publish Agent
            </Button>
          </PublishAgentDialog>

          <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-body" variant="outline">
            <Star className="mr-2 h-4 w-4" />
            Publish Skill
          </Button>
        </motion.div>

        {/* Organizations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2
              className="text-2xl sm:text-3xl font-bold text-white"
              style={{ fontFamily: 'var(--font-della-respira)' }}
            >
              Your Organizations
            </h2>
            <CreateOrgDialog>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm">
                <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">New</span>
                <span className="sm:hidden">+</span>
              </Button>
            </CreateOrgDialog>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[160px] sm:h-[180px] w-full bg-white/10" />
              ))}
            </div>
          ) : orgs && orgs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {orgs.map((org, index) => (
                <motion.div
                  key={org.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
                >
                  <Link href={`/orgs/${org.name}`}>
                    <Card className="h-full bg-white/5 border-white/10 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer group">
                      <CardHeader className="p-4 sm:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-white/20 group-hover:border-white/40 transition-all flex-shrink-0">
                            <AvatarFallback className="bg-white/10 text-white text-base sm:text-lg font-bold">
                              {org.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg sm:text-xl text-white mb-1 truncate">
                              @{org.name}
                            </CardTitle>
                            <div className="flex items-center gap-3 sm:gap-4 mt-2">
                              <span className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-400">
                                <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span className="font-body">{org.members?.length || 0}</span>
                              </span>
                              <span className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-400">
                                <Package className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span className="font-body">{org.agents?.length || 0}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 pt-0">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-gray-500 font-body">View organization</span>
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 group-hover:text-white transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 flex items-center justify-center border-2 border-white/20 mb-4 sm:mb-6">
                  <Users className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                </div>
                <p className="text-lg sm:text-xl text-white font-body mb-2">
                  No organizations yet
                </p>
                <p className="text-sm sm:text-base text-gray-400 mb-6 font-body text-center max-w-md px-4">
                  Create your first organization to start collaborating with your team and publishing packages
                </p>
                <CreateOrgDialog>
                  <Button className="bg-white text-black hover:bg-gray-200 font-body text-sm sm:text-base">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Organization
                  </Button>
                </CreateOrgDialog>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
