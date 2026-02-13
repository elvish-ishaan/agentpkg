# AgentPkg Web Application

A modern web application for browsing, publishing, and managing AI agent packages - similar to npm.org for JavaScript packages.

## Features

- 🔐 **User Authentication** - Secure login and registration with HTTP-only cookies
- 📦 **Agent Browsing** - View agents by organization, see details and versions
- 🏢 **Organization Management** - Create orgs, view members, manage settings
- 🎨 **Professional UI** - Built with shadcn/ui and Tailwind CSS
- 🔌 **Backend Integration** - Connected to Express.js API with token-based auth

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: @tanstack/react-query
- **Forms**: react-hook-form + zod
- **HTTP Client**: axios
- **Markdown**: react-markdown with syntax highlighting

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- AgentPkg API server running at http://localhost:4000

### Installation

1. Install dependencies:
```bash
bun install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=AgentPkg
```

3. Start the development server:
```bash
bun dev
```

The app will be available at http://localhost:3000

## Project Structure

```
apps/web/
├── app/
│   ├── (auth)/              # Login, register pages
│   ├── (public)/            # Home, agents, orgs pages
│   ├── (protected)/         # Dashboard, settings pages
│   ├── agent/@[org]/[name]/ # Agent detail pages
│   └── orgs/[orgName]/      # Organization pages
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── auth/                # Auth forms
│   ├── agents/              # Agent components
│   ├── orgs/                # Organization components
│   ├── layout/              # Navbar, footer
│   └── settings/            # Settings components
├── lib/
│   ├── api/                 # API client, endpoints
│   ├── auth/                # Auth context, token manager
│   ├── hooks/               # Custom React hooks
│   └── providers/           # React Query provider
├── types/                   # TypeScript types
└── middleware.ts            # Route protection
```

## Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint
- `bun check-types` - Type check

## Key Features

### Authentication
- Login/Register with email and password
- HTTP-only cookie-based sessions
- Protected routes with middleware
- User profile management

### Agent Management
- Browse all agents
- View agent details with README
- Version history
- Install commands with copy-to-clipboard
- Publish new agents or versions

### Organizations
- Create and manage organizations
- Team collaboration with roles
- Member management (owners only)
- Organization-scoped agents

### Settings
- Profile information
- API token management
- Create, view, and revoke tokens

## API Integration

The web app connects to the AgentPkg API with the following endpoints:

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user
- `POST /auth/token` - Create API token
- `GET /auth/tokens` - List API tokens
- `DELETE /auth/token/:id` - Revoke API token
- `POST /orgs` - Create organization
- `GET /orgs` - Get user's organizations
- `GET /orgs/:org` - Get organization details
- `POST /orgs/:org/members` - Add member
- `POST /agents/publish` - Publish agent
- `GET /agents/@:org/:name` - Get agent details
- `GET /agents/@:org/:name/versions` - List agent versions
- `GET /agents/@:org` - List organization's agents

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:4000)
- `NEXT_PUBLIC_APP_NAME` - Application name (default: AgentPkg)

## License

MIT
