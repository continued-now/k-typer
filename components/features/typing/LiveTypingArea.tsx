"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useSettingsStore } from "@/store"

interface LiveTypingAreaProps {
  targetText: string;
  userInput: string;
  isActive: boolean;
  className?: string;
}

export function LiveTypingArea({ targetText, userInput, isActive, className }: LiveTypingAreaProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cursorRef = React.useRef<HTMLSpanElement>(null);
  const fontSize = useSettingsStore(s => s.fontSize);

  // Scroll to keep cursor visible
  React.useEffect(() => {
    if (cursorRef.current && containerRef.current) {
      const container = containerRef.current;
      const cursor = cursorRef.current;
      const cursorRect = cursor.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (cursorRect.bottom > containerRect.bottom - 20 || cursorRect.top < containerRect.top + 20) {
        cursor.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [userInput]);

  // Find current word boundaries for underline
  const currentWordStart = React.useMemo(() => {
    const pos = userInput.length;
    let start = pos;
    while (start > 0 && targetText[start - 1] !== ' ') start--;
    return start;
  }, [userInput.length, targetText]);

  const currentWordEnd = React.useMemo(() => {
    const pos = userInput.length;
    let end = pos;
    while (end < targetText.length && targetText[end] !== ' ') end++;
    return end;
  }, [userInput.length, targetText]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "font-mono leading-loose p-6 rounded-lg border bg-card min-h-[160px] max-h-[320px] overflow-y-auto select-none tracking-wide",
        isActive && "ring-2 ring-primary/30",
        !isActive && userInput.length === 0 && "cursor-pointer",
        className
      )}
      style={{ fontSize: `${fontSize}px` }}
      onClick={() => {
        // Click to focus the hidden textarea
        const textarea = document.querySelector('textarea[aria-label="타이핑 입력 영역"]') as HTMLTextAreaElement;
        textarea?.focus();
      }}
    >
      {targetText.split('').map((char, index) => {
        const isTyped = index < userInput.length;
        const isCorrect = isTyped && userInput[index] === char;
        const isWrong = isTyped && userInput[index] !== char;
        const isCursor = index === userInput.length && isActive;
        const isCurrentWord = index >= currentWordStart && index < currentWordEnd && isActive && !isTyped;

        return (
          <span
            key={index}
            ref={isCursor ? cursorRef : undefined}
            className={cn(
              "relative transition-colors duration-75",
              !isTyped && !isCursor && !isCurrentWord && "text-muted-foreground/40",
              isCurrentWord && "text-muted-foreground/60 border-b border-muted-foreground/20",
              isCorrect && "text-success",
              isWrong && "text-destructive bg-destructive/10 rounded-sm",
              isCursor && "text-foreground"
            )}
          >
            {isCursor && (
              <span className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-primary animate-pulse" />
            )}
            {char === ' ' && isWrong ? '·' : char}
          </span>
        );
      })}
      {userInput.length > targetText.length && (
        <span className="text-destructive/60 bg-destructive/10 rounded-sm">
          {userInput.slice(targetText.length)}
        </span>
      )}
    </div>
  );
}
