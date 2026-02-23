"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ShortcutHintProps {
  className?: string
}

export function ShortcutHint({ className }: ShortcutHintProps) {
  const [visible, setVisible] = React.useState(true)
  const [hovered, setHovered] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(null)

  React.useEffect(() => {
    timerRef.current = setTimeout(() => setVisible(false), 5000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const show = visible || hovered

  return (
    <div
      className={cn(
        "flex justify-center transition-opacity duration-300",
        show ? "opacity-100" : "opacity-0 hover:opacity-100",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-muted/80 text-xs text-muted-foreground border">
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px] font-mono">Esc</kbd>
          {" "}종료
        </span>
        <span className="text-border">|</span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px] font-mono">Tab</kbd>
          {" "}다시 시작
        </span>
      </div>
    </div>
  )
}
