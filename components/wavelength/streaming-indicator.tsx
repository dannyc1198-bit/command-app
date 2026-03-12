export function StreamingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00d4ff] [animation-delay:0ms]" />
      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8b5cf6] [animation-delay:150ms]" />
      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d946ef] [animation-delay:300ms]" />
    </div>
  )
}
