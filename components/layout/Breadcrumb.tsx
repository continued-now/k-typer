"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

const ROUTE_LABELS: Record<string, string> = {
  "/": "홈",
  "/practice": "연습",
  "/results": "통계",
  "/drills": "드릴",
  "/settings": "설정",
}

export function Breadcrumb() {
  const pathname = usePathname()

  if (pathname === "/") return null

  const segments = pathname.split("/").filter(Boolean)
  const crumbs = [
    { href: "/", label: "홈" },
    ...segments.map((_, i) => {
      const href = "/" + segments.slice(0, i + 1).join("/")
      return { href, label: ROUTE_LABELS[href] || segments[i] }
    }),
  ]

  return (
    <nav aria-label="경로" className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3 flex-shrink-0" />}
          {i === crumbs.length - 1 ? (
            <span className="text-foreground font-medium truncate max-w-[120px] sm:max-w-none">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="hover:text-foreground transition-colors hidden sm:inline"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
