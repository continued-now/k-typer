"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TypingBoxProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onEnter?: () => void;
    disabled?: boolean;
}

export const TypingBox = React.forwardRef<HTMLTextAreaElement, TypingBoxProps>(
    ({ className, value, onChange, onEnter, disabled, ...props }, ref) => {
        const [isComposing, setIsComposing] = React.useState(false);

        const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!isComposing && onEnter) {
                    onEnter();
                }
            }
        };

        return (
            <textarea
                ref={ref}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                disabled={disabled}
                className={cn(
                    "w-full min-h-[120px] p-4 text-lg leading-relaxed rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans",
                    className
                )}
                placeholder="여기에 내용을 입력하세요..."
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                {...props}
            />
        );
    }
);
TypingBox.displayName = "TypingBox";
