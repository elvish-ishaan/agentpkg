import { AnimatedSpan, Terminal, TypingAnimation } from "../ui/terminal";

interface TerminalDemoProps {
  className?: string;
}

export function TerminalDemo({ className }: TerminalDemoProps) {
  return (
    <Terminal className={className}>
      <TypingAnimation>&gt; agentpkg add agent @acme/code-reviewer</TypingAnimation>

      <AnimatedSpan className="text-green-500">
        ✔ Fetching agent info...
      </AnimatedSpan>

      <AnimatedSpan className="text-green-500">
        ✔ Downloading...
      </AnimatedSpan>

      <AnimatedSpan className="text-green-500">
        ✔ Checksum verified
      </AnimatedSpan>

      <AnimatedSpan className="text-muted-foreground">
        ✓ Installed @acme/code-reviewer@1.2.0
      </AnimatedSpan>

      <TypingAnimation className="mt-4">
        &gt; agentpkg publish agent --org acme --name helper --version 2.0.0
      </TypingAnimation>

      <AnimatedSpan className="text-green-500">
        ✔ Reading helper.agent.md (3.2 KB)
      </AnimatedSpan>

      <AnimatedSpan className="text-green-500">
        ✔ Publishing...
      </AnimatedSpan>

      <AnimatedSpan className="text-muted-foreground">
        ✓ Published @acme/helper@2.0.0
      </AnimatedSpan>

      <TypingAnimation className="mt-4">
        &gt; agentpkg add skill @acme/debugger
      </TypingAnimation>

      <AnimatedSpan className="text-green-500">
        ✔ Fetching skill info...
      </AnimatedSpan>

      <AnimatedSpan className="text-green-500">
        ✔ Checksum verified
      </AnimatedSpan>

      <AnimatedSpan className="text-muted-foreground">
        ✓ Installed @acme/debugger@1.0.0
      </AnimatedSpan>

      <TypingAnimation className="mt-4">
        &gt; agentpkg list @acme agents
      </TypingAnimation>

      <AnimatedSpan className="text-blue-500">
        <span>• code-reviewer@1.2.0</span>
      </AnimatedSpan>

      <AnimatedSpan className="text-blue-500">
        <span>• helper@2.0.0</span>
      </AnimatedSpan>

      <TypingAnimation className="text-muted-foreground mt-2">
        Ready to build with AI agents and skills.
      </TypingAnimation>
    </Terminal>
  )
}
