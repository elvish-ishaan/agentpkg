import * as clack from "@clack/prompts";
import { parseArgs } from "node:util";
import { apiRequest } from "../api/client.js";
import { formatError } from "../utils/errors.js";
import {
  validateAgentName,
  validateOrgName,
} from "../utils/validation.js";
import type { Organization } from "../types/api.js";

export async function updateAccess() {
  const subcommand = process.argv[3];

  if (!subcommand || subcommand.startsWith("--")) {
    clack.cancel("Please specify what to update: agent or skill");
    process.exit(1);
  }

  switch (subcommand) {
    case "agent":
      await updateAgentAccess();
      break;
    case "skill":
      await updateSkillAccess();
      break;
    default:
      clack.cancel(`Unknown subcommand: ${subcommand}. Use 'agent' or 'skill'`);
      process.exit(1);
  }
}

async function updateAgentAccess() {
  try {
    // Parse command-line arguments
    const { values } = parseArgs({
      args: process.argv.slice(4), // Skip node, script, command, subcommand
      options: {
        org: { type: "string" },
        name: { type: "string" },
        access: { type: "string" },
        yes: { type: "boolean" },
      },
      allowPositionals: false,
    });

    const nonInteractive = values.yes || false;

    // Validate access flag if provided
    if (values.access && !['private', 'public'].includes(values.access.toLowerCase())) {
      clack.cancel("Invalid --access. Use 'private' or 'public'");
      process.exit(1);
    }

    let org: string;
    let name: string;
    let access: 'PRIVATE' | 'PUBLIC';

    if (nonInteractive) {
      // Non-interactive mode: require all flags
      if (!values.org || !values.name || !values.access) {
        clack.cancel(
          "Non-interactive mode requires --org, --name, and --access flags",
        );
        process.exit(1);
      }

      org = values.org;
      name = values.name;
      access = values.access.toUpperCase() as 'PRIVATE' | 'PUBLIC';

      // Validate inputs
      const orgError = validateOrgName(org);
      if (orgError) {
        clack.cancel(orgError);
        process.exit(1);
      }

      const nameError = validateAgentName(name);
      if (nameError) {
        clack.cancel(nameError);
        process.exit(1);
      }
    } else {
      // Interactive mode
      clack.intro("Update Agent Access");

      // Fetch user's organizations
      const spinner = clack.spinner();
      spinner.start("Fetching organizations...");
      const orgs = await apiRequest<Organization[]>("/orgs", {
        method: "GET",
        requireAuth: true,
      });
      spinner.stop("Organizations fetched");

      if (orgs.length === 0) {
        clack.cancel(
          "You don't have any organizations. Create one with 'agentpkg orgs create'",
        );
        process.exit(1);
      }

      // Prompt for organization
      const selectedOrg = await clack.select({
        message: "Select organization:",
        options: orgs.map((o) => ({
          value: o.name,
          label: `@${o.name}`,
        })),
      });

      if (clack.isCancel(selectedOrg)) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }

      org = selectedOrg as string;

      // Prompt for agent name
      const agentName = await clack.text({
        message: "Agent name:",
        placeholder: "my-awesome-agent",
        validate: validateAgentName,
      });

      if (clack.isCancel(agentName)) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }

      name = agentName as string;

      // Prompt for access level
      const accessLevel = await clack.select({
        message: "New access level:",
        options: [
          { value: "private", label: "Private (org members only)" },
          { value: "public", label: "Public (anyone can view)" },
        ],
      });

      if (clack.isCancel(accessLevel)) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }

      access = (accessLevel as string).toUpperCase() as 'PRIVATE' | 'PUBLIC';

      // Confirm update
      const confirm = await clack.confirm({
        message: `Update @${org}/${name} access to ${access.toLowerCase()}?`,
      });

      if (clack.isCancel(confirm) || !confirm) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }
    }

    // Update access via API
    const updateSpinner = clack.spinner();
    updateSpinner.start("Updating access...");

    await apiRequest(`/agents/@${org}/${name}/access`, {
      method: "PATCH",
      body: {
        access,
      },
      requireAuth: true,
    });

    updateSpinner.stop("Access updated successfully");

    clack.outro(`✓ Updated @${org}/${name} access to ${access.toLowerCase()}`);
  } catch (error) {
    clack.cancel(formatError(error));
    process.exit(1);
  }
}

async function updateSkillAccess() {
  try {
    // Parse command-line arguments
    const { values } = parseArgs({
      args: process.argv.slice(4), // Skip node, script, command, subcommand
      options: {
        org: { type: "string" },
        name: { type: "string" },
        access: { type: "string" },
        yes: { type: "boolean" },
      },
      allowPositionals: false,
    });

    const nonInteractive = values.yes || false;

    // Validate access flag if provided
    if (values.access && !['private', 'public'].includes(values.access.toLowerCase())) {
      clack.cancel("Invalid --access. Use 'private' or 'public'");
      process.exit(1);
    }

    let org: string;
    let name: string;
    let access: 'PRIVATE' | 'PUBLIC';

    if (nonInteractive) {
      // Non-interactive mode: require all flags
      if (!values.org || !values.name || !values.access) {
        clack.cancel(
          "Non-interactive mode requires --org, --name, and --access flags",
        );
        process.exit(1);
      }

      org = values.org;
      name = values.name;
      access = values.access.toUpperCase() as 'PRIVATE' | 'PUBLIC';

      // Validate inputs
      const orgError = validateOrgName(org);
      if (orgError) {
        clack.cancel(orgError);
        process.exit(1);
      }

      const nameError = validateAgentName(name); // Can reuse agent name validation
      if (nameError) {
        clack.cancel(nameError);
        process.exit(1);
      }
    } else {
      // Interactive mode
      clack.intro("Update Skill Access");

      // Fetch user's organizations
      const spinner = clack.spinner();
      spinner.start("Fetching organizations...");
      const orgs = await apiRequest<Organization[]>("/orgs", {
        method: "GET",
        requireAuth: true,
      });
      spinner.stop("Organizations fetched");

      if (orgs.length === 0) {
        clack.cancel(
          "You don't have any organizations. Create one with 'agentpkg orgs create'",
        );
        process.exit(1);
      }

      // Prompt for organization
      const selectedOrg = await clack.select({
        message: "Select organization:",
        options: orgs.map((o) => ({
          value: o.name,
          label: `@${o.name}`,
        })),
      });

      if (clack.isCancel(selectedOrg)) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }

      org = selectedOrg as string;

      // Prompt for skill name
      const skillName = await clack.text({
        message: "Skill name:",
        placeholder: "my-awesome-skill",
        validate: validateAgentName, // Can reuse validation
      });

      if (clack.isCancel(skillName)) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }

      name = skillName as string;

      // Prompt for access level
      const accessLevel = await clack.select({
        message: "New access level:",
        options: [
          { value: "private", label: "Private (org members only)" },
          { value: "public", label: "Public (anyone can view)" },
        ],
      });

      if (clack.isCancel(accessLevel)) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }

      access = (accessLevel as string).toUpperCase() as 'PRIVATE' | 'PUBLIC';

      // Confirm update
      const confirm = await clack.confirm({
        message: `Update @${org}/${name} access to ${access.toLowerCase()}?`,
      });

      if (clack.isCancel(confirm) || !confirm) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }
    }

    // Update access via API
    const updateSpinner = clack.spinner();
    updateSpinner.start("Updating access...");

    await apiRequest(`/skills/@${org}/${name}/access`, {
      method: "PATCH",
      body: {
        access,
      },
      requireAuth: true,
    });

    updateSpinner.stop("Access updated successfully");

    clack.outro(`✓ Updated @${org}/${name} access to ${access.toLowerCase()}`);
  } catch (error) {
    clack.cancel(formatError(error));
    process.exit(1);
  }
}
