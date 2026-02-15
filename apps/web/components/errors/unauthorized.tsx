import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface UnauthorizedProps {
  message?: string
}

export function Unauthorized({
  message = 'Only owners can perform this action.',
}: UnauthorizedProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 mb-4">
        <Lock className="h-8 w-8 text-gray-400" />
      </div>
      <h3
        className="text-xl font-medium text-white mb-2"
        style={{ fontFamily: 'var(--font-della-respira)' }}
      >
        Unauthorized
      </h3>
      <p className="text-gray-400 font-body text-center max-w-md mb-4">
        {message}
      </p>
      <Link href="/dashboard">
        <Button
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          Back to Dashboard
        </Button>
      </Link>
    </div>
  )
}
