import * as clack from "@clack/prompts";
import { parseArgs } from "node:util";
import { readdirSync, existsSync, statSync } from "node:fs";
import { join, basename } from "node:path";
import { apiRequest } from "../api/client.js";
import { AGENT_FILENAME, SKILL_FILENAME, INSTALL_DIR, SKILLS_INSTALL_DIR } from "../config/paths.js";
import { formatError } from "../utils/errors.js";
import { readAgentFile, readSkillFile, formatFileSize } from "../utils/file.js";
import { calculateChecksum } from "../utils/checksum.js";
import {
  validateAgentName,
  validateSemver,
  validateOrgName,
} from "../utils/validation.js";
import type { Organization, Agent, SkillVersion } from "../types/api.js";

export async function publish() {
  const subcommand = process.argv[3];

  if (!subcommand || subcommand.startsWith("--")) {
    clack.cancel("Please specify what to publish: agent or skill");
    process.exit(1);
  }

  switch (subcommand) {
    case "agent":
      await publishAgent();
      break;
    case "skill":
      await publishSkill();
      break;
    default:
      clack.cancel(`Unknown subcommand: ${subcommand}. Use 'agent' or 'skill'`);
      process.exit(1);
  }
}

async function publishAgent() {
  try {
    // Parse command-line arguments
    const { values } = parseArgs({
      args: process.argv.slice(4), // Skip node, script, command, subcommand
      options: {
        org: { type: "string" },
        name: { type: "string" },
        version: { type: "string" },
        description: { type: "string" },
        yes: { type: "boolean" },
        file: { type: "string" },
        access: { type: "string" },
      },
      allowPositionals: false,
    });

    const nonInteractive = values.yes || false;

    // Validate access flag if provided
    if (values.access && !['private', 'public'].includes(values.access.toLowerCase())) {
      clack.cancel("Invalid --access. Use 'private' or 'public'");
      process.exit(1);
    }

    // Find agent files in .github/agents/
    if (!existsSync(INSTALL_DIR)) {
      clack.cancel(
        `No ${INSTALL_DIR} directory found. Run 'agentpkg add agent' to add an agent first.`
      );
      process.exit(1);
    }

    const files = readdirSync(INSTALL_DIR).filter(
      (file) => file.endsWith(".agent.md")
    );

    if (files.length === 0) {
      clack.cancel(
        `No agent files found in ${INSTALL_DIR}. Run 'agentpkg add agent' to add an agent first.`
      );
      process.exit(1);
    }

    let selectedFile: string;

    if (values.file) {
      // File specified via --file flag
      selectedFile = values.file;
      if (!files.includes(basename(selectedFile))) {
        clack.cancel(`File ${selectedFile} not found in ${INSTALL_DIR}`);
        process.exit(1);
      }
    } else if (files.length === 1) {
      // Only one agent file, use it automatically
      selectedFile = files[0];
    } else if (nonInteractive) {
      // Multiple files in non-interactive mode requires --file flag
      clack.cancel(
        `Multiple agent files found. Use --file flag to specify which one to publish:\n${files.map((f) => `  - ${f}`).join("\n")}`
      );
      process.exit(1);
    } else {
      // Multiple files in interactive mode - prompt user to select
      const selected = await clack.select({
        message: "Select agent to publish:",
        options: files.map((file) => ({
          value: file,
          label: file,
        })),
      });

      if (clack.isCancel(selected)) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }

      selectedFile = selected as string;
    }

    // Read the selected agent file
    const agentPath = join(INSTALL_DIR, selectedFile);
    const spinner = clack.spinner();
    spinner.start(`Reading ${selectedFile}...`);
    const content = readAgentFile(agentPath);
    const fileSize = Buffer.byteLength(content, "utf-8");
    spinner.stop(`Read ${selectedFile} (${formatFileSize(fileSize)})`);

    let org: string;
    let name: string;
    let version: string;
    let description: string | undefined;
    let access: 'PRIVATE' | 'PUBLIC' = 'PRIVATE';

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
      access = values.access ? values.access.toUpperCase() as 'PRIVATE' | 'PUBLIC' : 'PRIVATE';

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

      // Prompt for access level
      const accessLevel = await clack.select({
        message: "Access level:",
        options: [
          { value: "private", label: "Private (org members only)" },
          { value: "public", label: "Public (anyone can view)" },
        ],
        initialValue: "private",
      });

      if (clack.isCancel(accessLevel)) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }

      access = (accessLevel as string).toUpperCase() as 'PRIVATE' | 'PUBLIC';
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
        access,
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

async function publishSkill() {
  try {
    // Parse command-line arguments
    const { values } = parseArgs({
      args: process.argv.slice(4), // Skip node, script, command, subcommand
      options: {
        org: { type: "string" },
        name: { type: "string" },
        version: { type: "string" },
        description: { type: "string" },
        yes: { type: "boolean" },
        dir: { type: "string" },
        access: { type: "string" },
      },
      allowPositionals: false,
    });

    const nonInteractive = values.yes || false;

    // Validate access flag if provided
    if (values.access && !['private', 'public'].includes(values.access.toLowerCase())) {
      clack.cancel("Invalid --access. Use 'private' or 'public'");
      process.exit(1);
    }

    // Find skill directories in .github/skills/
    if (!existsSync(SKILLS_INSTALL_DIR)) {
      clack.cancel(
        `No ${SKILLS_INSTALL_DIR} directory found. Run 'agentpkg add skill' to add a skill first.`
      );
      process.exit(1);
    }

    // Get all directories in .github/skills/ that contain SKILL.md
    const skillDirs = readdirSync(SKILLS_INSTALL_DIR)
      .filter((item) => {
        const itemPath = join(SKILLS_INSTALL_DIR, item);
        const skillFilePath = join(itemPath, SKILL_FILENAME);
        return statSync(itemPath).isDirectory() && existsSync(skillFilePath);
      });

    if (skillDirs.length === 0) {
      clack.cancel(
        `No skill directories with ${SKILL_FILENAME} found in ${SKILLS_INSTALL_DIR}. Run 'agentpkg add skill' to add a skill first.`
      );
      process.exit(1);
    }

    let selectedDir: string;

    if (values.dir) {
      // Directory specified via --dir flag
      selectedDir = basename(values.dir);
      if (!skillDirs.includes(selectedDir)) {
        clack.cancel(`Skill directory ${selectedDir} not found in ${SKILLS_INSTALL_DIR}`);
        process.exit(1);
      }
    } else if (skillDirs.length === 1) {
      // Only one skill directory, use it automatically
      selectedDir = skillDirs[0];
    } else if (nonInteractive) {
      // Multiple directories in non-interactive mode requires --dir flag
      clack.cancel(
        `Multiple skill directories found. Use --dir flag to specify which one to publish:\n${skillDirs.map((d) => `  - ${d}`).join("\n")}`
      );
      process.exit(1);
    } else {
      // Multiple directories in interactive mode - prompt user to select
      const selected = await clack.select({
        message: "Select skill to publish:",
        options: skillDirs.map((dir) => ({
          value: dir,
          label: dir,
        })),
      });

      if (clack.isCancel(selected)) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }

      selectedDir = selected as string;
    }

    // Read the selected skill file
    const skillPath = join(SKILLS_INSTALL_DIR, selectedDir);
    const spinner = clack.spinner();
    spinner.start(`Reading ${selectedDir}/${SKILL_FILENAME}...`);
    const content = readSkillFile(skillPath);
    const fileSize = Buffer.byteLength(content, "utf-8");
    spinner.stop(`Read ${selectedDir}/${SKILL_FILENAME} (${formatFileSize(fileSize)})`);

    let org: string;
    let name: string;
    let version: string;
    let description: string | undefined;
    let access: 'PRIVATE' | 'PUBLIC' = 'PRIVATE';

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
      access = values.access ? values.access.toUpperCase() as 'PRIVATE' | 'PUBLIC' : 'PRIVATE';

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

      const versionError = validateSemver(version);
      if (versionError) {
        clack.cancel(versionError);
        process.exit(1);
      }
    } else {
      // Interactive mode
      clack.intro("Publish Skill");

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

      // Prompt for skill name
      const skillName = await clack.text({
        message: "Skill name:",
        placeholder: "my-awesome-skill",
        validate: validateAgentName, // Can reuse agent name validation
      });

      if (clack.isCancel(skillName)) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }

      name = skillName as string;

      // Prompt for version
      const skillVersion = await clack.text({
        message: "Version:",
        placeholder: "1.0.0",
        validate: validateSemver,
      });

      if (clack.isCancel(skillVersion)) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }

      version = skillVersion as string;

      // Prompt for description (optional)
      const skillDescription = await clack.text({
        message: "Description (optional):",
        placeholder: "A helpful skill",
      });

      if (clack.isCancel(skillDescription)) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }

      description =
        skillDescription && skillDescription.length > 0
          ? (skillDescription as string)
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

    const skill = await apiRequest<SkillVersion>("/skills/publish", {
      method: "POST",
      body: {
        org,
        name,
        version,
        content,
        description,
        checksum,
        access,
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
