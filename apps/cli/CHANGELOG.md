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

## [0.1.0] - 2026-02-14

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

[Unreleased]: https://github.com/yourusername/agentpkg/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/agentpkg/releases/tag/v0.1.0
