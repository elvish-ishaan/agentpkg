'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { AgentVersion } from '@/types/api'

interface AgentVersionsProps {
  versions: AgentVersion[]
  orgName: string
  agentName: string
  latestVersion?: string
}

export function AgentVersions({ versions, orgName, agentName, latestVersion }: AgentVersionsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-della-respira)' }}>
        Version History
      </h2>

      <div className="border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-gray-400 font-body">Version</TableHead>
              <TableHead className="text-gray-400 font-body">Published By</TableHead>
              <TableHead className="text-gray-400 font-body">Published</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.map((version) => (
              <TableRow key={version.id} className="border-white/10 hover:bg-white/5">
                <TableCell>
                  <Link
                    href={`/agent/@${orgName}/${agentName}/v/${version.version}`}
                    className="font-mono font-medium hover:underline flex items-center gap-2 text-white"
                  >
                    {version.version}
                    {version.version === latestVersion && (
                      <Badge variant="secondary" className="text-xs bg-white/10 text-white border-white/20">
                        Latest
                      </Badge>
                    )}
                  </Link>
                </TableCell>
                <TableCell className="text-white font-body">
                  {version.publishedBy?.username || 'Unknown'}
                </TableCell>
                <TableCell className="text-gray-400 font-body">
                  {version.createdAt ? formatDistanceToNow(new Date(version.createdAt), { addSuffix: true }) : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
