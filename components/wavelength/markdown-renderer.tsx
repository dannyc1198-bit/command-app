"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import type { Components } from "react-markdown"

const components: Components = {
  pre({ children }) {
    return (
      <pre className="my-3 overflow-x-auto rounded-lg bg-black/40 p-4 text-sm">
        {children}
      </pre>
    )
  },
  code({ children, className }) {
    const isBlock = className?.includes("language-")
    if (isBlock) {
      return <code className={className}>{children}</code>
    }
    return (
      <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-[#00d4ff]">
        {children}
      </code>
    )
  },
  p({ children }) {
    return <p className="mb-3 leading-relaxed last:mb-0">{children}</p>
  },
  ul({ children }) {
    return <ul className="mb-3 ml-4 list-disc space-y-1">{children}</ul>
  },
  ol({ children }) {
    return <ol className="mb-3 ml-4 list-decimal space-y-1">{children}</ol>
  },
  h1({ children }) {
    return <h1 className="mb-3 mt-4 text-xl font-bold">{children}</h1>
  },
  h2({ children }) {
    return <h2 className="mb-2 mt-4 text-lg font-bold">{children}</h2>
  },
  h3({ children }) {
    return <h3 className="mb-2 mt-3 text-base font-semibold">{children}</h3>
  },
  blockquote({ children }) {
    return (
      <blockquote className="my-3 border-l-2 border-[#8b5cf6] pl-4 italic text-gray-400">
        {children}
      </blockquote>
    )
  },
  table({ children }) {
    return (
      <div className="my-3 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          {children}
        </table>
      </div>
    )
  },
  th({ children }) {
    return (
      <th className="border border-white/10 bg-white/5 px-3 py-2 text-left font-medium">
        {children}
      </th>
    )
  },
  td({ children }) {
    return (
      <td className="border border-white/10 px-3 py-2">{children}</td>
    )
  },
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
