"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProblemWord {
  word: string
  errorCount: number
}

interface ProblemWordsProps {
  words: ProblemWord[]
  className?: string
}

export function ProblemWords({ words, className }: ProblemWordsProps) {
  if (words.length === 0) return null

  const top10 = words.slice(0, 10)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">자주 틀리는 단어</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {top10.map((item, i) => (
            <div
              key={item.word}
              className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-5 text-right tabular-nums">
                  {i + 1}
                </span>
                <span className="font-medium text-sm">{item.word}</span>
              </div>
              <Badge variant="secondary" className="text-xs tabular-nums">
                {item.errorCount}회
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
