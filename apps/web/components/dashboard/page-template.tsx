import { ReactNode } from 'react'

interface PageTemplateProps {
  title: string
  description: string
  actions?: ReactNode
  children: ReactNode
}

export function PageTemplate({
  title,
  description,
  actions,
  children,
}: PageTemplateProps) {
  return (
    <div className="min-h-screen w-full relative">
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: 'var(--font-della-respira)' }}
            >
              {title}
            </h1>
            <p className="text-lg text-gray-400 font-body font-light mt-2">
              {description}
            </p>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  )
}
