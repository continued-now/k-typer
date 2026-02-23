import * as React from "react"
import { DiffPart } from "@/types"
import { cn } from "@/lib/utils"

interface DiffViewerProps {
    diffs: DiffPart[];
    className?: string;
}

export function DiffViewer({ diffs, className }: DiffViewerProps) {
    return (
        <div className={cn("font-mono text-lg leading-relaxed break-keep", className)}>
            {diffs.map((part, index) => {
                if (part.type === 'equal') {
                    return <span key={index} className="text-foreground/80">{part.value}</span>;
                }

                if (part.type === 'insert') {
                    return (
                        <span key={index} className="bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 line-through decoration-red-500 mx-0.5 px-0.5 rounded">
                            {part.value}
                        </span>
                    );
                }

                if (part.type === 'delete') {
                    return (
                        <span key={index} className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 mx-0.5 px-0.5 rounded">
                            {part.value}
                        </span>
                    );
                }

                if (part.type === 'substitute') {
                    return (
                        <span key={index} className="relative group mx-0.5">
                            <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-0.5 rounded cursor-help">
                                {part.value}
                            </span>
                            {part.original && (
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    정답: {part.original}
                                </span>
                            )}
                        </span>
                    );
                }

                return null;
            })}
        </div>
    );
}
