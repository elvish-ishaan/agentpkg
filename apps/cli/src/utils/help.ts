/**
 * Display main help text
 */
export function showHelp() {
  console.log(`
AgentPKG - AI Agent Package Manager

USAGE
  agentpkg <command> [options]

COMMANDS
  Authentication:
    login                         Login to your account
    logout                        Logout from your account
    whoami                        Show current user info

  Agent & Skill Management:
    add agent <@org/agent>        Install agent from registry
    add skill <@org/skill>        Install skill from registry
    publish agent                 Publish agent to registry
    publish skill                 Publish skill to registry
    update-access agent           Update agent access level (private/public)
    update-access skill           Update skill access level (private/public)
    list <org> agents             List agents in organization
    list <org> skills             List skills in organization

  Organization Management:
    orgs list                     List your organizations
    orgs create                   Create a new organization

  General:
    --help, -h                    Show this help message
    --version, -v                 Show version number

EXAMPLES
  # Login (registration is web-only)
  $ agentpkg login

  # Publish an agent (interactive)
  $ agentpkg publish agent

  # Publish an agent (non-interactive, for CI/CD)
  $ agentpkg publish agent --org myorg --name myagent --version 1.0.0 --yes

  # Publish a skill
  $ agentpkg publish skill

  # Install an agent
  $ agentpkg add agent @acme/my-agent
  $ agentpkg add agent @acme/my-agent@1.2.0

  # Install a skill
  $ agentpkg add skill @acme/my-skill
  $ agentpkg add skill @acme/my-skill@1.0.0

  # List agents in an organization
  $ agentpkg list acme agents

  # List skills in an organization
  $ agentpkg list acme skills

  # List your organizations
  $ agentpkg orgs list

  # Create an organization
  $ agentpkg orgs create

CONFIGURATION
  Config file: ~/.agentpkg/config.json
  Environment variables:
    AGENTPKG_API_URL    API base URL (default: https://api.agentpkg.com)
                        For local development: http://localhost:4000

LEARN MORE
  Documentation: https://github.com/elvish-ishaan/agentpkg
  Issues: https://github.com/elvish-ishaan/agentpkg/issues
`);
}

/**
 * Display command-specific help
 */
export function showCommandHelp(command: string) {
  const helps: Record<string, string> = {
    login: `
agentpkg login

Login to your AgentPKG account.

USAGE
  $ agentpkg login

This command will prompt you for your email and password.
Note: Registration is available only through the web application.
`,
    publish: `
agentpkg publish

Publish an agent or skill to the registry.

USAGE
  $ agentpkg publish agent                              # Publish agent (interactive)
  $ agentpkg publish skill                              # Publish skill (interactive)
  $ agentpkg publish agent [options] --yes              # Non-interactive mode
  $ agentpkg publish skill [options] --yes              # Non-interactive mode

OPTIONS
  --org <name>         Organization name (required in non-interactive mode)
  --name <name>        Agent/skill name (required in non-interactive mode)
  --version <version>  Version in semver format (required in non-interactive mode)
  --description <desc> Description (optional)
  --access <level>     Access level: private (default) or public
  --dir <path>         Skill directory path (skills only, optional)
  --yes                Skip confirmation prompts (for CI/CD)

EXAMPLES
  # Interactive: prompts for all inputs
  $ agentpkg publish agent
  $ agentpkg publish skill

  # Non-interactive: all flags required
  $ agentpkg publish agent --org myorg --name myagent --version 1.0.0 --yes
  $ agentpkg publish skill --org myorg --name myskill --version 1.0.0 --yes

The agent command reads agent.agent.md from the current directory.
The skill command reads SKILL.md from the specified directory or current directory.
`,
    add: `
agentpkg add

Install an agent or skill from the registry.

USAGE
  $ agentpkg add agent <@org/agent>         # Install latest version
  $ agentpkg add agent <@org/agent@version> # Install specific version
  $ agentpkg add skill <@org/skill>         # Install latest version
  $ agentpkg add skill <@org/skill@version> # Install specific version

EXAMPLES
  $ agentpkg add agent @acme/my-agent
  $ agentpkg add agent @acme/my-agent@1.2.0
  $ agentpkg add skill @acme/my-skill
  $ agentpkg add skill @acme/my-skill@1.0.0

Agents are installed to .github/agents/<name>.agent.md
Skills are installed to .github/skills/<name>/SKILL.md
`,
    install: `
agentpkg install (deprecated)

This command is deprecated. Use 'agentpkg add agent' instead.

USAGE
  $ agentpkg add agent <@org/agent>         # Install latest version
  $ agentpkg add agent <@org/agent@version> # Install specific version

For more information, run: agentpkg add --help
`,
    "update-access": `
agentpkg update-access

Update the access level of a published agent or skill.

USAGE
  $ agentpkg update-access agent                     # Update agent (interactive)
  $ agentpkg update-access skill                     # Update skill (interactive)
  $ agentpkg update-access agent [options] --yes     # Non-interactive mode
  $ agentpkg update-access skill [options] --yes     # Non-interactive mode

OPTIONS
  --org <name>     Organization name (required in non-interactive mode)
  --name <name>    Agent/skill name (required in non-interactive mode)
  --access <level> Access level: private or public (required in non-interactive mode)
  --yes            Skip confirmation prompts (for CI/CD)

EXAMPLES
  # Interactive: prompts for all inputs
  $ agentpkg update-access agent
  $ agentpkg update-access skill

  # Non-interactive: all flags required
  $ agentpkg update-access agent --org myorg --name myagent --access public --yes
  $ agentpkg update-access skill --org myorg --name myskill --access private --yes

Access levels:
  - private: Only organization members can view and install
  - public: Anyone can view and install
`,
  };

  const help = helps[command];
  if (help) {
    console.log(help);
  } else {
    console.log(`No help available for command: ${command}`);
  }
}
