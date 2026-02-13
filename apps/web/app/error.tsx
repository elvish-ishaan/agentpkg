'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>
            {error.message || 'An unexpected error occurred.'}
          </AlertDescription>
        </Alert>
        <div className="flex gap-4">
          <Button onClick={reset} className="flex-1">
            Try again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'} className="flex-1">
            Go home
          </Button>
        </div>
      </div>
    </div>
  )
}
