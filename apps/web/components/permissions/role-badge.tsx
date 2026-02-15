'use client'

import { useOrg } from '@/lib/contexts/org-context'
import { Crown, Users } from 'lucide-react'

export function RoleBadge() {
  const { userRole } = useOrg()

  if (!userRole) return null

  const isOwner = userRole === 'OWNER'

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur-sm ${
        isOwner
          ? 'border-yellow-500/20 bg-yellow-500/5'
          : 'border-white/20 bg-white/5'
      }`}
    >
      {isOwner ? (
        <Crown className="h-3 w-3 text-yellow-500" />
      ) : (
        <Users className="h-3 w-3 text-gray-400" />
      )}
      <span
        className={`text-xs font-body ${
          isOwner ? 'text-yellow-500' : 'text-gray-400'
        }`}
      >
        {userRole === 'OWNER' ? 'Owner' : 'Member'}
      </span>
    </div>
  )
}
