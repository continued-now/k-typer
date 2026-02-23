"use client"

import * as React from "react"
import { AppNav } from "@/components/layout/AppNav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { Activity, Target, Zap, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"
import type { Session } from "@/lib/db"

type DateFilter = 'today' | 'week' | 'month' | 'all';

export default function ResultsPage() {
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dateFilter, setDateFilter] = React.useState<DateFilter>('all');

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
      switch (dateFilter) {
        case 'today':
          return date.toDateString() === now.toDateString();
        case 'week': {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return date >= weekAgo;
        }
        case 'month': {
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return date >= monthAgo;
        }
        default:
          return true;
      }
    });
  }, [sessions, dateFilter]);

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

  const modeLabel = (mode: string) => {
    switch (mode) {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">연습 기록</h1>
          <p className="text-muted-foreground">
            지금까지의 연습 내역과 통계를 확인하세요
          </p>
        </div>

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

            {/* Date Filter */}
            <div className="flex gap-2">
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
                {filteredSessions.map((session, index) => (
                  <Card key={session.id || index}>
                    <CardContent className="py-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {modeLabel(session.mode)} 세션
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {modeLabel(session.mode)}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(session.createdAt).toLocaleString('ko-KR')}
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <div className="font-bold text-lg">{Math.round(session.results.accuracy * 100)}%</div>
                            <div className="text-xs text-muted-foreground">정확도</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg">{session.results.wpm}</div>
                            <div className="text-xs text-muted-foreground">WPM</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg">{session.results.cpm}</div>
                            <div className="text-xs text-muted-foreground">CPM</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
