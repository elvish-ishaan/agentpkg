import * as clack from "@clack/prompts";
import { existsSync } from "node:fs";
import { AGENT_FILENAME } from "../config/paths.js";
import { writeAgentFile } from "../utils/file.js";
import { formatError } from "../utils/errors.js";

const AGENT_TEMPLATE = `---
name: my-agent
version: 1.0.0
description: A helpful AI agent
---

# Agent Instructions

You are a helpful AI agent. Describe what this agent does and how it should behave.

## Guidelines

- Be helpful and polite
- Follow user instructions carefully
- Ask for clarification when needed

## Example Usage

\`\`\`
User: Help me with...
Agent: I'll help you with that...
\`\`\`
`;

export async function init() {
  try {
    // Check if agent.agent.md already exists
    if (existsSync(AGENT_FILENAME)) {
      const overwrite = await clack.confirm({
        message: `${AGENT_FILENAME} already exists. Overwrite?`,
      });

      if (clack.isCancel(overwrite) || !overwrite) {
        clack.cancel("Operation cancelled");
        process.exit(0);
      }
    }

    // Write template
    writeAgentFile(AGENT_FILENAME, AGENT_TEMPLATE);

    clack.outro(`✓ Created ${AGENT_FILENAME}`);
  } catch (error) {
    clack.cancel(formatError(error));
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.main) {
  await init();
}
