"use client"

import * as React from "react"
import { AppNav } from "@/components/layout/AppNav"
import { Breadcrumb } from "@/components/layout/Breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { Target, ArrowRight } from "lucide-react"
import Link from "next/link"

interface AggregatedErrors {
  spacing: number;
  jamo: number;
  batchim: number;
  vowel: number;
  total: number;
  sessionCount: number;
}

const ERROR_LABELS: Record<string, { label: string; description: string; packId: string; testType: string }> = {
  spacing: { label: "띄어쓰기", description: "띄어쓰기 오류가 많습니다. 문장 연습을 추천합니다.", packId: "formal", testType: "sentence" },
  vowel: { label: "모음 혼동", description: "ㅐ/ㅔ, ㅓ/ㅗ 등 모음 구별 연습이 필요합니다.", packId: "common-100", testType: "timed" },
  batchim: { label: "받침 오류", description: "받침 입력 정확도를 높이기 위한 연습을 추천합니다.", packId: "proverbs", testType: "sentence" },
  jamo: { label: "자모 오류", description: "초성/중성/종성 구별 연습이 필요합니다.", packId: "common-100", testType: "word-count" },
};

export default function DrillsPage() {
  const [errors, setErrors] = React.useState<AggregatedErrors | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadErrors();
  }, []);

  const loadErrors = async () => {
    try {
      const sessions = await db.getSessions(50);
      if (sessions.length === 0) {
        setLoading(false);
        return;
      }

      const aggregated: AggregatedErrors = {
        spacing: 0,
        jamo: 0,
        batchim: 0,
        vowel: 0,
        total: 0,
        sessionCount: sessions.length,
      };

      sessions.forEach(session => {
        if (session.errors) {
          aggregated.spacing += session.errors.spacing;
          aggregated.jamo += session.errors.jamo;
          aggregated.batchim += session.errors.batchim;
          aggregated.vowel += session.errors.vowel;
          aggregated.total += session.errors.total;
        }
      });

      setErrors(aggregated);
    } catch (error) {
      console.error('Failed to load errors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopErrors = () => {
    if (!errors) return [];
    const errorTypes = [
      { key: 'spacing', count: errors.spacing },
      { key: 'vowel', count: errors.vowel },
      { key: 'batchim', count: errors.batchim },
      { key: 'jamo', count: errors.jamo },
    ];
    return errorTypes.sort((a, b) => b.count - a.count).filter(e => e.count > 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumb />
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">맞춤 드릴</h1>
          <p className="text-muted-foreground">
            오류 패턴을 분석하여 맞춤형 연습을 추천합니다
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : !errors || errors.sessionCount === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                아직 연습 기록이 없어요. 먼저 타이핑 연습을 해보세요!
              </p>
              <Link href="/practice">
                <Button>연습 시작하기</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">오류 분석 요약</CardTitle>
                <CardDescription>최근 {errors.sessionCount}회 세션 기준</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(ERROR_LABELS).map(([key, { label }]) => {
                    const count = errors[key as keyof AggregatedErrors] as number;
                    return (
                      <div key={key} className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold">{count}</div>
                        <div className="text-xs text-muted-foreground">{label}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Drills */}
            <div>
              <h2 className="text-xl font-bold mb-4">추천 연습</h2>
              <div className="space-y-3">
                {getTopErrors().map(({ key, count }) => {
                  const info = ERROR_LABELS[key];
                  return (
                    <Card key={key}>
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{info.label} 집중 훈련</h3>
                              <Badge variant="secondary">{count}회 오류</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{info.description}</p>
                          </div>
                          <Link href={`/practice?pack=${info.packId}&type=${info.testType}&from=drill&drill=${info.label}`}>
                            <Button size="sm" className="gap-1 ml-4">
                              연습 <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Quick Practice */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">빠른 연습</CardTitle>
                <CardDescription>자주 틀리는 유형별 집중 훈련</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Link href="/practice?pack=common-100&type=timed&duration=60">
                    <Button variant="outline" className="w-full h-auto py-4 flex-col gap-1">
                      <span className="font-semibold">자주 쓰는 단어 100</span>
                      <span className="text-xs text-muted-foreground">기본 단어 익히기</span>
                    </Button>
                  </Link>
                  <Link href="/practice?pack=proverbs&type=sentence">
                    <Button variant="outline" className="w-full h-auto py-4 flex-col gap-1">
                      <span className="font-semibold">속담 타이핑</span>
                      <span className="text-xs text-muted-foreground">받침/모음 집중 연습</span>
                    </Button>
                  </Link>
                  <Link href="/practice?pack=tongue-twisters&type=timed&duration=60">
                    <Button variant="outline" className="w-full h-auto py-4 flex-col gap-1">
                      <span className="font-semibold">잰말 놀이</span>
                      <span className="text-xs text-muted-foreground">속도와 정확도 동시 훈련</span>
                    </Button>
                  </Link>
                  <Link href="/practice?pack=news&type=sentence">
                    <Button variant="outline" className="w-full h-auto py-4 flex-col gap-1">
                      <span className="font-semibold">뉴스 기사</span>
                      <span className="text-xs text-muted-foreground">고급 문장 연습</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
