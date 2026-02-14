import * as clack from "@clack/prompts";
import { join } from "node:path";
import { apiRequest } from "../api/client.js";
import { SKILLS_INSTALL_DIR } from "../config/paths.js";
import { formatError } from "../utils/errors.js";
import { downloadFile } from "../utils/download.js";
import { writeSkillFile } from "../utils/file.js";
import { verifyChecksum } from "../utils/checksum.js";
import type { SkillVersion } from "../types/api.js";

/**
 * Parse skill specifier: @org/name or @org/name@version
 */
function parseSkillSpec(spec: string): {
  org: string;
  name: string;
  version?: string;
} {
  if (!spec.startsWith("@")) {
    throw new Error("Skill spec must start with @ (e.g., @org/skill)");
  }

  // Remove leading @
  spec = spec.substring(1);

  // Split by /
  const parts = spec.split("/");
  if (parts.length !== 2) {
    throw new Error(
      "Invalid skill spec format. Use @org/name or @org/name@version",
    );
  }

  const org = parts[0];
  const nameAndVersion = parts[1];

  // Check for version
  const versionIndex = nameAndVersion.indexOf("@");
  if (versionIndex !== -1) {
    const name = nameAndVersion.substring(0, versionIndex);
    const version = nameAndVersion.substring(versionIndex + 1);
    return { org, name, version };
  }

  return { org, name: nameAndVersion };
}

export async function addSkill() {
  try {
    // Get skill spec from arguments (at index 4 due to "add skill" subcommand)
    const spec = process.argv[4];

    if (!spec) {
      clack.cancel(
        "Please specify a skill to add (e.g., agentpkg add skill @org/skill)",
      );
      process.exit(1);
    }

    // Parse spec
    const { org, name, version } = parseSkillSpec(spec);

    clack.intro(
      `Install @${org}/${name}${version ? `@${version}` : " (latest)"}`,
    );

    // Fetch skill info
    const spinner = clack.spinner();
    spinner.start("Fetching skill info...");

    const endpoint = version
      ? `/skills/@${org}/${name}/${version}`
      : `/skills/@${org}/${name}`;

    const skill = await apiRequest<SkillVersion>(endpoint, {
      method: "GET",
      requireAuth: false,
    });

    spinner.stop("Skill info fetched");

    if (!skill.latestVersion) {
      throw new Error("No version available for this skill");
    }

    // Get skill content (prefer direct content, fallback to download)
    let content: string;
    if (skill.latestVersion.content) {
      // Content is included directly in the response
      content = skill.latestVersion.content;
    } else if (skill.latestVersion.downloadUrl) {
      // Download from URL
      spinner.start("Downloading...");
      content = await downloadFile(skill.latestVersion.downloadUrl);
      spinner.stop("Downloaded");
    } else {
      throw new Error("No content or download URL available");
    }

    // Verify checksum
    spinner.start("Verifying checksum...");
    const checksumValid = verifyChecksum(content, skill.latestVersion.checksum);

    if (!checksumValid) {
      spinner.stop("Checksum verification failed");
      clack.cancel(
        "Checksum verification failed. The downloaded file may be corrupted.",
      );
      process.exit(1);
    }

    spinner.stop("Checksum verified");

    // Write to .github/skills/<skill_name>/SKILL.md
    const skillDir = join(SKILLS_INSTALL_DIR, name);
    writeSkillFile(skillDir, content);

    clack.outro(
      `✓ Installed @${org}/${name}@${skill.latestVersion.version}\n   Location: ${skillDir}/SKILL.md`,
    );
  } catch (error) {
    clack.cancel(formatError(error));
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.main) {
  await addSkill();
}
