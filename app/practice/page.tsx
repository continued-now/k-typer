"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { AppNav } from "@/components/layout/AppNav"
import { Breadcrumb } from "@/components/layout/Breadcrumb"
import { TestConfigPanel, type TestConfig } from "@/components/features/typing/TestConfig"
import { WordTest } from "@/components/features/typing/WordTest"
import { OnboardingOverlay } from "@/components/features/onboarding/OnboardingOverlay"
import { Badge } from "@/components/ui/badge"
import { Target, X } from "lucide-react"

export default function PracticePage() {
  const searchParams = useSearchParams();
  const [activeTest, setActiveTest] = React.useState<TestConfig | null>(null);
  const [drillBanner, setDrillBanner] = React.useState<string | null>(null);

  // Read query params for pre-selection
  const preselectedPack = searchParams.get("pack");
  const preselectedType = searchParams.get("type");
  const preselectedDuration = searchParams.get("duration");
  const fromDrill = searchParams.get("from") === "drill";
  const drillLabel = searchParams.get("drill");

  React.useEffect(() => {
    if (fromDrill && drillLabel) {
      setDrillBanner(drillLabel);
    }
  }, [fromDrill, drillLabel]);

  const handleStart = (config: TestConfig) => {
    setActiveTest(config);
    setDrillBanner(null);
  };

  const handleFinish = () => {
    setActiveTest(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumb />
        {!activeTest ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">타이핑 연습</h1>
              <p className="text-muted-foreground">
                연습할 콘텐츠와 모드를 선택하세요
              </p>
            </div>

            {drillBanner && (
              <div className="flex items-center gap-2 mb-4 p-3 rounded-lg border border-info/30 bg-info/5">
                <Target className="h-4 w-4 text-info flex-shrink-0" />
                <span className="text-sm flex-1">
                  드릴 추천: <strong>{drillBanner} 연습</strong>
                </span>
                <button
                  onClick={() => setDrillBanner(null)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="배너 닫기"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <TestConfigPanel
              onStart={handleStart}
              preselectedPack={preselectedPack || undefined}
              preselectedType={preselectedType || undefined}
              preselectedDuration={preselectedDuration ? parseInt(preselectedDuration) : undefined}
            />
            <OnboardingOverlay />
          </>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{activeTest.contentPack.titleKo}</h1>
                <p className="text-sm text-muted-foreground">{activeTest.contentPack.description}</p>
              </div>
            </div>
            <WordTest config={activeTest} onFinish={handleFinish} />
          </>
        )}
      </main>
    </div>
  );
}
