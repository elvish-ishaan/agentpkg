import * as clack from "@clack/prompts";
import { parseArgs } from "node:util";
import { apiRequest } from "../api/client.js";
import { AGENT_FILENAME } from "../config/paths.js";
import { formatError } from "../utils/errors.js";
import { readAgentFile, formatFileSize } from "../utils/file.js";
import { calculateChecksum } from "../utils/checksum.js";
import {
  validateAgentName,
  validateSemver,
  validateOrgName,
} from "../utils/validation.js";
import type { Organization, Agent } from "../types/api.js";

export async function publish() {
  try {
    // Parse command-line arguments
    const { values } = parseArgs({
      args: process.argv.slice(3), // Skip node, script, command
      options: {
        org: { type: "string" },
        name: { type: "string" },
        version: { type: "string" },
        description: { type: "string" },
        yes: { type: "boolean" },
      },
      allowPositionals: false,
    });

    const nonInteractive = values.yes || false;

    // Read agent file
    const spinner = clack.spinner();
    spinner.start(`Reading ${AGENT_FILENAME}...`);
    const content = readAgentFile(AGENT_FILENAME);
    const fileSize = Buffer.byteLength(content, "utf-8");
    spinner.stop(`Read ${AGENT_FILENAME} (${formatFileSize(fileSize)})`);

    let org: string;
    let name: string;
    let version: string;
    let description: string | undefined;

    if (nonInteractive) {
      // Non-interactive mode: require all flags
      if (!values.org || !values.name || !values.version) {
        clack.cancel(
          "Non-interactive mode requires --org, --name, and --version flags",
        );
        process.exit(1);
      }

      org = values.org;
      name = values.name;
      version = values.version;
      description = values.description;

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

      const versionError = validateSemver(version);
      if (versionError) {
        clack.cancel(versionError);
        process.exit(1);
      }
    } else {
      // Interactive mode
      clack.intro("Publish Agent");

      // Fetch user's organizations
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

      // Prompt for version
      const agentVersion = await clack.text({
        message: "Version:",
        placeholder: "1.0.0",
        validate: validateSemver,
      });

      if (clack.isCancel(agentVersion)) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }

      version = agentVersion as string;

      // Prompt for description (optional)
      const agentDescription = await clack.text({
        message: "Description (optional):",
        placeholder: "A helpful AI agent",
      });

      if (clack.isCancel(agentDescription)) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }

      description =
        agentDescription && agentDescription.length > 0
          ? (agentDescription as string)
          : undefined;
    }

    // Calculate checksum
    const checksum = calculateChecksum(content);

    if (!nonInteractive) {
      // Show confirmation details
      console.log("");
      console.log("  Details:");
      console.log(`  • Organization: @${org}`);
      console.log(`  • Name: ${name}`);
      console.log(`  • Version: ${version}`);
      if (description) {
        console.log(`  • Description: ${description}`);
      }
      console.log(`  • Size: ${formatFileSize(fileSize)}`);
      console.log(`  • Checksum: ${checksum.substring(0, 12)}...`);
      console.log("");

      // Confirm publish
      const confirm = await clack.confirm({
        message: `Publish @${org}/${name}@${version}?`,
      });

      if (clack.isCancel(confirm) || !confirm) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }
    }

    // Publish to API
    const publishSpinner = clack.spinner();
    publishSpinner.start("Publishing...");

    const agent = await apiRequest<Agent>("/agents/publish", {
      method: "POST",
      body: {
        org,
        name,
        version,
        content,
        description,
        checksum,
      },
      requireAuth: true,
    });

    publishSpinner.stop("Published successfully");

    clack.outro(`✓ Published @${org}/${name}@${version}`);
  } catch (error) {
    clack.cancel(formatError(error));
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.main) {
  await publish();
}
