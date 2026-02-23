"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface LiveTypingAreaProps {
  targetText: string;
  userInput: string;
  isActive: boolean;
  className?: string;
}

export function LiveTypingArea({ targetText, userInput, isActive, className }: LiveTypingAreaProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn(
        "font-mono text-xl leading-loose p-6 rounded-lg border bg-card min-h-[160px] select-none tracking-wide",
        isActive && "ring-2 ring-primary/30",
        className
      )}
    >
      {targetText.split('').map((char, index) => {
        const isTyped = index < userInput.length;
        const isCorrect = isTyped && userInput[index] === char;
        const isWrong = isTyped && userInput[index] !== char;
        const isCursor = index === userInput.length && isActive;

        return (
          <span
            key={index}
            className={cn(
              "relative transition-colors duration-75",
              !isTyped && !isCursor && "text-muted-foreground/40",
              isCorrect && "text-emerald-600 dark:text-emerald-400",
              isWrong && "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-sm",
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
        <span className="text-red-400 bg-red-50 dark:bg-red-950/30 rounded-sm">
          {userInput.slice(targetText.length)}
        </span>
      )}
    </div>
  );
}
