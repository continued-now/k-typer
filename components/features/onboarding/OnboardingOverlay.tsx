"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const ONBOARDING_KEY = "k-type-onboarded"

interface Step {
  target: string
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    target: "[data-onboard='content']",
    title: "콘텐츠 팩을 선택하세요",
    description: "다양한 난이도의 콘텐츠 중 원하는 것을 골라보세요.",
  },
  {
    target: "[data-onboard='test-type']",
    title: "테스트 유형을 고르세요",
    description: "시간제한, 단어 수, 자유 연습 등 원하는 방식을 선택하세요.",
  },
  {
    target: "[data-onboard='typing']",
    title: "타이핑을 시작하세요!",
    description: "화면을 클릭하고 타이핑을 시작하면 됩니다.",
  },
]

export function OnboardingOverlay() {
  const [step, setStep] = React.useState(0)
  const [visible, setVisible] = React.useState(false)
  const [dontShowAgain, setDontShowAgain] = React.useState(false)

  React.useEffect(() => {
    const onboarded = localStorage.getItem(ONBOARDING_KEY)
    if (!onboarded) {
      setVisible(true)
    }
  }, [])

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      handleDismiss()
    }
  }

  const handleDismiss = () => {
    setVisible(false)
    if (dontShowAgain) {
      localStorage.setItem(ONBOARDING_KEY, "true")
    }
  }

  const handleSkip = () => {
    setVisible(false)
    localStorage.setItem(ONBOARDING_KEY, "true")
  }

  if (!visible) return null

  const currentStep = STEPS[step]

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-card border rounded-xl shadow-xl max-w-sm w-full p-6 relative">
        <button
          onClick={handleSkip}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center gap-1.5 mb-4">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  i === step ? "bg-primary" : i < step ? "bg-primary/40" : "bg-muted-foreground/20"
                }`}
              />
            ))}
          </div>
          <h3 className="text-lg font-bold mb-2">{currentStep.title}</h3>
          <p className="text-sm text-muted-foreground">{currentStep.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded accent-primary"
            />
            다시 보지 않기
          </label>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(s => s - 1)}>
                이전
              </Button>
            )}
            <Button size="sm" onClick={handleNext}>
              {step < STEPS.length - 1 ? "다음" : "시작하기"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
