'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface NavItem {
  id: string
  title: string
  children?: NavItem[]
}

interface DocSidebarProps {
  sections: NavItem[]
}

export function DocSidebar({ sections }: DocSidebarProps) {
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -80% 0px' }
    )

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)

      section.children?.forEach((child) => {
        const childElement = document.getElementById(child.id)
        if (childElement) observer.observe(childElement)
      })
    })

    return () => observer.disconnect()
  }, [sections])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <aside className="hidden lg:block sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pb-10">
      <nav className="space-y-1 pr-4">
        <p className="text-sm font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-actor)' }}>
          On this page
        </p>
        {sections.map((section) => (
          <div key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className={`
                w-full text-left text-sm py-2 px-3 rounded-lg transition-all
                ${activeSection === section.id
                  ? 'text-white bg-white/10 border-l-2 border-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
              style={{ fontFamily: 'var(--font-merriweather)' }}
            >
              {section.title}
            </button>
            {section.children && (
              <div className="ml-4 mt-1 space-y-1">
                {section.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => scrollToSection(child.id)}
                    className={`
                      w-full text-left text-xs py-1.5 px-3 rounded-lg transition-all flex items-center
                      ${activeSection === child.id
                        ? 'text-white bg-white/5'
                        : 'text-gray-500 hover:text-gray-300'
                      }
                    `}
                    style={{ fontFamily: 'var(--font-merriweather)' }}
                  >
                    <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0" />
                    {child.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
