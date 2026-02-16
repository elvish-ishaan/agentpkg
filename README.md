# AgentPKG

> **npm for AI agents** - A package manager and registry for sharing, discovering, and managing AI agents and skills

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/elvish-ishaan/agentpkg/releases)

AgentPKG is a comprehensive platform for publishing, discovering, and managing AI agents and skills. Just like npm revolutionized JavaScript package management, AgentPKG makes it effortless to share and reuse AI agent configurations across projects and teams.

## Features

- 🚀 **CLI Tool**: Publish and install agents/skills with simple commands (`agentpkg publish agent`, `agentpkg add agent @org/agent`)
- 🔒 **Private by Default**: All agents and skills are private to your organization unless explicitly made public
- 🏢 **Organizations**: Create organizations and invite team members to collaborate
- 📦 **Versioning**: Semantic versioning support with version history tracking
- 🔐 **Access Control**: Choose between private (org-only) or public access for each agent/skill
- 🌐 **Web UI**: Browse, search, and manage agents/skills through a modern web interface
- ✅ **Integrity Checking**: SHA-256 checksums verify file integrity during installation
- ⚡ **Fast**: Built with Bun runtime for maximum performance

## What's Inside?

This is a Turborepo monorepo containing:

### Apps

- **`apps/cli`**: Command-line tool for publishing and installing agents/skills ([CLI Documentation](apps/cli/README.md))
- **`apps/api`**: Backend REST API with authentication, storage, and access control ([API Documentation](apps/api/README.md))
- **`apps/web`**: Next.js web application for browsing and managing agents/skills ([Web Documentation](apps/web/README.md))

### Packages

- **`packages/eslint-config`**: Shared ESLint configurations
- **`packages/typescript-config`**: Shared TypeScript configurations

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Tech Stack

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime and package manager
- **Web Framework**: [Next.js](https://nextjs.org/) - React framework for production
- **API Framework**: [Express](https://expressjs.com/) - Node.js web framework
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/) ORM
- **Storage**: [Google Cloud Storage](https://cloud.google.com/storage) for agent/skill files
- **Monorepo**: [Turborepo](https://turborepo.dev/) for efficient builds
- **UI Library**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **CLI Framework**: [@clack/prompts](https://github.com/natemoo-re/clack) for beautiful terminal UIs

## Quick Start

### For Users: Installing the CLI

```bash
# Install Bun runtime
curl -fsSL https://bun.sh/install | bash

# Install AgentPKG CLI globally
bun install -g @agentpkg/cli

# Login (create account via web UI first at https://agentpkg.com)
agentpkg login

# Install an agent
agentpkg add agent @acme/my-agent

# Publish your agent
agentpkg publish agent
```

See [CLI Documentation](apps/cli/README.md) for complete usage guide.

### For Developers: Setting Up the Platform

```bash
# Clone the repository
git clone https://github.com/elvish-ishaan/agentpkg.git
cd agentpkg

# Install dependencies
bun install

# Set up environment variables (see Environment Variables section)
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Set up database
cd apps/api
bun prisma migrate dev
bun prisma generate

# Start development servers
cd ../..
bun dev
```

This starts:
- API server at `http://localhost:4000`
- Web app at `http://localhost:3000`
- CLI can connect to local API via `AGENTPKG_API_URL=http://localhost:4000`

## Project Structure

```
agentpkg/
├── apps/
│   ├── api/                    # Backend REST API
│   │   ├── src/
│   │   │   ├── routes/         # API endpoints
│   │   │   ├── middleware/     # Auth, validation, error handling
│   │   │   ├── services/       # Business logic (GCS, email)
│   │   │   └── index.ts        # Express app entry point
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── migrations/     # Database migrations
│   │   └── package.json
│   │
│   ├── cli/                    # Command-line tool
│   │   ├── src/
│   │   │   ├── commands/       # CLI commands (login, publish, add, etc.)
│   │   │   ├── utils/          # Helpers (API client, validation, file I/O)
│   │   │   └── config/         # Configuration paths
│   │   ├── index.ts            # CLI entry point
│   │   └── package.json
│   │
│   └── web/                    # Web application
│       ├── app/                # Next.js app directory
│       ├── components/         # React components
│       ├── lib/                # Utilities and API client
│       └── package.json
│
├── packages/
│   ├── eslint-config/          # Shared ESLint config
│   └── typescript-config/      # Shared TypeScript config
│
├── turbo.json                  # Turborepo configuration
├── DESIGN.md                   # Architecture and design decisions
├── CHANGELOG.md                # Project changelog
└── README.md                   # This file
```

## Development

### Build All Apps and Packages

```bash
# Build everything
bun run build

# Build a specific app
bun run build --filter=cli
bun run build --filter=api
bun run build --filter=web
```

### Development Mode

```bash
# Run all dev servers
bun dev

# Run specific app
bun dev --filter=api
bun dev --filter=web
```

### Linting and Formatting

```bash
# Lint all packages
bun run lint

# Lint specific package
bun run lint --filter=cli
```

## Documentation

- **[CLI Documentation](apps/cli/README.md)**: Complete CLI usage guide
- **[API Documentation](apps/api/README.md)**: Backend API reference and setup
- **[Web Documentation](apps/web/README.md)**: Web app features and development
- **[Design Document](DESIGN.md)**: Architecture, decisions, and technical design
- **[Changelog](CHANGELOG.md)**: Version history and release notes

## Architecture

### Authentication Flow

1. User registers via web UI (creates user + default org)
2. User logs in via CLI or web
3. JWT token issued and stored locally (`~/.agentpkg/config.json` for CLI)
4. Token included in API requests for authentication

### Publishing Flow

1. User creates `agent.agent.md` or `SKILL.md` file
2. Runs `agentpkg publish agent` or `agentpkg publish skill`
3. CLI validates file, prompts for metadata (org, version, access level)
4. File uploaded to GCS with SHA-256 checksum
5. Metadata stored in PostgreSQL with version tracking
6. **Default access**: Private (org members only)

### Access Control

- **Private** (default): Only organization members can view and install
- **Public**: Anyone can view and install
- **Ownership**: Only org owners can change access levels
- **Filtering**: API automatically filters results based on user membership

### Installation Flow

1. User runs `agentpkg add agent @org/agent` or `agentpkg add skill @org/skill`
2. CLI requests agent/skill metadata from API
3. API checks user permissions (public access OR user is org member)
4. CLI downloads file from GCS
5. Verifies checksum matches
6. Saves to `.github/agents/` or `.github/skills/` directory

## Deployment

### API Deployment

```bash
# Build for production
cd apps/api
bun install --production
bun run build

# Run migrations
bun prisma migrate deploy

# Start server
bun run start
```

**Environment**: Node.js/Bun-compatible platform (e.g., Railway, Render, Fly.io)

### Web Deployment

```bash
# Build for production
cd apps/web
bun run build

# Start server
bun run start
```

**Recommended**: Deploy to [Vercel](https://vercel.com) for optimal Next.js performance

### CLI Publishing

```bash
# Publish to npm
cd apps/cli
bun run build  # If needed
npm publish
```

See [CLI PUBLISHING.md](apps/cli/PUBLISHING.md) for detailed npm publishing instructions.

## Environment Variables

### API (`apps/api/.env`)

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/agentpkg"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-secret-key"

# Google Cloud Storage
GCS_PROJECT_ID="your-project-id"
GCS_BUCKET_NAME="agentpkg-storage"
GCS_KEY_FILE="path/to/service-account-key.json"

# Email (optional, for invitations)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="AgentPKG <noreply@agentpkg.com>"

# Server
PORT="4000"
```

### Web (`apps/web/.env`)

```bash
# API URL
NEXT_PUBLIC_API_URL="http://localhost:4000"

# Or for production
NEXT_PUBLIC_API_URL="https://api.agentpkg.com"
```

### CLI (for users)

```bash
# Set API URL (default: https://api.agentpkg.com)
export AGENTPKG_API_URL="http://localhost:4000"  # For local development
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Versioning

This project uses [Semantic Versioning](https://semver.org/):

- **Current Version**: 0.2.0
- **Major.Minor.Patch** (e.g., 1.2.3)
- See [CHANGELOG.md](CHANGELOG.md) for version history

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- **Issues**: [GitHub Issues](https://github.com/elvish-ishaan/agentpkg/issues)
- **Discussions**: [GitHub Discussions](https://github.com/elvish-ishaan/agentpkg/discussions)
- **CLI Package**: [npm @agentpkg/cli](https://www.npmjs.com/package/@agentpkg/cli)

---

Built with ❤️ by [Elvish Ishaan](https://github.com/elvish-ishaan)
