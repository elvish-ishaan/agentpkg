'use client'

import { ReactNode, useState } from 'react'

interface Tab {
  label: string
  content: ReactNode
}

interface DocTabsProps {
  tabs: Tab[]
  defaultTab?: number
}

export function DocTabs({ tabs, defaultTab = 0 }: DocTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <div className="w-full">
      <div className="flex gap-2 border-b border-gray-800 mb-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`
              px-4 py-2 text-sm font-medium transition-all
              ${activeTab === index
                ? 'text-white border-b-2 border-white'
                : 'text-gray-400 hover:text-gray-300'
              }
            `}
            style={{ fontFamily: 'var(--font-actor)' }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[activeTab]?.content}</div>
    </div>
  )
}
