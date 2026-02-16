# Changelog

All notable changes to AgentPkg will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-02-14

### 🚀 Added - Private/Public Access Control System

#### CLI Features
- **Private-by-default publishing**: All new agents and skills are now private by default
- **`--access` flag**: Control access level during publishing (`--access public` or `--access private`)
- **`update-access` command**: Change access level after publishing
  - `agentpkg update-access agent --org myorg --name myagent --access public`
  - `agentpkg update-access skill --org myorg --name myskill --access private`
- Interactive prompts for access level selection during publishing
- Updated help documentation with new flags and commands

#### Backend API Features
- **Access control on all agents/skills**: Filter content based on user authentication and organization membership
- **Optional authentication**: Public endpoints now support optional auth to show user's private content
- **Email invitation system**: Invite team members to organizations via email
  - 7-day expiration on invitations
  - Secure token-based acceptance
  - Email notifications (requires SMTP configuration)
- **Organization member management**: Full invitation workflow with pending/accepted/expired states
- **Access level endpoints**: PATCH endpoints to update agent/skill access levels (owner only)

#### Web UI Features
- **Visual indicators**: Lock icon and "Private" badge on private agents/skills
- **Access control toggle**: Switch component for owners to change access levels
- **Invite member dialog**: Send email invitations to join organizations
- **Invitation accept page**: Dedicated page at `/invite/accept` for accepting invitations
- **Enhanced agent/skill cards**: Show access status clearly on all listings

#### Database Changes
- Added `Access` enum (PRIVATE/PUBLIC) to schema
- Added `access` field to Agent and Skill models with indexes
- Created `OrgInvitation` model for email invitation system
- Migration: All existing agents/skills are now PRIVATE by default

### 🔒 Security
- **Private-by-default**: Protects organization IP and internal work by default
- **Organization-scoped access**: Only org members can view/install private content
- **Owner-only modification**: Only org owners can change access levels
- **Secure invitation tokens**: 32-byte random tokens for invitation links

### 📝 Documentation
- Updated CLI help text with new commands and flags
- Added access control examples to README
- Documented SMTP configuration for email invitations
- Added migration notes for existing users

### ⚡ Technical Improvements
- Optional authentication middleware for public/private content filtering
- Enhanced API filtering based on user membership
- Email service with nodemailer integration
- Graceful degradation when SMTP is not configured

### 🔄 Breaking Changes
- **All existing agents/skills are now PRIVATE**: After updating, all previously public agents/skills will be private. Org owners need to explicitly make them public using:
  - Web UI: Toggle on agent/skill page
  - CLI: `agentpkg update-access agent --access public`

### ⚠️ Deprecated
- **CLI `install` command**: Use `agentpkg add agent` instead. The `install` command will be removed in v1.0.0.
  - Old: `agentpkg install @org/agent`
  - New: `agentpkg add agent @org/agent`

### 📦 Dependencies
- Added `nodemailer` for email functionality
- Added `@types/nodemailer` for TypeScript support

### 🐛 Bug Fixes
- Fixed access control validation in publish workflow
- Improved error messages for permission-denied scenarios

---

## [0.1.0] - 2025-02-13

### 🎉 Initial Release

#### CLI Features
- Authentication commands (`login`, `logout`, `whoami`)
  - **Note:** Registration is web-only, not available via CLI
  - `register` and `init` commands were never implemented
- Agent management (`add agent`, `publish agent`, `install` [deprecated])
- Skill management (`add skill`, `publish skill`)
- Organization management (`orgs list`, `orgs create`)
- List commands for agents and skills
- Interactive and non-interactive modes
- Beautiful terminal UI with @clack/prompts

#### Backend API
- User authentication with JWT tokens
- Organization management
- Agent publishing and versioning
- Skill publishing and versioning
- GCS integration for file storage
- Download tracking
- RESTful API with Express

#### Web UI
- Agent and skill browsing
- Organization pages
- User authentication
- Responsive design with Tailwind CSS
- Agent/skill detail pages with version history

#### Infrastructure
- PostgreSQL database with Prisma ORM
- Bun runtime for CLI and API
- Next.js for web frontend
- Turborepo monorepo structure
- Docker support

---

## Release Links

- [0.2.0](https://github.com/elvish-ishaan/agentpkg/releases/tag/v0.2.0) - 2025-02-14
- [0.1.0](https://github.com/elvish-ishaan/agentpkg/releases/tag/v0.1.0) - 2025-02-13
