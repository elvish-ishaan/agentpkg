import Link from 'next/link'
import { Package, Github } from 'lucide-react'
import { TextHoverEffect } from '@/components/ui/text-hover-effect'

const footerSections = {
  product: {
    title: 'Product',
    links: [
      { label: 'Agents', href: '/agent' },
      { label: 'Skills', href: '/skill' },
      { label: 'Organizations', href: '/org' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  developers: {
    title: 'Developers',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'CLI Reference', href: '#' },
      { label: 'API', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  },
}

export function LandingFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold">
              <Package className="h-6 w-6" />
              <span>AgentPkg</span>
            </Link>
            <p className="text-sm font-body text-muted-foreground max-w-xs">
              The modern package registry for AI agents and skills. Built for developers, by developers.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/elvish-ishaan/agentpkg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-subheading font-semibold text-sm">{footerSections.product.title}</h3>
            <ul className="space-y-3">
              {footerSections.product.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers */}
          <div className="space-y-4">
            <h3 className="font-subheading font-semibold text-sm">{footerSections.developers.title}</h3>
            <ul className="space-y-3">
              {footerSections.developers.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-subheading font-semibold text-sm">{footerSections.company.title}</h3>
            <ul className="space-y-3">
              {footerSections.company.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-subheading font-semibold text-sm">{footerSections.legal.title}</h3>
            <ul className="space-y-3">
              {footerSections.legal.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Text Hover Effect */}
        <div className="mt-16 pt-8 border-t space-y-8">
          {/* Large Text Hover Effect */}
          <div className="h-48 md:h-64 w-full flex items-center justify-center">
            <TextHoverEffect text="agentpkg" duration={0.3} />
          </div>

          {/* Copyright and Love Message */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-4">
            <p className="text-sm font-body text-muted-foreground">
              © {new Date().getFullYear()} AgentPkg. All rights reserved.
            </p>
            <p className="text-sm font-body text-muted-foreground">
              Built with ♥ for the AI community
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}
