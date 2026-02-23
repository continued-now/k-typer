"use client"

import * as React from "react"
import { AppNav } from "@/components/layout/AppNav"
import { TestConfigPanel, type TestConfig } from "@/components/features/typing/TestConfig"
import { WordTest } from "@/components/features/typing/WordTest"

export default function PracticePage() {
  const [activeTest, setActiveTest] = React.useState<TestConfig | null>(null);

  const handleStart = (config: TestConfig) => {
    setActiveTest(config);
  };

  const handleFinish = () => {
    setActiveTest(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!activeTest ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">타이핑 연습</h1>
              <p className="text-muted-foreground">
                연습할 콘텐츠와 모드를 선택하세요
              </p>
            </div>
            <TestConfigPanel onStart={handleStart} />
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
