'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CodeBlockProps {
  code: string
  language?: string
  showLineNumbers?: boolean
}

export function CodeBlock({ code, language = 'bash', showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <div className="bg-black/40 rounded-lg border border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-gray-800">
          <span className="text-xs text-gray-400 font-mono">{language}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                <span className="text-xs">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                <span className="text-xs">Copy</span>
              </>
            )}
          </Button>
        </div>
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm font-mono">
            <code className={language === 'bash' ? 'text-green-400' : 'text-gray-300'}>
              {code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}
