'use client'

import { LandingNavbar } from '@/components/landing/landing-navbar'
import { LandingFooter } from '@/components/landing/landing-footer'
import { DocSection } from '@/components/docs/doc-section'
import { DocSidebar } from '@/components/docs/doc-sidebar'
import { CodeBlock } from '@/components/docs/code-block'
import { DocTabs } from '@/components/docs/doc-tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Lock,
  Users,
  Package,
  GitBranch,
  Settings,
  FileCode,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import { Terminal } from '@/components/ui/terminal'

const sections = [
  { id: 'getting-started', title: 'Getting Started', children: [
    { id: 'installation', title: 'Installation' },
    { id: 'quick-start', title: 'Quick Start' },
  ]},
  { id: 'authentication', title: 'Authentication' },
  { id: 'agents', title: 'Working with Agents', children: [
    { id: 'publishing-agents', title: 'Publishing Agents' },
    { id: 'installing-agents', title: 'Installing Agents' },
  ]},
  { id: 'skills', title: 'Working with Skills', children: [
    { id: 'publishing-skills', title: 'Publishing Skills' },
    { id: 'installing-skills', title: 'Installing Skills' },
  ]},
  { id: 'organizations', title: 'Organizations' },
  { id: 'access-control', title: 'Access Control' },
  { id: 'ci-cd', title: 'CI/CD Integration' },
  { id: 'file-formats', title: 'File Formats' },
  { id: 'configuration', title: 'Configuration' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black">
      <LandingNavbar />

      {/* Documentation Content */}
      <div className="bg-[#0f0f0f] min-h-screen pt-10">
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="flex gap-12">
            {/* Sidebar */}
            <DocSidebar sections={sections} />

            {/* Main Content */}
            <main className="flex-1 max-w-4xl">

              {/* Getting Started */}
              <DocSection
                id="getting-started"
                title="Getting Started"
                description="Get up and running with AgentPKG in minutes. Install the CLI, create your account, and publish your first agent."
                level={1}
              >
                {/* Installation */}
                <div id="installation" className="scroll-mt-24">
                  <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-actor)' }}>
                    Installation
                  </h3>

                  <p className="text-gray-300 mb-4">
                    AgentPKG CLI requires <a href="https://bun.sh" className="text-blue-400 hover:underline">Bun</a> runtime. Install Bun first, then install the AgentPKG CLI globally.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Step 1: Install Bun</p>
                      <CodeBlock code="curl -fsSL https://bun.sh/install | bash" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-2">Step 2: Install AgentPKG CLI</p>
                      <CodeBlock code="bun install -g @agentpkg/cli" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-2">Step 3: Verify Installation</p>
                      <CodeBlock code="agentpkg --version" />
                    </div>
                  </div>
                </div>

                {/* Quick Start */}
                <div id="quick-start" className="scroll-mt-24 mt-12">
                  <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-actor)' }}>
                    Quick Start
                  </h3>

                  <p className="text-gray-300 mb-4">
                    Follow these steps to publish your first agent:
                  </p>

                  <div className="space-y-6">
                    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                            1
                          </div>
                          <CardTitle className="text-white">Create an Account</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="text-gray-300">
                        <p className="mb-3">Account registration is only available through the web interface.</p>
                        <Button asChild size="sm" className="bg-white text-black hover:bg-gray-200">
                          <Link href="/register">Register on Web →</Link>
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                            2
                          </div>
                          <CardTitle className="text-white">Login via CLI</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="text-gray-300">
                        <CodeBlock code="agentpkg login" />
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                            3
                          </div>
                          <CardTitle className="text-white">Create agent.agent.md</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="text-gray-300">
                        <p className="mb-3">Create a file named <code className="bg-black/40 px-2 py-1 rounded text-green-400">agent.agent.md</code> in your project with your agent instructions.</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                            4
                          </div>
                          <CardTitle className="text-white">Publish Your Agent</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="text-gray-300">
                        <CodeBlock code="agentpkg publish agent" />
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                            5
                          </div>
                          <CardTitle className="text-white">Install Other Agents</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="text-gray-300">
                        <CodeBlock code="agentpkg add agent @acme/my-agent" />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </DocSection>

              {/* Authentication */}
              <DocSection
                id="authentication"
                title="Authentication"
                description="Manage your AgentPKG account and authenticate the CLI."
              >
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-blue-400 font-semibold mb-1">Important</p>
                      <p className="text-gray-300 text-sm">
                        Account registration is only available through the web interface at{' '}
                        <Link href="/register" className="text-blue-400 hover:underline">agentpkg.com/register</Link>.
                        After creating an account, you can login via the CLI.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3">Login</h4>
                    <p className="text-gray-300 mb-3">
                      Login to your account to start publishing and installing agents.
                    </p>
                    <CodeBlock code="agentpkg login" />
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3">Check Login Status</h4>
                    <CodeBlock code="agentpkg whoami" />
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3">Logout</h4>
                    <CodeBlock code="agentpkg logout" />
                  </div>
                </div>
              </DocSection>

              {/* Working with Agents */}
              <DocSection
                id="agents"
                title="Working with Agents"
                description="Publish your AI agents to the registry and install agents from others."
              >
                {/* Publishing Agents */}
                <div id="publishing-agents" className="scroll-mt-24">
                  <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-actor)' }}>
                    <Package className="inline-block mr-2 h-6 w-6" />
                    Publishing Agents
                  </h3>

                  <p className="text-gray-300 mb-6">
                    Publish your agents to the AgentPKG registry. All agents are <strong>private by default</strong> (only organization members can view/install).
                  </p>

                  <DocTabs
                    tabs={[
                      {
                        label: 'Interactive Mode',
                        content: (
                          <div className="space-y-4">
                            <p className="text-gray-300">
                              Interactive mode prompts you for all required information:
                            </p>
                            <CodeBlock code="agentpkg publish agent" />
                            <p className="text-sm text-gray-400">
                              You'll be prompted to select your organization, enter name, version, description, and choose access level (private/public).
                            </p>
                          </div>
                        ),
                      },
                      {
                        label: 'CI/CD Mode',
                        content: (
                          <div className="space-y-4">
                            <p className="text-gray-300">
                              Non-interactive mode for automated publishing in CI/CD pipelines:
                            </p>
                            <CodeBlock
                              code={`# Publish as private (default)
agentpkg publish agent \\
  --org myorg \\
  --name myagent \\
  --version 1.0.0 \\
  --yes

# Publish as public
agentpkg publish agent \\
  --org myorg \\
  --name myagent \\
  --version 1.0.0 \\
  --access public \\
  --yes`}
                            />
                          </div>
                        ),
                      },
                    ]}
                  />

                  <div className="mt-6 bg-gray-900/30 border border-gray-800 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-white mb-2">Available Options:</h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li><code className="bg-black/40 px-2 py-0.5 rounded text-green-400">--org</code> Organization name (required in CI/CD)</li>
                      <li><code className="bg-black/40 px-2 py-0.5 rounded text-green-400">--name</code> Agent name (required in CI/CD)</li>
                      <li><code className="bg-black/40 px-2 py-0.5 rounded text-green-400">--version</code> Version in semver format (required in CI/CD)</li>
                      <li><code className="bg-black/40 px-2 py-0.5 rounded text-green-400">--description</code> Agent description (optional)</li>
                      <li><code className="bg-black/40 px-2 py-0.5 rounded text-green-400">--access</code> Access level: private (default) or public</li>
                      <li><code className="bg-black/40 px-2 py-0.5 rounded text-green-400">--yes</code> Skip all prompts</li>
                    </ul>
                  </div>
                </div>

                {/* Installing Agents */}
                <div id="installing-agents" className="scroll-mt-24 mt-12">
                  <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-actor)' }}>
                    <Terminal className="inline-block mr-2 h-6 w-6" />
                    Installing Agents
                  </h3>

                  <p className="text-gray-300 mb-6">
                    Install agents from the registry to your project. Agents are installed to <code className="bg-black/40 px-2 py-0.5 rounded text-green-400">.github/agents/</code> directory.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Install latest version:</p>
                      <CodeBlock code="agentpkg add agent @acme/my-agent" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-2">Install specific version:</p>
                      <CodeBlock code="agentpkg add agent @acme/my-agent@1.2.0" />
                    </div>
                  </div>

                  <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-yellow-400 font-semibold mb-1">Deprecation Notice</p>
                        <p className="text-gray-300 text-sm">
                          The <code className="bg-black/40 px-2 py-0.5 rounded">agentpkg install</code> command is deprecated.
                          Use <code className="bg-black/40 px-2 py-0.5 rounded">agentpkg add agent</code> instead.
                          The install command will be removed in v1.0.0.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </DocSection>

              {/* Working with Skills */}
              <DocSection
                id="skills"
                title="Working with Skills"
                description="Skills are reusable capabilities that can be added to AI agents."
              >
                {/* Publishing Skills */}
                <div id="publishing-skills" className="scroll-mt-24">
                  <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-actor)' }}>
                    <FileCode className="inline-block mr-2 h-6 w-6" />
                    Publishing Skills
                  </h3>

                  <p className="text-gray-300 mb-6">
                    Skills follow the same publishing model as agents. All skills are <strong>private by default</strong>.
                  </p>

                  <DocTabs
                    tabs={[
                      {
                        label: 'Interactive Mode',
                        content: (
                          <div className="space-y-4">
                            <CodeBlock code="agentpkg publish skill" />
                            <p className="text-sm text-gray-400">
                              The command reads SKILL.md from your current directory or specified skill directory.
                            </p>
                          </div>
                        ),
                      },
                      {
                        label: 'CI/CD Mode',
                        content: (
                          <div className="space-y-4">
                            <CodeBlock
                              code={`# Publish skill from specific directory
agentpkg publish skill \\
  --org myorg \\
  --name myskill \\
  --version 1.0.0 \\
  --dir .github/skills/myskill \\
  --yes`}
                            />
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>

                {/* Installing Skills */}
                <div id="installing-skills" className="scroll-mt-24 mt-12">
                  <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-actor)' }}>
                    Installing Skills
                  </h3>

                  <p className="text-gray-300 mb-6">
                    Install skills to <code className="bg-black/40 px-2 py-0.5 rounded text-green-400">.github/skills/&lt;name&gt;/SKILL.md</code>
                  </p>

                  <div className="space-y-4">
                    <CodeBlock code="agentpkg add skill @acme/my-skill" />
                    <CodeBlock code="agentpkg add skill @acme/my-skill@1.0.0" />
                  </div>
                </div>
              </DocSection>

              {/* Organizations */}
              <DocSection
                id="organizations"
                title="Organizations"
                description="Create and manage organizations to collaborate with your team."
              >
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3 flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      List Your Organizations
                    </h4>
                    <CodeBlock code="agentpkg orgs list" />
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3">Create New Organization</h4>
                    <CodeBlock code="agentpkg orgs create" />
                    <p className="text-sm text-gray-400 mt-2">
                      You'll be prompted to enter an organization name. Names must be lowercase, alphanumeric, and can include hyphens.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3">Inviting Team Members</h4>
                    <p className="text-gray-300 mb-3">
                      Team invitations are managed through the web UI. Navigate to your organization settings to invite members via email.
                    </p>
                    <Button asChild size="sm" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                      <Link href="/dashboard/organizations">
                        Manage Organizations →
                      </Link>
                    </Button>
                  </div>
                </div>
              </DocSection>

              {/* Access Control */}
              <DocSection
                id="access-control"
                title="Access Control"
                description="Control who can view and install your agents and skills with private and public access levels."
              >
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                    <CardHeader>
                      <Lock className="h-8 w-8 text-white mb-2" />
                      <CardTitle className="text-white">Private (Default)</CardTitle>
                      <CardDescription className="text-gray-400">
                        Only organization members can view and install
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>Internal company agents</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>Work-in-progress</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>Proprietary automation</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                    <CardHeader>
                      <Package className="h-8 w-8 text-white mb-2" />
                      <CardTitle className="text-white">Public</CardTitle>
                      <CardDescription className="text-gray-400">
                        Anyone can view and install
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>Open-source agents</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>Community contributions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>Educational examples</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3">Update Access Level</h4>
                    <p className="text-gray-300 mb-4">
                      Only organization owners can change access levels.
                    </p>
                    <DocTabs
                      tabs={[
                        {
                          label: 'Interactive',
                          content: <CodeBlock code="agentpkg update-access agent" />,
                        },
                        {
                          label: 'Non-Interactive',
                          content: <CodeBlock code="agentpkg update-access agent --org myorg --name myagent --access public --yes" />,
                        },
                      ]}
                    />
                  </div>
                </div>
              </DocSection>

              {/* CI/CD Integration */}
              <DocSection
                id="ci-cd"
                title="CI/CD Integration"
                description="Automate agent and skill publishing with GitHub Actions or other CI/CD platforms."
              >
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3 flex items-center">
                      <GitBranch className="h-5 w-5 mr-2" />
                      GitHub Actions Example
                    </h4>
                    <p className="text-gray-300 mb-4">
                      Publish agents automatically when you create a new tag:
                    </p>
                    <CodeBlock
                      language="yaml"
                      code={`name: Publish Agent

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install -g @agentpkg/cli
      - run: |
          agentpkg publish agent \\
            --org myorg \\
            --name myagent \\
            --version \${GITHUB_REF#refs/tags/v} \\
            --access private \\
            --yes
        env:
          AGENTPKG_API_URL: \${{ secrets.AGENTPKG_API_URL || 'https://api.agentpkg.com' }}
          AGENTPKG_TOKEN: \${{ secrets.AGENTPKG_TOKEN }}`}
                    />
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-blue-400 font-semibold mb-1">GitHub Secrets</p>
                        <p className="text-gray-300 text-sm">
                          Store your authentication token in GitHub Secrets as <code className="bg-black/40 px-2 py-0.5 rounded">AGENTPKG_TOKEN</code>.
                          You can get your token from <code className="bg-black/40 px-2 py-0.5 rounded">~/.agentpkg/config.json</code> after logging in.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </DocSection>

              {/* File Formats */}
              <DocSection
                id="file-formats"
                title="File Formats"
                description="Learn about the structure of agent and skill files."
              >
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3">Agent File (agent.agent.md)</h4>
                    <p className="text-gray-300 mb-4">
                      Agent files use Markdown with YAML frontmatter:
                    </p>
                    <CodeBlock
                      language="markdown"
                      code={`---
name: my-agent
version: 1.0.0
description: A helpful AI agent
---

# Agent Instructions

You are a helpful AI agent that...

## Guidelines

- Be helpful and polite
- Follow user instructions carefully

## Example Usage

...`}
                    />
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3">Skill File (SKILL.md)</h4>
                    <p className="text-gray-300 mb-4">
                      Skills are stored in a directory structure: <code className="bg-black/40 px-2 py-0.5 rounded text-green-400">&lt;skill-name&gt;/SKILL.md</code>
                    </p>
                    <CodeBlock
                      language="markdown"
                      code={`# Skill: My Awesome Skill

## Description
This skill provides...

## Usage
To use this skill...

## Examples
...`}
                    />
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3">Directory Structure</h4>
                    <CodeBlock
                      language="bash"
                      code={`.
├── agent.agent.md
└── .github/
    ├── agents/
    │   ├── agent1.agent.md
    │   └── agent2.agent.md
    └── skills/
        ├── skill1/
        │   └── SKILL.md
        └── skill2/
            └── SKILL.md`}
                    />
                  </div>
                </div>
              </DocSection>

              {/* Configuration */}
              <DocSection
                id="configuration"
                title="Configuration"
                description="Configure the CLI and environment variables."
              >
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3 flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Configuration File
                    </h4>
                    <p className="text-gray-300 mb-4">
                      Configuration is stored in <code className="bg-black/40 px-2 py-0.5 rounded text-green-400">~/.agentpkg/config.json</code>:
                    </p>
                    <CodeBlock
                      language="json"
                      code={`{
  "apiUrl": "https://api.agentpkg.com",
  "token": "your-auth-token"
}`}
                    />
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3">Environment Variables</h4>
                    <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4 space-y-3">
                      <div>
                        <code className="bg-black/40 px-2 py-1 rounded text-green-400 text-sm">AGENTPKG_API_URL</code>
                        <p className="text-sm text-gray-400 mt-1">
                          Override the API base URL (default: <code className="bg-black/40 px-1.5 py-0.5 rounded">https://api.agentpkg.com</code>)
                        </p>
                        <CodeBlock code="export AGENTPKG_API_URL=http://localhost:4000" />
                      </div>
                    </div>
                  </div>
                </div>
              </DocSection>

              {/* Troubleshooting */}
              <DocSection
                id="troubleshooting"
                title="Troubleshooting"
                description="Common issues and their solutions."
              >
                <div className="space-y-6">
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Not logged in</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-400">Error: <code className="bg-black/40 px-2 py-0.5 rounded text-red-400">Not logged in. Run 'agentpkg login' first.</code></p>
                      <p className="text-sm text-gray-300">Solution: Run <code className="bg-black/40 px-2 py-0.5 rounded text-green-400">agentpkg login</code> to authenticate.</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Version already exists</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-400">Error: <code className="bg-black/40 px-2 py-0.5 rounded text-red-400">Agent version already exists</code></p>
                      <p className="text-sm text-gray-300">Solution: Use a different version number. AgentPKG uses semantic versioning.</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Permission denied</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-400">Error: <code className="bg-black/40 px-2 py-0.5 rounded text-red-400">You are not a member of this organization</code></p>
                      <p className="text-sm text-gray-300">Solution: Contact the organization owner to be added as a member.</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Cannot connect to API</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-400">Error: <code className="bg-black/40 px-2 py-0.5 rounded text-red-400">Cannot connect to AgentPKG API</code></p>
                      <p className="text-sm text-gray-300">Solution: Check your internet connection and verify the API URL is correct.</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 bg-gray-900/30 border border-gray-800 rounded-lg p-6 text-center">
                  <p className="text-gray-300 mb-4">Need more help?</p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button asChild variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                      <a href="https://github.com/elvish-ishaan/agentpkg/issues" target="_blank" rel="noopener noreferrer">
                        Open an Issue →
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                      <a href="https://github.com/elvish-ishaan/agentpkg/discussions" target="_blank" rel="noopener noreferrer">
                        Join Discussions →
                      </a>
                    </Button>
                  </div>
                </div>
              </DocSection>

            </main>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  )
}
