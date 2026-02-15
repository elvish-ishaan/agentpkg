'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()

  // Client-side protection: redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?from=/settings/profile')
    }
  }, [isLoading, isAuthenticated, router])

  // Show loading while checking authentication
  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="container px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-della-respira)' }}>
          Profile Settings
        </h1>
        <p className="text-gray-400 mt-2 font-body">
          View and manage your profile information
        </p>
      </div>

      <div className="space-y-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white" style={{ fontFamily: 'var(--font-della-respira)' }}>
              Profile Information
            </CardTitle>
            <CardDescription className="text-gray-400 font-body">
              Your basic account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl bg-white/10 text-white border border-white/20">
                  {user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-della-respira)' }}>
                  {user.username}
                </h3>
                <p className="text-gray-400 font-body">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1 font-body">Username</p>
                <p className="text-sm font-mono text-white">{user.username}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-400 mb-1 font-body">Email</p>
                <p className="text-sm text-white font-body">{user.email}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-400 mb-1 font-body">User ID</p>
                <p className="text-sm font-mono text-white">{user.id}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-400 mb-1 font-body">Member Since</p>
                <p className="text-sm text-white font-body">
                  {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
