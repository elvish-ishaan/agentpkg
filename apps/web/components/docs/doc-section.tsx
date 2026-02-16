'use client'

import { ReactNode } from 'react'
import { motion } from 'motion/react'

interface DocSectionProps {
  id: string
  title: string
  description?: string
  children: ReactNode
  level?: 1 | 2 | 3
}

export function DocSection({ id, title, description, children, level = 2 }: DocSectionProps) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  const headingStyles = {
    1: 'text-4xl md:text-5xl font-bold mb-4',
    2: 'text-3xl md:text-4xl font-bold mb-3',
    3: 'text-2xl md:text-3xl font-bold mb-2',
  }

  return (
    <motion.section
      id={id}
      className="scroll-mt-24 mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <HeadingTag
        className={`${headingStyles[level]} text-white`}
        style={{ fontFamily: level === 1 ? 'var(--font-della-respira)' : 'var(--font-actor)' }}
      >
        {title}
      </HeadingTag>
      {description && (
        <p className="text-lg text-gray-400 mb-6 max-w-3xl" style={{ fontFamily: 'var(--font-merriweather)' }}>
          {description}
        </p>
      )}
      <div className="space-y-6" style={{ fontFamily: 'var(--font-merriweather)' }}>
        {children}
      </div>
    </motion.section>
  )
}
