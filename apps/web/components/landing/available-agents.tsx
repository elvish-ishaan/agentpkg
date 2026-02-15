import Image from 'next/image'

const agents = [
  // Available agents first
  { name: 'GitHub Copilot', icon: '/agent-icons/githubcopilot.png', isAvailable: true },
  // Coming soon agents
  { name: 'Claude', icon: '/agent-icons/claude.png', isAvailable: false },
  { name: 'Windsurf', icon: '/agent-icons/openclaw.png', isAvailable: false },
  { name: 'Cline', icon: '/agent-icons/cline.png', isAvailable: false },
  { name: 'Cursor', icon: '/agent-icons/cursor.png', isAvailable: false },
  { name: 'Gemini', icon: '/agent-icons/gemini.png', isAvailable: false },
  { name: 'OpenAI', icon: '/agent-icons/openai.png', isAvailable: false },
]

export function AvailableAgents() {
  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <h2 className="font-mono text-xs tracking-wider text-white/80 uppercase">
        Available for these agents
      </h2>
      <div className="flex items-center justify-center gap-6 md:gap-8 flex-wrap">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className="relative group"
          >
            <div className={`relative w-10 h-10 md:w-11 md:h-11 transition-opacity ${
              agent.isAvailable ? 'opacity-80 hover:opacity-100' : 'opacity-40'
            }`}>
              <Image
                src={agent.icon}
                alt={agent.name}
                fill
                className="object-contain filter brightness-0 invert"
              />
            </div>
            {!agent.isAvailable && (
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-mono text-white/60 bg-black/80 px-2 py-1 rounded">
                  Coming Soon
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
