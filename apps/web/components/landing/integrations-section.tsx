import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Terminal, Globe, Layout } from 'lucide-react'

const integrations = [
  {
    icon: Terminal,
    title: 'CLI Tool',
    description: 'Powerful command-line interface for publishing, installing, and managing packages from your terminal.',
    code: 'agentpkg publish',
  },
  {
    icon: Globe,
    title: 'REST API',
    description: 'Complete REST API for programmatic access to all registry features and package management.',
    code: 'GET /api/v1/agents',
  },
  {
    icon: Layout,
    title: 'Web Dashboard',
    description: 'Intuitive web interface for browsing packages, managing organizations, and viewing analytics.',
    code: 'agentpkg.dev',
  },
]

export function IntegrationsSection() {
  return (
    <section className="min-h-screen w-full bg-[#0f0f0f] relative text-white py-24">
      {/* Diagonal Grid with Green Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(0, 255, 128, 0.1) 0, rgba(0, 255, 128, 0.1) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(-45deg, rgba(0, 255, 128, 0.1) 0, rgba(0, 255, 128, 0.1) 1px, transparent 1px, transparent 20px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="container relative z-10 px-4 mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
            style={{ fontFamily: "'Della Respira', serif" }}
          >
            One Registry, Multiple Interfaces
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Access AgentPkg however you prefer — CLI, API, or Web
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {integrations.map((integration) => {
            const Icon = integration.icon
            return (
              <Card
                key={integration.title}
                className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-green-500/50 transition-all text-white"
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 border border-green-500/20">
                    <Icon className="h-7 w-7 text-green-500" />
                  </div>
                  <CardTitle className="text-2xl text-white">{integration.title}</CardTitle>
                  <CardDescription className="text-base pt-2 text-gray-400">
                    {integration.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-black/40 rounded-md p-3 font-mono text-sm border border-gray-800">
                    <code className="text-green-400">{integration.code}</code>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
