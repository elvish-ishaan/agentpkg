# Changelog

All notable changes to AgentPKG CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Interactive agent search and discovery
- Agent templates library
- Version update notifications
- Offline mode support
- Agent dependency management

## [0.2.0] - 2025-02-14

### 🚀 Added - Private/Public Access Control System

#### New Commands
- **`update-access`**: Change access level of published agents/skills
  - `agentpkg update-access agent --org myorg --name myagent --access public`
  - `agentpkg update-access skill --org myorg --name myskill --access private`
  - Supports both interactive and non-interactive modes
  - Owner-only permission enforcement

#### Enhanced Publishing
- **Private by default**: All agents/skills now default to private access
- **`--access` flag**: Control access level during publishing
  - `--access private` - Only organization members can view (default)
  - `--access public` - Anyone can view and install
- **Interactive access prompt**: Choose access level interactively during publish
- Visual confirmation of access level in publish workflow

#### Security
- Private-by-default protects organization intellectual property
- Organization-scoped access control
- Only org owners can modify access levels
- Automatic filtering based on user membership

#### Documentation
- Updated README with comprehensive access control guide
- Added migration notes for v0.1.0 users
- New CI/CD examples for private/public publishing
- Updated help text with access control commands
- Breaking change warnings and upgrade instructions

### 🔄 Breaking Changes
- **All agents/skills are now private by default**
- Existing content from v0.1.0 will be private after database migration
- Use `update-access` command or web UI to make content public if desired

### Example Usage

```bash
# Publish as private (default)
agentpkg publish agent

# Publish as public
agentpkg publish agent --access public

# Change access level later
agentpkg update-access agent --org myorg --name myagent --access public

# Non-interactive for CI/CD
agentpkg publish agent --org myorg --name myagent --version 1.0.0 --access public --yes
```

## [0.1.0] - 2025-02-13

### Added
- Initial release of AgentPKG CLI
- User authentication (register, login, logout, whoami)
- Agent lifecycle management (init, publish, install)
- Organization management (create, list)
- Agent discovery (list agents by organization)
- Beautiful terminal UI powered by Clack
- Checksum verification for agent files
- Interactive and non-interactive (CI/CD) modes
- Support for semantic versioning
- Configuration management (~/.agentpkg/config.json)
- Environment variable support (AGENTPKG_API_URL)
- Comprehensive error handling and validation
- Agent installation to .github/agents/ directory
- Automatic default organization creation
- Token-based authentication

### Features
- 🚀 Publish agents with `agentpkg publish`
- 📦 Install agents with `agentpkg install @org/agent`
- 🎨 Interactive prompts for better UX
- 🔐 Secure token storage
- 🏢 Multi-organization support
- ⚡ Built with Bun for speed

### Documentation
- Comprehensive README with examples
- Command usage documentation
- CI/CD integration guide
- Publishing guide for maintainers
- Validation rules and security notes

## Release Notes Format

### Added
New features and capabilities

### Changed
Changes to existing functionality

### Deprecated
Features that will be removed in future versions

### Removed
Features that have been removed

### Fixed
Bug fixes

### Security
Security improvements and vulnerability fixes

---

[Unreleased]: https://github.com/elvish-ishaan/agentpkg/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/elvish-ishaan/agentpkg/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/elvish-ishaan/agentpkg/releases/tag/v0.1.0
