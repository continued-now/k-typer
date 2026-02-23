import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-muted-foreground/30 mb-4">404</div>
        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-2">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었어요.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button>홈으로 돌아가기</Button>
          </Link>
          <Link href="/practice">
            <Button variant="outline">연습 시작하기</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
