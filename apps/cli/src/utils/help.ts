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
    login                    Login to your account
    register                 Create a new account
    logout                   Logout from your account
    whoami                   Show current user info

  Agent Management:
    init                     Create agent.agent.md template
    publish                  Publish agent to registry
    install <@org/agent>     Install agent from registry
    list <org>               List agents in organization

  Organization Management:
    orgs list                List your organizations
    orgs create              Create a new organization

  General:
    --help, -h               Show this help message
    --version, -v            Show version number

EXAMPLES
  # Create an account
  $ agentpkg register

  # Login
  $ agentpkg login

  # Initialize a new agent
  $ agentpkg init

  # Publish an agent (interactive)
  $ agentpkg publish

  # Publish an agent (non-interactive, for CI/CD)
  $ agentpkg publish --org myorg --name myagent --version 1.0.0 --yes

  # Install an agent
  $ agentpkg install @acme/my-agent
  $ agentpkg install @acme/my-agent@1.2.0

  # List agents in an organization
  $ agentpkg list acme

  # List your organizations
  $ agentpkg orgs list

  # Create an organization
  $ agentpkg orgs create

CONFIGURATION
  Config file: ~/.agentpkg/config.json
  Environment variables:
    AGENTPKG_API_URL    API base URL (default: http://localhost:4000)

LEARN MORE
  Documentation: https://github.com/yourusername/agentpkg
  Issues: https://github.com/yourusername/agentpkg/issues
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
`,
    register: `
agentpkg register

Create a new AgentPKG account.

USAGE
  $ agentpkg register

This command will prompt you for:
  • Email address
  • Username (lowercase, alphanumeric, hyphens only)
  • Password (minimum 8 characters)

A default organization with your username will be created automatically.
`,
    publish: `
agentpkg publish

Publish an agent to the registry.

USAGE
  $ agentpkg publish                                    # Interactive mode
  $ agentpkg publish [options] --yes                    # Non-interactive mode

OPTIONS
  --org <name>         Organization name (required in non-interactive mode)
  --name <name>        Agent name (required in non-interactive mode)
  --version <version>  Version in semver format (required in non-interactive mode)
  --description <desc> Agent description (optional)
  --yes                Skip confirmation prompts (for CI/CD)

EXAMPLES
  # Interactive: prompts for all inputs
  $ agentpkg publish

  # Non-interactive: all flags required
  $ agentpkg publish --org myorg --name myagent --version 1.0.0 --yes

The command reads agent.agent.md from the current directory.
`,
    install: `
agentpkg install

Install an agent from the registry.

USAGE
  $ agentpkg install <@org/agent>         # Install latest version
  $ agentpkg install <@org/agent@version> # Install specific version

EXAMPLES
  $ agentpkg install @acme/my-agent
  $ agentpkg install @acme/my-agent@1.2.0

Agents are installed to .github/agents/<name>.agent.md
`,
  };

  const help = helps[command];
  if (help) {
    console.log(help);
  } else {
    console.log(`No help available for command: ${command}`);
  }
}
