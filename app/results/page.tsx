"use client"

import * as React from "react"
import { AppNav } from "@/components/layout/AppNav"
import { Breadcrumb } from "@/components/layout/Breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { WpmChart } from "@/components/features/analytics/WpmChart"
import { ErrorBreakdown } from "@/components/features/analytics/ErrorBreakdown"
import { DiffViewer } from "@/components/features/dictation/DiffViewer"
import { calculateDiff } from "@/lib/hangul/diff"
import { Activity, Target, Zap, TrendingUp, Calendar, ChevronDown, ChevronUp, RotateCcw } from "lucide-react"
import Link from "next/link"
import type { Session } from "@/lib/db"
import type { DiffPart } from "@/types"
import { useSettingsStore } from "@/store"

type DateFilter = 'today' | 'week' | 'month' | 'all';
type TestTypeFilter = 'all' | 'timed' | 'word-count' | 'sentence' | 'zen';

const TEST_TYPE_LABELS: Record<string, string> = {
  timed: "시간제",
  "word-count": "단어수",
  sentence: "문장",
  zen: "자유",
};

export default function ResultsPage() {
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dateFilter, setDateFilter] = React.useState<DateFilter>('all');
  const [testTypeFilter, setTestTypeFilter] = React.useState<TestTypeFilter>('all');
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const [expandedDiffs, setExpandedDiffs] = React.useState<DiffPart[]>([]);
  const personalBests = useSettingsStore(s => s.personalBests);

  React.useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await db.getSessions(100);
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = React.useMemo(() => {
    const now = new Date();
    return sessions.filter(s => {
      const date = new Date(s.createdAt);

      // Date filter
      let dateMatch = true;
      switch (dateFilter) {
        case 'today':
          dateMatch = date.toDateString() === now.toDateString();
          break;
        case 'week': {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          dateMatch = date >= weekAgo;
          break;
        }
        case 'month': {
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          dateMatch = date >= monthAgo;
          break;
        }
      }

      // Test type filter
      const typeMatch = testTypeFilter === 'all' || s.testType === testTypeFilter;

      return dateMatch && typeMatch;
    });
  }, [sessions, dateFilter, testTypeFilter]);

  const stats = React.useMemo(() => {
    if (filteredSessions.length === 0) return null;
    const totalSessions = filteredSessions.length;
    const avgAccuracy = filteredSessions.reduce((sum, s) => sum + s.results.accuracy, 0) / totalSessions;
    const avgWpm = filteredSessions.reduce((sum, s) => sum + s.results.wpm, 0) / totalSessions;
    const bestWpm = Math.max(...filteredSessions.map(s => s.results.wpm));
    const bestAccuracy = Math.max(...filteredSessions.map(s => s.results.accuracy));
    const totalErrors = filteredSessions.reduce((sum, s) => sum + s.results.errorCount, 0);

    return { totalSessions, avgAccuracy, avgWpm, bestWpm, bestAccuracy, totalErrors };
  }, [filteredSessions]);

  const aggregatedErrors = React.useMemo(() => {
    const result = { spacing: 0, jamo: 0, batchim: 0, vowel: 0 };
    filteredSessions.forEach(s => {
      if (s.errors) {
        result.spacing += s.errors.spacing;
        result.jamo += s.errors.jamo;
        result.batchim += s.errors.batchim;
        result.vowel += s.errors.vowel;
      }
    });
    return result;
  }, [filteredSessions]);

  const chartData = React.useMemo(() => {
    return sessions.map(s => ({
      wpm: s.results.wpm,
      accuracy: s.results.accuracy,
      date: new Date(s.createdAt).toISOString(),
    }));
  }, [sessions]);

  const handleExpand = (session: Session) => {
    if (expandedId === session.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(session.id ?? null);
    if (session.sentences?.length > 0) {
      const diffs = calculateDiff(session.sentences[0], "");
      setExpandedDiffs(diffs);
    }
  };

  const modeLabel = (session: Session) => {
    if (session.testType && TEST_TYPE_LABELS[session.testType]) {
      return TEST_TYPE_LABELS[session.testType];
    }
    switch (session.mode) {
      case 'dictation': return '받아쓰기';
      case 'speed': return '타이핑';
      case 'drill': return '드릴';
      default: return '연습';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumb />
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">연습 기록</h1>
          <p className="text-muted-foreground">
            지금까지의 연습 내역과 통계를 확인하세요
          </p>
        </div>

        {/* Personal Bests */}
        {Object.keys(personalBests).length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {Object.entries(personalBests).map(([type, best]) => (
              <div key={type} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20 text-sm">
                <TrendingUp className="h-3 w-3 text-warning" />
                <span className="text-muted-foreground">{TEST_TYPE_LABELS[type] || type}</span>
                <span className="font-bold">{best.wpm} WPM</span>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                아직 기록이 없어요. 받아쓰기부터 시작해볼까요?
              </p>
              <Link href="/practice">
                <Button>연습 시작하기</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Aggregate Stats */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">평균 정확도</span>
                    </div>
                    <div className="text-2xl font-bold">{Math.round(stats.avgAccuracy * 100)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">평균 WPM</span>
                    </div>
                    <div className="text-2xl font-bold">{Math.round(stats.avgWpm)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">최고 WPM</span>
                    </div>
                    <div className="text-2xl font-bold">{stats.bestWpm}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">총 세션</span>
                    </div>
                    <div className="text-2xl font-bold">{stats.totalSessions}</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* WPM Chart */}
            <WpmChart data={chartData} />

            {/* Error Breakdown */}
            <ErrorBreakdown errors={aggregatedErrors} />

            {/* Date Filter */}
            <div className="flex flex-wrap gap-2">
              {([
                { value: 'today' as DateFilter, label: '오늘' },
                { value: 'week' as DateFilter, label: '이번 주' },
                { value: 'month' as DateFilter, label: '이번 달' },
                { value: 'all' as DateFilter, label: '전체' },
              ]).map(({ value, label }) => (
                <Button
                  key={value}
                  variant={dateFilter === value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateFilter(value)}
                >
                  {label}
                </Button>
              ))}
              <div className="w-px bg-border mx-1" />
              {([
                { value: 'all' as TestTypeFilter, label: '전체' },
                { value: 'timed' as TestTypeFilter, label: '시간제' },
                { value: 'word-count' as TestTypeFilter, label: '단어수' },
                { value: 'sentence' as TestTypeFilter, label: '문장' },
                { value: 'zen' as TestTypeFilter, label: '자유' },
              ]).map(({ value, label }) => (
                <Button
                  key={value}
                  variant={testTypeFilter === value ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setTestTypeFilter(value)}
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Session List */}
            {filteredSessions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  선택한 기간에 기록이 없습니다
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredSessions.map((session, index) => {
                  const isExpanded = expandedId === session.id;
                  return (
                    <Card key={session.id || index}>
                      <CardContent className="py-4">
                        <button
                          className="w-full text-left"
                          onClick={() => handleExpand(session)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">
                                  {modeLabel(session)} 세션
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {modeLabel(session)}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(session.createdAt).toLocaleString('ko-KR')}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 sm:gap-6 text-sm">
                              <div className="text-center">
                                <div className="font-bold text-lg">{Math.round(session.results.accuracy * 100)}%</div>
                                <div className="text-xs text-muted-foreground">정확도</div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-lg">{session.results.wpm}</div>
                                <div className="text-xs text-muted-foreground">WPM</div>
                              </div>
                              <div className="text-center hidden sm:block">
                                <div className="font-bold text-lg">{session.results.cpm}</div>
                                <div className="text-xs text-muted-foreground">CPM</div>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Expanded detail */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t space-y-4">
                            {/* Error breakdown for this session */}
                            {session.errors && (
                              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                                <div className="p-2 rounded bg-muted/50">
                                  <div className="font-bold text-sm">{session.errors.jamo}</div>
                                  <div className="text-muted-foreground">자모</div>
                                </div>
                                <div className="p-2 rounded bg-muted/50">
                                  <div className="font-bold text-sm">{session.errors.batchim}</div>
                                  <div className="text-muted-foreground">받침</div>
                                </div>
                                <div className="p-2 rounded bg-muted/50">
                                  <div className="font-bold text-sm">{session.errors.vowel}</div>
                                  <div className="text-muted-foreground">모음</div>
                                </div>
                                <div className="p-2 rounded bg-muted/50">
                                  <div className="font-bold text-sm">{session.errors.spacing}</div>
                                  <div className="text-muted-foreground">띄어쓰기</div>
                                </div>
                              </div>
                            )}

                            {/* Original text */}
                            {session.sentences?.length > 0 && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">연습 텍스트:</p>
                                <p className="text-sm font-mono bg-muted/30 p-2 rounded break-keep">
                                  {session.sentences[0].slice(0, 200)}
                                  {session.sentences[0].length > 200 && '...'}
                                </p>
                              </div>
                            )}

                            {/* Action */}
                            {session.contentPackId && (
                              <Link href={`/practice?pack=${session.contentPackId}&type=${session.testType || 'timed'}`}>
                                <Button variant="outline" size="sm" className="gap-1.5">
                                  <RotateCcw className="h-3 w-3" />
                                  이 팩으로 다시 연습
                                </Button>
                              </Link>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
