'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import { Card, CardContent } from '@/components/ui/card'

interface SkillReadmeProps {
  content: string
}

export function SkillReadme({ content }: SkillReadmeProps) {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="prose prose-slate prose-invert max-w-none prose-headings:text-white prose-p:text-white prose-strong:text-white prose-code:text-white prose-a:text-white prose-li:text-white prose-ul:text-white prose-ol:text-white prose-blockquote:text-white prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
}
