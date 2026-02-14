'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { Search, Package, FileCode, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { listAllAgents } from '@/lib/api/endpoints/agents'
import { listAllSkills } from '@/lib/api/endpoints/skills'
import type { Agent, Skill } from '@/types/api'

type SearchResult = {
  type: 'agent' | 'skill'
  id: string
  name: string
  description: string
  orgName: string
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Fetch all agents and skills on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsData, skillsData] = await Promise.all([
          listAllAgents(),
          listAllSkills(),
        ])
        setAgents(agentsData)
        setSkills(skillsData)
      } catch (error) {
        console.error('Failed to fetch search data:', error)
      }
    }
    fetchData()
  }, [])

  // Handle click outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = () => {
    if (!query.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    setIsLoading(true)
    const searchQuery = query.toLowerCase()

    // Filter agents
    const agentResults: SearchResult[] = agents
      .filter(
        (agent) =>
          agent.name.toLowerCase().includes(searchQuery) ||
          agent.description?.toLowerCase().includes(searchQuery) ||
          agent.org?.name.toLowerCase().includes(searchQuery)
      )
      .map((agent) => ({
        type: 'agent' as const,
        id: agent.id,
        name: agent.name,
        description: agent.description || '',
        orgName: agent.org?.name || '',
      }))

    // Filter skills
    const skillResults: SearchResult[] = skills
      .filter(
        (skill) =>
          skill.name.toLowerCase().includes(searchQuery) ||
          skill.description?.toLowerCase().includes(searchQuery) ||
          skill.org?.name.toLowerCase().includes(searchQuery)
      )
      .map((skill) => ({
        type: 'skill' as const,
        id: skill.id,
        name: skill.name,
        description: skill.description || '',
        orgName: skill.org?.name || '',
      }))

    const allResults = [...agentResults, ...skillResults].slice(0, 10)
    setResults(allResults)
    setShowResults(true)
    setIsLoading(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      setShowResults(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    const url =
      result.type === 'agent'
        ? `/agent/${result.orgName}/${result.name}`
        : `/skill/${result.orgName}/${result.name}`
    router.push(url)
    setShowResults(false)
    setQuery('')
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search agents and skills... (Press Enter)"
        className="pl-9 w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {/* Search Results Dropdown */}
      {showResults && (
        <Card className="absolute top-full mt-2 w-full max-h-[400px] overflow-y-auto z-50 shadow-lg">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left p-3 hover:bg-accent rounded-md transition-colors flex items-start gap-3"
                >
                  <div className="mt-1">
                    {result.type === 'agent' ? (
                      <Package className="h-4 w-4 text-blue-500" />
                    ) : (
                      <FileCode className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        @{result.orgName}/{result.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                    </div>
                    {result.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {result.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
