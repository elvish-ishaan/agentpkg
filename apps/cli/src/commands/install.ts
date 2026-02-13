import * as clack from "@clack/prompts";
import { join } from "node:path";
import { apiRequest } from "../api/client.js";
import { INSTALL_DIR } from "../config/paths.js";
import { formatError } from "../utils/errors.js";
import { downloadFile } from "../utils/download.js";
import { writeAgentFile } from "../utils/file.js";
import { verifyChecksum } from "../utils/checksum.js";
import type { Agent } from "../types/api.js";

/**
 * Parse agent specifier: @org/name or @org/name@version
 */
function parseAgentSpec(spec: string): {
  org: string;
  name: string;
  version?: string;
} {
  if (!spec.startsWith("@")) {
    throw new Error("Agent spec must start with @ (e.g., @org/agent)");
  }

  // Remove leading @
  spec = spec.substring(1);

  // Split by /
  const parts = spec.split("/");
  if (parts.length !== 2) {
    throw new Error(
      "Invalid agent spec format. Use @org/name or @org/name@version",
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

export async function install() {
  try {
    // Get agent spec from arguments
    const spec = process.argv[3];

    if (!spec) {
      clack.cancel(
        "Please specify an agent to install (e.g., agentpkg install @org/agent)",
      );
      process.exit(1);
    }

    // Parse spec
    const { org, name, version } = parseAgentSpec(spec);

    clack.intro(
      `Install @${org}/${name}${version ? `@${version}` : " (latest)"}`,
    );

    // Fetch agent info
    const spinner = clack.spinner();
    spinner.start("Fetching agent info...");

    const endpoint = version
      ? `/agents/@${org}/${name}/${version}`
      : `/agents/@${org}/${name}`;

    const agent = await apiRequest<Agent>(endpoint, {
      method: "GET",
      requireAuth: false,
    });

    spinner.stop("Agent info fetched");

    // Download agent content
    spinner.start("Downloading...");
    const content = await downloadFile(agent.downloadUrl);
    spinner.stop("Downloaded");

    // Verify checksum
    spinner.start("Verifying checksum...");
    const checksumValid = verifyChecksum(content, agent.checksum);

    if (!checksumValid) {
      spinner.stop("Checksum verification failed");
      clack.cancel(
        "Checksum verification failed. The downloaded file may be corrupted.",
      );
      process.exit(1);
    }

    spinner.stop("Checksum verified");

    // Write to .github/agents/
    const installPath = join(INSTALL_DIR, `${name}.agent.md`);
    writeAgentFile(installPath, content);

    clack.outro(
      `✓ Installed @${org}/${name}@${agent.version}\n   Location: ${installPath}`,
    );
  } catch (error) {
    clack.cancel(formatError(error));
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.main) {
  await install();
}
