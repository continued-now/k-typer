"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Keyboard, BarChart2, Settings, Target, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/practice", label: "연습", icon: Keyboard },
  { href: "/drills", label: "드릴", icon: Target },
  { href: "/results", label: "통계", icon: BarChart2 },
  { href: "/settings", label: "설정", icon: Settings },
] as const;

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" aria-label="K-Type Coach 홈">
          <Keyboard className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg">K-Type Coach</span>
        </Link>
        <nav className="flex items-center gap-1" aria-label="주요 메뉴">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link key={href} href={href}>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={label}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "gap-1.5 relative",
                    isActive && "bg-accent text-accent-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                  {isActive && (
                    <>
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full hidden sm:block" />
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full sm:hidden" />
                    </>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
