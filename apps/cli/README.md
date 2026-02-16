# AgentPKG CLI

[![npm version](https://badge.fury.io/js/%40agentpkg%2Fcli.svg)](https://www.npmjs.com/package/@agentpkg/cli)
[![npm downloads](https://img.shields.io/npm/dm/@agentpkg/cli.svg)](https://www.npmjs.com/package/@agentpkg/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A beautiful, npm-like command-line tool for publishing and installing AI agents

AgentPKG CLI provides an intuitive way to share and discover AI agents. Publish your agents to the registry and install agents from others with simple commands.

## Features

- 🚀 **Easy Publishing**: Publish agents with interactive prompts or CI/CD-ready flags
- 🔒 **Private by Default**: All agents/skills are private to your org unless you make them public
- 📦 **Simple Installation**: Install agents to `.github/agents/` with one command
- 🎨 **Beautiful UI**: Modern terminal experience powered by Clack
- 🔐 **Secure**: Token-based authentication with checksums for verification
- 🏢 **Organizations**: Manage multiple organizations and team agents
- ✉️ **Team Invitations**: Invite team members via email
- ⚡ **Fast**: Built with Bun for speed

## Installation

### Prerequisites

AgentPKG CLI requires [Bun](https://bun.sh) runtime. Install Bun first:

```bash
# Install Bun (macOS, Linux, WSL)
curl -fsSL https://bun.sh/install | bash

# Or on Windows with PowerShell
powershell -c "irm bun.sh/install.ps1|iex"
```

### Install AgentPKG CLI

```bash
# Install globally from npm
bun install -g @agentpkg/cli

# Or use bunx to run without installing
bunx @agentpkg/cli --help
```

### For Local Development

```bash
# Clone the repository
git clone https://github.com/elvish-ishaan/agentpkg.git
cd agentpkg/apps/cli

# Install dependencies
bun install

# Link for global usage
bun link

# Now you can use agentpkg globally
agentpkg --help
```

## Quick Start

```bash
# 1. Create an account (via web UI at https://agentpkg.com)

# 2. Login via CLI
agentpkg login

# 3. Create agent.agent.md manually with your agent's instructions
# (or use the web UI to create and manage agents)

# 4. Publish your agent
agentpkg publish agent

# 5. Install someone else's agent
agentpkg add agent @acme/my-agent
```

## Commands

### Authentication

> **Note:** Account registration is only available through the web interface at https://agentpkg.com. After creating an account on the web, you can login via the CLI.

#### `agentpkg login`

Login to your account.

```bash
$ agentpkg login
┌  AgentPKG Login
│
◆  Email: user@example.com
◆  Password: ••••••••
│
└  ✓ Logged in as johndoe
```

#### `agentpkg logout`

Logout from your account.

```bash
$ agentpkg logout
✓ Logged out successfully
```

#### `agentpkg whoami`

Show information about the currently logged-in user.

```bash
$ agentpkg whoami
  ID:       abc123
  Email:    user@example.com
  Username: johndoe
  Joined:   1/1/2026
```

### Agent Management

> **Note:** To create an `agent.agent.md` file, either create it manually following the format described in the "Agent File Format" section below, or use the web UI at https://agentpkg.com.

#### `agentpkg publish agent`

Publish an agent to the registry. **All agents are private by default** (only org members can view/install).

**Interactive mode** (default):

```bash
$ agentpkg publish agent
┌  Publish Agent
│
◇  Reading agent.agent.md... (12.5 KB)
│
◆  Select organization:
│  ● myorg
│  ○ acme-corp
│
◆  Agent name: my-awesome-agent
◆  Version: 1.0.0
◆  Description (optional): An awesome AI agent
◆  Access level:
│  ● Private (org members only)
│  ○ Public (anyone can view)
│
├  Details:
│  • Organization: @myorg
│  • Name: my-awesome-agent
│  • Version: 1.0.0
│  • Access: Private
│  • Size: 12.5 KB
│  • Checksum: a3f7b2c1...
│
◆  Publish @myorg/my-awesome-agent@1.0.0? Yes
│
└  ✓ Published @myorg/my-awesome-agent@1.0.0
```

**Non-interactive mode** (for CI/CD):

```bash
# Publish as private (default)
$ agentpkg publish agent --org myorg --name myagent --version 1.0.0 --yes

# Publish as public
$ agentpkg publish agent --org myorg --name myagent --version 1.0.0 --access public --yes
```

Options:
- `--org <name>`: Organization name (required)
- `--name <name>`: Agent name (required)
- `--version <version>`: Version in semver format (required)
- `--description <desc>`: Agent description (optional)
- `--access <level>`: Access level - `private` (default) or `public`
- `--yes`: Skip all prompts

**Access Levels:**
- **Private** (default): Only organization members can view and install
- **Public**: Anyone can view and install

#### `agentpkg add agent <@org/agent>`

Install an agent from the registry.

> **Deprecation Notice:** The `agentpkg install` command is deprecated. Use `agentpkg add agent` instead. The `install` command will be removed in v1.0.0.

```bash
# Install latest version
$ agentpkg add agent @acme/my-agent

# Install specific version
$ agentpkg add agent @acme/my-agent@1.2.0
```

Agents are installed to `.github/agents/<name>.agent.md`.

```bash
$ agentpkg add agent @acme/my-agent
┌  Install @acme/my-agent (latest)
│
◇  Fetching agent info...
◇  Downloading...
◇  Verifying checksum...
│
└  ✓ Installed @acme/my-agent@1.0.0
   Location: .github/agents/my-agent.agent.md
```

#### `agentpkg list <org> agents`

List all agents published by an organization.

```bash
$ agentpkg list acme agents

  Agents in @acme:

  • my-agent@1.0.0
    A helpful AI agent
    Published: 1/1/2026

  • another-agent@2.1.0
    Another awesome agent
    Published: 1/2/2026
```

### Skill Management

Skills are reusable capabilities that can be added to AI agents. They follow the same publishing and access control model as agents.

#### `agentpkg add skill <@org/skill>`

Install a skill from the registry.

```bash
# Install latest version
$ agentpkg add skill @acme/my-skill

# Install specific version
$ agentpkg add skill @acme/my-skill@1.0.0
```

Skills are installed to `.github/skills/<name>/SKILL.md`.

```bash
$ agentpkg add skill @acme/my-skill
┌  Install @acme/my-skill (latest)
│
◇  Fetching skill info...
◇  Downloading...
◇  Verifying checksum...
│
└  ✓ Installed @acme/my-skill@1.0.0
   Location: .github/skills/my-skill/SKILL.md
```

#### `agentpkg publish skill`

Publish a skill to the registry. **All skills are private by default** (only org members can view/install).

**Interactive mode** (default):

```bash
$ agentpkg publish skill
┌  Publish Skill
│
◇  Reading SKILL.md... (8.2 KB)
│
◆  Select organization:
│  ● myorg
│  ○ acme-corp
│
◆  Skill name: my-awesome-skill
◆  Version: 1.0.0
◆  Description (optional): An awesome reusable skill
◆  Access level:
│  ● Private (org members only)
│  ○ Public (anyone can view)
│
├  Details:
│  • Organization: @myorg
│  • Name: my-awesome-skill
│  • Version: 1.0.0
│  • Access: Private
│  • Size: 8.2 KB
│  • Checksum: b4e8c3d2...
│
◆  Publish @myorg/my-awesome-skill@1.0.0? Yes
│
└  ✓ Published @myorg/my-awesome-skill@1.0.0
```

**Non-interactive mode** (for CI/CD):

```bash
# Publish as private (default)
$ agentpkg publish skill --org myorg --name myskill --version 1.0.0 --yes

# Publish as public
$ agentpkg publish skill --org myorg --name myskill --version 1.0.0 --access public --yes

# Specify skill directory
$ agentpkg publish skill --org myorg --name myskill --version 1.0.0 --dir .github/skills/myskill --yes
```

Options:
- `--org <name>`: Organization name (required)
- `--name <name>`: Skill name (required)
- `--version <version>`: Version in semver format (required)
- `--description <desc>`: Skill description (optional)
- `--access <level>`: Access level - `private` (default) or `public`
- `--dir <path>`: Skill directory path (optional, defaults to current directory)
- `--yes`: Skip all prompts

#### `agentpkg list <org> skills`

List all skills published by an organization.

```bash
$ agentpkg list acme skills

  Skills in @acme:

  • my-skill@1.0.0
    A helpful reusable skill
    Published: 1/1/2026

  • another-skill@2.1.0
    Another awesome skill
    Published: 1/2/2026
```

#### `agentpkg update-access`

Change the access level of a published agent or skill. **Only organization owners can update access levels.**

**Interactive mode** (default):

```bash
$ agentpkg update-access agent
┌  Update Agent Access
│
◆  Select organization: myorg
◆  Agent name: my-awesome-agent
◆  New access level:
│  ● Private (org members only)
│  ○ Public (anyone can view)
│
◆  Update @myorg/my-awesome-agent access to private? Yes
│
└  ✓ Updated @myorg/my-awesome-agent access to private
```

**Non-interactive mode** (for CI/CD):

```bash
# Make an agent public
$ agentpkg update-access agent --org myorg --name myagent --access public --yes

# Make a skill private
$ agentpkg update-access skill --org myorg --name myskill --access private --yes
```

Options:
- `--org <name>`: Organization name (required)
- `--name <name>`: Agent/skill name (required)
- `--access <level>`: New access level - `private` or `public` (required)
- `--yes`: Skip confirmation prompt

### Organization Management

#### `agentpkg orgs list`

List your organizations.

```bash
$ agentpkg orgs list

  Your organizations:

  • @myorg
    Created: 1/1/2026
    Members: 3

  • @acme-corp
    Created: 1/5/2026
    Members: 10
```

#### `agentpkg orgs create`

Create a new organization.

```bash
$ agentpkg orgs create
┌  Create Organization
│
◆  Organization name: my-new-org
│
└  ✓ Created organization @my-new-org
```

## Configuration

Configuration is stored in `~/.agentpkg/config.json`:

```json
{
  "apiUrl": "https://api.agentpkg.com",
  "token": "your-auth-token"
}
```

### Environment Variables

- `AGENTPKG_API_URL`: Override the API base URL (default: `https://api.agentpkg.com`)
  - For local development, set this to `http://localhost:4000`

Example:
```bash
# Set API URL for local development
export AGENTPKG_API_URL=http://localhost:4000

# Or add to your shell profile (~/.bashrc, ~/.zshrc)
echo 'export AGENTPKG_API_URL=http://localhost:4000' >> ~/.zshrc

agentpkg login
```

## File Structure

```
.
├── agent.agent.md              # Your agent file (create manually or via web UI)
└── .github/
    ├── agents/                 # Installed agents directory
    │   ├── agent1.agent.md
    │   └── agent2.agent.md
    └── skills/                 # Installed skills directory
        ├── skill1/
        │   └── SKILL.md
        └── skill2/
            └── SKILL.md
```

## Access Control

AgentPKG supports **private and public agents/skills** to protect your organization's intellectual property.

### Default Behavior

- **All agents/skills are private by default** when published
- Only organization members can view and install private content
- Public content is visible to everyone

### Making Content Public

```bash
# Publish as public
agentpkg publish agent --access public

# Or change after publishing (owners only)
agentpkg update-access agent --org myorg --name myagent --access public
```

### Use Cases

**Private (Default):**
- Internal company agents
- Work-in-progress agents
- Proprietary automation
- Team-specific tools

**Public:**
- Open-source agents
- Community contributions
- Educational examples
- Public utilities

### ⚠️ Important: Version 0.2.0 Breaking Change

If you're upgrading from version 0.1.0:
- **All existing agents/skills are now private by default**
- Use `agentpkg update-access` to make them public if needed
- Or use the web UI to toggle access levels

## Agent File Format

Agent files use markdown with YAML frontmatter:

```markdown
---
name: my-agent
version: 1.0.0
description: A helpful AI agent
---

# Agent Instructions

You are a helpful AI agent...

## Guidelines

- Be helpful and polite
- Follow user instructions carefully

## Example Usage

...
```

## CI/CD Integration

Use non-interactive mode for automated publishing:

### Agent Publishing Workflow

```yaml
# .github/workflows/publish-agent.yml
name: Publish Agent

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
          agentpkg publish agent \
            --org myorg \
            --name myagent \
            --version ${GITHUB_REF#refs/tags/v} \
            --access private \
            --yes
        env:
          AGENTPKG_API_URL: ${{ secrets.AGENTPKG_API_URL || 'https://api.agentpkg.com' }}
          AGENTPKG_TOKEN: ${{ secrets.AGENTPKG_TOKEN }}

  # For public agents
  publish-public:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install -g @agentpkg/cli
      - run: |
          agentpkg publish agent \
            --org myorg \
            --name myagent \
            --version ${GITHUB_REF#refs/tags/v} \
            --access public \
            --yes
        env:
          AGENTPKG_API_URL: ${{ secrets.AGENTPKG_API_URL || 'https://api.agentpkg.com' }}
          AGENTPKG_TOKEN: ${{ secrets.AGENTPKG_TOKEN }}
```

### Skill Publishing Workflow

```yaml
# .github/workflows/publish-skill.yml
name: Publish Skill

on:
  push:
    tags:
      - 'skill-v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install -g @agentpkg/cli
      - run: |
          agentpkg publish skill \
            --org myorg \
            --name myskill \
            --version ${GITHUB_REF#refs/tags/skill-v} \
            --dir .github/skills/myskill \
            --access private \
            --yes
        env:
          AGENTPKG_API_URL: ${{ secrets.AGENTPKG_API_URL || 'https://api.agentpkg.com' }}
          AGENTPKG_TOKEN: ${{ secrets.AGENTPKG_TOKEN }}
```

> **Note:** Store your authentication token in GitHub Secrets as `AGENTPKG_TOKEN`. You can get your token from `~/.agentpkg/config.json` after logging in.

## Development

```bash
# Install dependencies
cd apps/cli
bun install

# Run commands
bun run index.ts login
bun run index.ts --help

# Link for global usage
bun link
agentpkg --help
```

## Error Handling

The CLI provides helpful error messages:

- **Not logged in**: `Not logged in. Run 'agentpkg login' first.`
- **Invalid credentials**: `Invalid email or password.`
- **Permission denied**: `You are not a member of @org. Contact an owner to be added.`
- **Version conflict**: `Agent version @org/name@version already exists. Use a different version.`
- **Network error**: `Cannot connect to AgentPKG API. Check your connection or API_URL.`

## Validation Rules

### Agent Names
- Must start with a letter
- Lowercase letters, numbers, and hyphens only
- Minimum 3 characters

### Organization Names
- Must start with a letter
- Lowercase letters, numbers, and hyphens only
- Minimum 3 characters

### Versions
- Must follow semantic versioning (e.g., `1.0.0`)
- Format: `MAJOR.MINOR.PATCH`

## Security

- Authentication tokens are stored securely in `~/.agentpkg/config.json`
- All published agents include SHA-256 checksums
- Checksums are verified during installation
- HTTPS recommended for production API

## Publishing to npm

If you're a maintainer looking to publish this CLI to npm, see [PUBLISHING.md](./PUBLISHING.md) for detailed instructions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT - see [LICENSE](../../LICENSE) file for details

## Support

- **Issues**: https://github.com/elvish-ishaan/agentpkg/issues
- **Discussions**: https://github.com/elvish-ishaan/agentpkg/discussions
- **npm Package**: https://www.npmjs.com/package/@agentpkg/cli

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.
