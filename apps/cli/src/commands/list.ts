import * as clack from "@clack/prompts";
import { apiRequest } from "../api/client.js";
import { formatError } from "../utils/errors.js";
import type { AgentListItem, Skill } from "../types/api.js";

export async function list() {
  try {
    // Get org from arguments
    let org = process.argv[3];
    const typeArg = process.argv[4]; // "agents" or "skills"

    if (!org) {
      clack.cancel(
        "Please specify an organization (e.g., agentpkg list myorg agents)",
      );
      process.exit(1);
    }

    if (!typeArg) {
      clack.cancel("Please specify what to list: agents or skills");
      process.exit(1);
    }

    if (typeArg !== "agents" && typeArg !== "skills") {
      clack.cancel(`Unknown type: ${typeArg}. Use 'agents' or 'skills'`);
      process.exit(1);
    }

    // Remove @ prefix if provided
    if (org.startsWith("@")) {
      org = org.substring(1);
    }

    if (typeArg === "agents") {
      await listAgents(org);
    } else {
      await listSkills(org);
    }
  } catch (error) {
    clack.cancel(formatError(error));
    process.exit(1);
  }
}

async function listAgents(org: string) {
  // Fetch agents
  const spinner = clack.spinner();
  spinner.start(`Fetching agents from @${org}...`);

  const agents = await apiRequest<AgentListItem[]>(`/agents/@${org}`, {
    method: "GET",
    requireAuth: false,
  });

  spinner.stop("Agents fetched");

  if (agents.length === 0) {
    clack.outro(`No agents found in @${org}`);
    return;
  }

  // Display agents
  console.log("");
  console.log(`  Agents in @${org}:`);
  console.log("");
  for (const agent of agents) {
    console.log(`  • ${agent.name}@${agent.latestVersion}`);
    if (agent.description) {
      console.log(`    ${agent.description}`);
    }
    console.log(
      `    Published: ${new Date(agent.publishedAt).toLocaleDateString()}`,
    );
    console.log("");
  }
}

async function listSkills(org: string) {
  // Fetch skills
  const spinner = clack.spinner();
  spinner.start(`Fetching skills from @${org}...`);

  const skills = await apiRequest<Skill[]>(`/skills/@${org}`, {
    method: "GET",
    requireAuth: false,
  });

  spinner.stop("Skills fetched");

  if (skills.length === 0) {
    clack.outro(`No skills found in @${org}`);
    return;
  }

  // Display skills
  console.log("");
  console.log(`  Skills in @${org}:`);
  console.log("");
  for (const skill of skills) {
    const version = skill.latestVersion?.version || "unknown";
    console.log(`  • ${skill.name}@${version}`);
    if (skill.description) {
      console.log(`    ${skill.description}`);
    }
    console.log(
      `    Published: ${new Date(skill.createdAt).toLocaleDateString()}`,
    );
    console.log("");
  }
}

// Run if executed directly
if (import.meta.main) {
  await list();
}
