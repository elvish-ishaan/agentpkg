import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PackageX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <PackageX className="h-24 w-24 mx-auto text-muted-foreground" />
        <h1 className="text-4xl font-bold">404 - Not Found</h1>
        <p className="text-lg text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/agents">Browse Agents</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
