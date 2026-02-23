"use client"

import * as React from "react"
import { AppNav } from "@/components/layout/AppNav"
import { Breadcrumb } from "@/components/layout/Breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSettingsStore } from "@/store"
import { useToast } from "@/components/ui/toast"
import { db } from "@/lib/db"
import { Sun, Moon, Monitor, Volume2, Type, Download, Volume, VolumeX } from "lucide-react"

export default function SettingsPage() {
  const {
    theme, setTheme,
    ttsRate, setTTSRate,
    voiceURI, setVoiceURI,
    keyboardGuide, setKeyboardGuide,
    fontSize, setFontSize,
    soundEnabled, setSoundEnabled,
  } = useSettingsStore();
  const { addToast } = useToast();
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);

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

  // Load available voices
  React.useEffect(() => {
    const loadVoices = () => {
      const available = speechSynthesis.getVoices().filter(v => v.lang.startsWith('ko'));
      setVoices(available);
    };
    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const handlePreviewVoice = () => {
    const utterance = new SpeechSynthesisUtterance("안녕하세요, K-Type Coach입니다.");
    utterance.lang = 'ko-KR';
    utterance.rate = ttsRate;
    if (voiceURI) {
      const voice = voices.find(v => v.voiceURI === voiceURI);
      if (voice) utterance.voice = voice;
    }
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

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

  const handleExportData = async () => {
    try {
      const sessions = await db.getAllSessions();
      const exportData = {
        exportDate: new Date().toISOString(),
        totalSessions: sessions.length,
        dateRange: sessions.length > 0
          ? {
              from: new Date(sessions[sessions.length - 1].createdAt).toISOString(),
              to: new Date(sessions[0].createdAt).toISOString(),
            }
          : null,
        sessions,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `k-type-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      addToast({ type: 'success', title: '내보내기 완료', description: `${sessions.length}개 세션이 저장되었습니다` });
    } catch (error) {
      console.error('Failed to export data:', error);
      addToast({ type: 'error', title: '오류', description: '데이터 내보내기에 실패했습니다' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Breadcrumb />
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

          {/* Font Size */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">글꼴 크기</CardTitle>
              <CardDescription>타이핑 영역의 글꼴 크기를 조절하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Type className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <input
                  type="range"
                  min="14"
                  max="24"
                  step="1"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="flex-1 accent-primary"
                  aria-label="글꼴 크기"
                />
                <span className="text-sm font-medium w-12 text-right tabular-nums">{fontSize}px</span>
              </div>
              <p className="mt-2 text-sm font-mono" style={{ fontSize: `${fontSize}px` }}>
                가나다라마바사
              </p>
            </CardContent>
          </Card>

          {/* Sound Effects */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">효과음</CardTitle>
              <CardDescription>타이핑 시 효과음 재생 여부</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant={soundEnabled ? 'default' : 'outline'}
                  onClick={() => setSoundEnabled(true)}
                  className="flex-1 gap-2"
                >
                  <Volume className="h-4 w-4" />
                  켜기
                </Button>
                <Button
                  variant={!soundEnabled ? 'default' : 'outline'}
                  onClick={() => setSoundEnabled(false)}
                  className="flex-1 gap-2"
                >
                  <VolumeX className="h-4 w-4" />
                  끄기
                </Button>
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
                  aria-label="음성 속도"
                />
                <span className="text-sm font-medium w-12 text-right tabular-nums">{ttsRate.toFixed(1)}x</span>
              </div>
            </CardContent>
          </Card>

          {/* TTS Voice Picker */}
          {voices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">음성 선택</CardTitle>
                <CardDescription>한국어 TTS 음성을 선택하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <select
                  value={voiceURI || ''}
                  onChange={(e) => setVoiceURI(e.target.value)}
                  className="w-full p-2 rounded-md border bg-background text-sm"
                  aria-label="TTS 음성 선택"
                >
                  <option value="">기본 음성</option>
                  {voices.map(v => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="sm" onClick={handlePreviewVoice}>
                  미리 듣기
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Keyboard Guide */}
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

          {/* Data Export */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">데이터 내보내기</CardTitle>
              <CardDescription>모든 연습 기록을 JSON 파일로 다운로드합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full gap-2" onClick={handleExportData}>
                <Download className="h-4 w-4" />
                데이터 내보내기
              </Button>
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
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setShowResetConfirm(true)}
                >
                  모든 데이터 초기화
                </Button>
              ) : (
                <div className="p-4 border border-destructive/30 rounded-lg bg-destructive/5 space-y-3">
                  <p className="text-sm text-destructive">
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
                      className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
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
