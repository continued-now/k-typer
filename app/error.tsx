"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-2">문제가 발생했습니다</h1>
        <p className="text-muted-foreground mb-8">
          예상치 못한 오류가 발생했어요. 다시 시도해 주세요.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>다시 시도</Button>
          <Button variant="outline" asChild>
            <a href="/">홈으로</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
