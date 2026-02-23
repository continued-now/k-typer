"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorData {
  spacing: number
  jamo: number
  batchim: number
  vowel: number
}

interface ErrorBreakdownProps {
  errors: ErrorData
  className?: string
}

const ERROR_CATEGORIES = [
  { key: "jamo" as const, label: "자모 오류", color: "bg-info" },
  { key: "batchim" as const, label: "받침 오류", color: "bg-warning" },
  { key: "vowel" as const, label: "모음 오류", color: "bg-destructive" },
  { key: "spacing" as const, label: "띄어쓰기", color: "bg-primary" },
]

export function ErrorBreakdown({ errors, className }: ErrorBreakdownProps) {
  const total = errors.spacing + errors.jamo + errors.batchim + errors.vowel
  if (total === 0) return null

  const maxCount = Math.max(errors.spacing, errors.jamo, errors.batchim, errors.vowel)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">오류 유형 분석</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ERROR_CATEGORIES.map(({ key, label, color }) => {
            const count = errors[key]
            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0

            return (
              <div key={key} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-20 flex-shrink-0">{label}</span>
                <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%`, minWidth: count > 0 ? '8px' : '0' }}
                  />
                </div>
                <span className="text-sm font-medium tabular-nums w-10 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
