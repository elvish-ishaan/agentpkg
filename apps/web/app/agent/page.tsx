'use client'

import { useState, useMemo } from 'react'
import { useAllAgents } from '@/lib/hooks/use-agents'
import { AgentCard } from '@/components/agents/agent-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Package, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { motion } from 'motion/react'

export default function AgentsPage() {
  const { data: agents, isLoading, error } = useAllAgents()
  const [searchQuery, setSearchQuery] = useState('')

  // Filter agents based on search query
  const filteredAgents = useMemo(() => {
    if (!agents) return []
    if (!searchQuery.trim()) return agents

    const query = searchQuery.toLowerCase()
    return agents.filter(agent => {
      const orgName = agent.org?.name?.toLowerCase() || ''
      const agentName = agent.name?.toLowerCase() || ''
      const description = agent.description?.toLowerCase() || ''

      return (
        orgName.includes(query) ||
        agentName.includes(query) ||
        description.includes(query) ||
        `@${orgName}/${agentName}`.includes(query)
      )
    })
  }, [agents, searchQuery])

  if (isLoading) {
    return (
      <div className="container px-4 py-8 md:py-12 max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
          <Skeleton className="h-12 md:h-16 w-64 md:w-96 mb-3 md:mb-4 bg-white/10" />
          <Skeleton className="h-6 md:h-8 w-full max-w-2xl mb-6 md:mb-8 bg-white/10" />
          <Skeleton className="h-12 w-full max-w-md bg-white/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full bg-white/10" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 max-w-7xl mx-auto">
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertTitle className="text-red-400">Error</AlertTitle>
          <AlertDescription className="text-red-400">
            {error instanceof Error ? error.message : 'Failed to load agents'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:py-12 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8 md:mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4"
          style={{ fontFamily: 'var(--font-della-respira)' }}
        >
          Discover Agents
        </h1>
        <p className="text-lg md:text-xl text-gray-400 font-body mb-6 md:mb-8 max-w-2xl font-light">
          Browse and install public agents from the community
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search agents by name, org, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-white/30 h-12 text-base"
          />
        </div>

        {/* Search Results Count */}
        {searchQuery && (
          <motion.p
            className="text-sm text-gray-400 mt-3 font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Found {filteredAgents.length} {filteredAgents.length === 1 ? 'agent' : 'agents'}
          </motion.p>
        )}
      </motion.div>

      {/* Agents Grid */}
      {!agents || agents.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center py-16 md:py-24"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border-2 border-white/20">
            <Package className="h-8 w-8 md:h-10 md:w-10 text-white" />
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: 'var(--font-della-respira)' }}
          >
            No agents found
          </h2>
          <p className="text-gray-400 font-body text-base md:text-lg">
            Be the first to publish an agent to the registry!
          </p>
        </motion.div>
      ) : filteredAgents.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center py-16 md:py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border-2 border-white/20">
            <Search className="h-8 w-8 md:h-10 md:w-10 text-white" />
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: 'var(--font-della-respira)' }}
          >
            No results found
          </h2>
          <p className="text-gray-400 font-body text-base md:text-lg">
            Try adjusting your search query
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <AgentCard agent={agent} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
