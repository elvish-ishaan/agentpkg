import * as clack from "@clack/prompts";

/**
 * Add command router - dispatches to add-agent or add-skill
 */
export async function add() {
  const subcommand = process.argv[3];

  if (!subcommand) {
    clack.cancel("Please specify what to add: agent or skill");
    process.exit(1);
  }

  switch (subcommand) {
    case "agent":
      await import("./add-agent.js").then((m) => m.addAgent());
      break;
    case "skill":
      await import("./add-skill.js").then((m) => m.addSkill());
      break;
    default:
      clack.cancel(`Unknown subcommand: ${subcommand}. Use 'agent' or 'skill'`);
      process.exit(1);
  }
}

// Run if executed directly
if (import.meta.main) {
  await add();
}
