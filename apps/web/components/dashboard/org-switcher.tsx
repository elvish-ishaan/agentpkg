'use client'

import { useOrg } from '@/lib/contexts/org-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Check, ChevronDown } from 'lucide-react'

export function OrgSwitcher() {
  const { activeOrg, userOrgs, switchOrg, isLoading } = useOrg()

  if (isLoading) {
    return (
      <div className="flex h-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 backdrop-blur-sm">
        <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
      </div>
    )
  }

  if (!activeOrg || userOrgs.length === 0) {
    return (
      <div className="flex h-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 backdrop-blur-sm">
        <span className="text-sm text-gray-400 font-body">No organizations</span>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left backdrop-blur-sm transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10">
            <span className="text-xs font-bold text-white">
              {activeOrg.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">{activeOrg.name}</p>
            <p className="text-xs text-gray-400 font-body">
              {activeOrg.members?.length || 0} member
              {(activeOrg.members?.length || 0) !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 border-white/10 bg-black/95 backdrop-blur-sm"
      >
        {userOrgs.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => switchOrg(org.name)}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer focus:bg-white/10"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10">
              <span className="text-xs font-bold text-white">
                {org.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white">{org.name}</p>
              <p className="text-xs text-gray-400 font-body">
                {org.members?.length || 0} member
                {(org.members?.length || 0) !== 1 ? 's' : ''}
              </p>
            </div>
            {activeOrg.id === org.id && (
              <Check className="h-4 w-4 flex-shrink-0 text-white" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
