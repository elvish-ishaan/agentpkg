import { Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NoOrgSelectedProps {
  onCreateOrg?: () => void
}

export function NoOrgSelected({ onCreateOrg }: NoOrgSelectedProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 mb-4">
        <Building2 className="h-8 w-8 text-gray-400" />
      </div>
      <h3
        className="text-xl font-medium text-white mb-2"
        style={{ fontFamily: 'var(--font-della-respira)' }}
      >
        No Organization Selected
      </h3>
      <p className="text-gray-400 font-body text-center max-w-md mb-4">
        Create or join an organization to get started with AgentPkg.
      </p>
      {onCreateOrg && (
        <Button
          onClick={onCreateOrg}
          className="bg-white text-black hover:bg-gray-200"
        >
          <Building2 className="h-4 w-4 mr-2" />
          Create Organization
        </Button>
      )}
    </div>
  )
}
