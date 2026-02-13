import * as clack from "@clack/prompts";
import { apiRequest } from "../api/client.js";
import { formatError } from "../utils/errors.js";
import { validateOrgName } from "../utils/validation.js";
import type { Organization } from "../types/api.js";

async function listOrgs() {
  try {
    // Fetch organizations
    const spinner = clack.spinner();
    spinner.start("Fetching organizations...");

    const orgs = await apiRequest<Organization[]>("/orgs", {
      method: "GET",
      requireAuth: true,
    });

    spinner.stop("Organizations fetched");

    if (orgs.length === 0) {
      clack.outro("You don't have any organizations yet.");
      return;
    }

    // Display organizations
    console.log("");
    console.log("  Your organizations:");
    console.log("");
    for (const org of orgs) {
      console.log(`  • @${org.name}`);
      console.log(`    Created: ${new Date(org.createdAt).toLocaleDateString()}`);
      if (org.memberCount !== undefined) {
        console.log(`    Members: ${org.memberCount}`);
      }
      console.log("");
    }
  } catch (error) {
    clack.cancel(formatError(error));
    process.exit(1);
  }
}

async function createOrg() {
  clack.intro("Create Organization");

  try {
    // Prompt for org name
    const name = await clack.text({
      message: "Organization name:",
      placeholder: "my-org",
      validate: validateOrgName,
    });

    if (clack.isCancel(name)) {
      clack.cancel("Operation cancelled");
      process.exit(0);
    }

    // Create organization
    const spinner = clack.spinner();
    spinner.start("Creating organization...");

    const org = await apiRequest<Organization>("/orgs", {
      method: "POST",
      body: { name },
      requireAuth: true,
    });

    spinner.stop("Organization created");

    clack.outro(`✓ Created organization @${org.name}`);
  } catch (error) {
    clack.cancel(formatError(error));
    process.exit(1);
  }
}

export async function orgs() {
  // Get subcommand
  const subcommand = process.argv[3];

  if (!subcommand || subcommand === "list") {
    await listOrgs();
  } else if (subcommand === "create") {
    await createOrg();
  } else {
    clack.cancel(`Unknown subcommand: ${subcommand}\n\nAvailable: list, create`);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.main) {
  await orgs();
}
