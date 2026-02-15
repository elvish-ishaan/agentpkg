import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'What is AgentPkg?',
    answer: 'AgentPkg is a modern package registry specifically designed for AI agents and skills. It provides a centralized platform for developers to publish, discover, and manage AI components with features like version control, team collaboration, and security-first design.',
  },
  {
    question: 'How do I publish a package?',
    answer: 'Publishing is simple with the AgentPkg CLI. First, install the CLI tool, then use "agentpkg publish" in your package directory. The CLI will guide you through the process, handling versioning, dependencies, and security verification automatically.',
  },
  {
    question: 'Is AgentPkg free to use?',
    answer: 'Yes! AgentPkg is currently free during our beta period. We\'re building pricing plans that will be announced soon, with a free tier for individual developers and open source projects.',
  },
  {
    question: 'Can I publish private packages?',
    answer: 'Absolutely. All packages are private by default. You can choose to make them public or keep them private for your organization. We also support granular access control, allowing you to manage exactly who can view and install your packages.',
  },
  {
    question: 'How does AgentPkg ensure security?',
    answer: 'Security is our top priority. We use SHA-256 integrity verification for all packages, enforce private-by-default visibility, provide granular access controls, and regularly audit our infrastructure. Every package version is immutable and cryptographically verified.',
  },
  {
    question: 'What is the difference between agents and skills?',
    answer: 'Agents are complete AI systems that can perform tasks autonomously, while skills are specific capabilities or functions that can be added to agents. Think of skills as building blocks that agents use to accomplish their tasks.',
  },
]

export function FaqSection() {
  return (
    <section className="container px-4 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-xl font-subheading text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about AgentPkg
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border rounded-lg px-6 bg-card"
            >
              <AccordionTrigger className="text-left font-subheading text-lg hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-body text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
