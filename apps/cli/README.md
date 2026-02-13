# AgentPKG CLI

> A beautiful, npm-like command-line tool for publishing and installing AI agents

AgentPKG CLI provides an intuitive way to share and discover AI agents. Publish your agents to the registry and install agents from others with simple commands.

## Features

- 🚀 **Easy Publishing**: Publish agents with interactive prompts or CI/CD-ready flags
- 📦 **Simple Installation**: Install agents to `.github/agents/` with one command
- 🎨 **Beautiful UI**: Modern terminal experience powered by Clack
- 🔐 **Secure**: Token-based authentication with checksums for verification
- 🏢 **Organizations**: Manage multiple organizations and team agents
- ⚡ **Fast**: Built with Bun for speed

## Installation

```bash
# Install globally with Bun
bun install -g agentpkg

# Or link for local development
cd apps/cli
bun link
```

## Quick Start

```bash
# 1. Create an account
agentpkg register

# 2. Initialize a new agent
agentpkg init

# 3. Edit agent.agent.md with your agent's instructions

# 4. Publish your agent
agentpkg publish

# 5. Install someone else's agent
agentpkg install @acme/my-agent
```

## Commands

### Authentication

#### `agentpkg register`

Create a new AgentPKG account. You'll be prompted for:
- Email address
- Username (lowercase, alphanumeric, hyphens only)
- Password (minimum 8 characters)

A default organization with your username is created automatically.

```bash
$ agentpkg register
┌  AgentPKG Registration
│
◆  Email: user@example.com
◆  Username: johndoe
◆  Password: ••••••••
│
└  ✓ Welcome, johndoe! Your default org '@johndoe' has been created.
```

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

#### `agentpkg init`

Create an `agent.agent.md` template file in the current directory.

```bash
$ agentpkg init
✓ Created agent.agent.md
```

The template includes frontmatter for metadata and a basic instruction structure.

#### `agentpkg publish`

Publish an agent to the registry.

**Interactive mode** (default):

```bash
$ agentpkg publish
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
│
├  Details:
│  • Organization: @myorg
│  • Name: my-awesome-agent
│  • Version: 1.0.0
│  • Size: 12.5 KB
│  • Checksum: a3f7b2c1...
│
◆  Publish @myorg/my-awesome-agent@1.0.0? Yes
│
└  ✓ Published @myorg/my-awesome-agent@1.0.0
```

**Non-interactive mode** (for CI/CD):

```bash
$ agentpkg publish --org myorg --name myagent --version 1.0.0 --yes
```

Options:
- `--org <name>`: Organization name (required)
- `--name <name>`: Agent name (required)
- `--version <version>`: Version in semver format (required)
- `--description <desc>`: Agent description (optional)
- `--yes`: Skip all prompts

#### `agentpkg install <@org/agent>`

Install an agent from the registry.

```bash
# Install latest version
$ agentpkg install @acme/my-agent

# Install specific version
$ agentpkg install @acme/my-agent@1.2.0
```

Agents are installed to `.github/agents/<name>.agent.md`.

```bash
$ agentpkg install @acme/my-agent
┌  Install @acme/my-agent (latest)
│
◇  Fetching agent info...
◇  Downloading...
◇  Verifying checksum...
│
└  ✓ Installed @acme/my-agent@1.0.0
   Location: .github/agents/my-agent.agent.md
```

#### `agentpkg list <org>`

List all agents published by an organization.

```bash
$ agentpkg list acme

  Agents in @acme:

  • my-agent@1.0.0
    A helpful AI agent
    Published: 1/1/2026

  • another-agent@2.1.0
    Another awesome agent
    Published: 1/2/2026
```

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
  "apiUrl": "http://localhost:4000",
  "token": "your-auth-token"
}
```

### Environment Variables

- `AGENTPKG_API_URL`: Override the API base URL (default: `http://localhost:4000`)

Example:
```bash
export AGENTPKG_API_URL=https://api.agentpkg.com
agentpkg login
```

## File Structure

```
.
├── agent.agent.md              # Your agent file (created by init)
└── .github/
    └── agents/                 # Installed agents directory
        ├── agent1.agent.md
        └── agent2.agent.md
```

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

```yaml
# .github/workflows/publish.yml
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
      - run: bun install -g agentpkg
      - run: |
          agentpkg publish \
            --org myorg \
            --name myagent \
            --version ${GITHUB_REF#refs/tags/v} \
            --yes
        env:
          AGENTPKG_API_URL: https://api.agentpkg.com
```

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

## License

MIT

## Support

- **Issues**: https://github.com/yourusername/agentpkg/issues
- **Discussions**: https://github.com/yourusername/agentpkg/discussions
