'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, XCircle, Mail } from 'lucide-react'
import { acceptInvitation } from '@/lib/api/endpoints/invitations'
import { useAuth } from '@/lib/hooks/use-auth'

function AcceptInvitationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [orgName, setOrgName] = useState('')

  const token = searchParams.get('token')

  useEffect(() => {
    async function processInvitation() {
      // Wait for auth to load
      if (authLoading) {
        return
      }

      // If not authenticated, redirect to login with return URL
      if (!user) {
        const returnUrl = `/invite/accept?token=${token}`
        router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
        return
      }

      // If no token, show error
      if (!token) {
        setStatus('error')
        setMessage('Invalid invitation link')
        return
      }

      // Accept the invitation
      try {
        const result = await acceptInvitation({ token })
        setStatus('success')
        setOrgName(result.orgName)
        setMessage(result.message || 'Successfully joined organization')
      } catch (error) {
        setStatus('error')
        if (error instanceof Error) {
          setMessage(error.message)
        } else {
          setMessage('Failed to accept invitation. The link may be invalid or expired.')
        }
      }
    }

    processInvitation()
  }, [token, user, authLoading, router])

  if (authLoading || status === 'loading') {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <CardTitle>Processing Invitation</CardTitle>
            <CardDescription>Please wait while we process your invitation...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle>Invitation Accepted!</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              You are now a member of <strong>{orgName}</strong>
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href={`/orgs/${orgName}`}>Go to Organization</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Go to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle>Invitation Failed</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Common Issues
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>The invitation link may have expired (valid for 7 days)</li>
              <li>The invitation may have been cancelled</li>
              <li>You may already be a member of this organization</li>
              <li>You need to log in with the invited email address</li>
            </ul>
          </div>
          <Button asChild className="w-full" variant="outline">
            <Link href="/">Go to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={
      <div className="container flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <CardTitle>Loading</CardTitle>
            <CardDescription>Please wait...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    }>
      <AcceptInvitationContent />
    </Suspense>
  )
}
