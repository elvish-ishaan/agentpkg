import { homedir } from "node:os";
import { join } from "node:path";

// Configuration directory (~/.agentpkg)
export const CONFIG_DIR = join(homedir(), ".agentpkg");

// Configuration file path
export const CONFIG_FILE = join(CONFIG_DIR, "config.json");

// Default API URL (can be overridden with AGENTPKG_API_URL env var)
export const DEFAULT_API_URL = "https://api.agentpkg.com";

// Install directory for agents (.github/agents)
export const INSTALL_DIR = ".github/agents";

// Agent filename
export const AGENT_FILENAME = "agent.agent.md";

// Install directory for skills (.github/skills)
export const SKILLS_INSTALL_DIR = ".github/skills";

// Skill filename
export const SKILL_FILENAME = "SKILL.md";
