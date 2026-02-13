import * as clack from "@clack/prompts";
import { apiRequest } from "../api/client.js";
import { formatError } from "../utils/errors.js";
import type { AgentListItem } from "../types/api.js";

export async function list() {
  try {
    // Get org from arguments
    let org = process.argv[3];

    if (!org) {
      clack.cancel(
        "Please specify an organization (e.g., agentpkg list myorg)",
      );
      process.exit(1);
    }

    // Remove @ prefix if provided
    if (org.startsWith("@")) {
      org = org.substring(1);
    }

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
  } catch (error) {
    clack.cancel(formatError(error));
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.main) {
  await list();
}
