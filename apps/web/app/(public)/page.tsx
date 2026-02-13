import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchBar } from '@/components/layout/search-bar'
import { Package, Users, Zap, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container px-4 py-24 md:py-32">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
            <Zap className="mr-2 h-4 w-4" />
            <span>The agent package registry</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Discover, Share, and Deploy
            <span className="text-primary"> AI Agents</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl">
            AgentPkg is a modern package registry for AI agents. Browse thousands of
            agents, publish your own, and manage them with ease.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button asChild size="lg" className="flex-1">
              <Link href="/register">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1">
              <Link href="/agents">Browse Agents</Link>
            </Button>
          </div>

          <div className="w-full max-w-xl mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16 bg-muted/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Package className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Easy Publishing</CardTitle>
              <CardDescription>
                Publish your agents with a simple command. Version control and
                management built-in.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Create organizations, invite team members, and collaborate on
                agent development.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Install and deploy agents instantly. Built for speed and
                reliability.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold">1,000+</div>
            <div className="text-muted-foreground mt-2">Agents Published</div>
          </div>
          <div>
            <div className="text-4xl font-bold">500+</div>
            <div className="text-muted-foreground mt-2">Organizations</div>
          </div>
          <div>
            <div className="text-4xl font-bold">10,000+</div>
            <div className="text-muted-foreground mt-2">Downloads</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-16 bg-muted/30">
        <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to publish your first agent?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of developers building the future of AI agents.
          </p>
          <Button asChild size="lg">
            <Link href="/register">Create an Account</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
