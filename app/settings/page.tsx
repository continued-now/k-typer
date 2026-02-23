"use client"

import * as React from "react"
import { AppNav } from "@/components/layout/AppNav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSettingsStore } from "@/store"
import { useToast } from "@/components/ui/toast"
import { db } from "@/lib/db"
import { Sun, Moon, Monitor, Volume2 } from "lucide-react"

export default function SettingsPage() {
  const { theme, setTheme, ttsRate, setTTSRate, keyboardGuide, setKeyboardGuide } = useSettingsStore();
  const { addToast } = useToast();
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  // Apply theme to document
  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = '';
    }
  }, [theme]);

  const handleResetData = async () => {
    try {
      const database = await import('@/lib/db').then(m => m.getDB());
      const tx = database.transaction(['sessions'], 'readwrite');
      await tx.objectStore('sessions').clear();
      await tx.done;
      setShowResetConfirm(false);
      addToast({ type: 'success', title: '초기화 완료', description: '모든 연습 기록이 삭제되었습니다' });
    } catch (error) {
      console.error('Failed to reset data:', error);
      addToast({ type: 'error', title: '오류', description: '데이터 초기화에 실패했습니다' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">설정</h1>
          <p className="text-muted-foreground">앱 환경을 맞춤 설정하세요</p>
        </div>

        <div className="space-y-6">
          {/* Theme */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">테마</CardTitle>
              <CardDescription>앱의 외관을 선택하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {([
                  { value: 'light' as const, icon: Sun, label: '라이트' },
                  { value: 'dark' as const, icon: Moon, label: '다크' },
                  { value: 'system' as const, icon: Monitor, label: '시스템' },
                ]).map(({ value, icon: Icon, label }) => (
                  <Button
                    key={value}
                    variant={theme === value ? 'default' : 'outline'}
                    onClick={() => setTheme(value)}
                    className="flex-1 gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* TTS Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">음성 속도</CardTitle>
              <CardDescription>받아쓰기 TTS 재생 속도를 조절하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Volume2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={ttsRate}
                  onChange={(e) => setTTSRate(parseFloat(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="text-sm font-medium w-12 text-right tabular-nums">{ttsRate.toFixed(1)}x</span>
              </div>
            </CardContent>
          </Card>

          {/* Font Size */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">키보드 가이드</CardTitle>
              <CardDescription>연습 중 키보드 레이아웃 표시 여부</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant={keyboardGuide ? 'default' : 'outline'}
                  onClick={() => setKeyboardGuide(true)}
                  className="flex-1"
                >
                  켜기
                </Button>
                <Button
                  variant={!keyboardGuide ? 'default' : 'outline'}
                  onClick={() => setKeyboardGuide(false)}
                  className="flex-1"
                >
                  끄기
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reset Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">데이터 관리</CardTitle>
              <CardDescription>연습 기록 및 데이터를 관리하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!showResetConfirm ? (
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30"
                  onClick={() => setShowResetConfirm(true)}
                >
                  모든 데이터 초기화
                </Button>
              ) : (
                <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-950/20 space-y-3">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    모든 연습 기록이 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1"
                    >
                      취소
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleResetData}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      삭제 확인
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
