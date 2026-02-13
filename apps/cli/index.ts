#!/usr/bin/env bun

import { showHelp } from "./src/utils/help.js";

// Get command from arguments
const args = process.argv.slice(2);
const command = args[0];

// Handle version flag
if (command === "--version" || command === "-v") {
  console.log("agentpkg v0.1.0");
  process.exit(0);
}

// Handle help flag or no command
if (command === "--help" || command === "-h" || !command) {
  showHelp();
  process.exit(0);
}

// Route to command handler
try {
  switch (command) {
    case "login":
      await import("./src/commands/login.js").then((m) => m.login());
      break;

    case "register":
      await import("./src/commands/register.js").then((m) => m.register());
      break;

    case "logout":
      await import("./src/commands/logout.js").then((m) => m.logout());
      break;

    case "whoami":
      await import("./src/commands/whoami.js").then((m) => m.whoami());
      break;

    case "init":
      await import("./src/commands/init.js").then((m) => m.init());
      break;

    case "publish":
      await import("./src/commands/publish.js").then((m) => m.publish());
      break;

    case "install":
      await import("./src/commands/install.js").then((m) => m.install());
      break;

    case "list":
      await import("./src/commands/list.js").then((m) => m.list());
      break;

    case "orgs":
      await import("./src/commands/orgs.js").then((m) => m.orgs());
      break;

    default:
      console.error(`Unknown command: ${command}\n`);
      showHelp();
      process.exit(1);
  }
} catch (error) {
  console.error("Fatal error:", error);
  process.exit(1);
}
