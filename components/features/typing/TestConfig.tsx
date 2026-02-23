"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CONTENT_PACKS, type ContentPack, type ContentDifficulty } from "@/lib/data"
import { Clock, Hash, Infinity as InfinityIcon, BookOpen } from "lucide-react"

export type TestType = 'timed' | 'word-count' | 'zen' | 'sentence';
export type TimedDuration = 30 | 60 | 120;
export type WordCountTarget = 25 | 50 | 100;

export interface TestConfig {
  contentPack: ContentPack;
  testType: TestType;
  timedDuration?: TimedDuration;
  wordCountTarget?: WordCountTarget;
}

interface TestConfigProps {
  onStart: (config: TestConfig) => void;
}

const DIFFICULTY_COLORS: Record<ContentDifficulty, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  intermediate: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-sky-200 dark:border-sky-800",
  advanced: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",
};

const DIFFICULTY_LABELS: Record<ContentDifficulty, string> = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

export function TestConfigPanel({ onStart }: TestConfigProps) {
  const [selectedPack, setSelectedPack] = React.useState<ContentPack | null>(null);
  const [testType, setTestType] = React.useState<TestType>('timed');
  const [timedDuration, setTimedDuration] = React.useState<TimedDuration>(60);
  const [wordCountTarget, setWordCountTarget] = React.useState<WordCountTarget>(50);
  const [difficultyFilter, setDifficultyFilter] = React.useState<ContentDifficulty | 'all'>('all');

  const filteredPacks = difficultyFilter === 'all'
    ? CONTENT_PACKS
    : CONTENT_PACKS.filter(p => p.difficulty === difficultyFilter);

  const handleStart = () => {
    if (!selectedPack) return;
    onStart({
      contentPack: selectedPack,
      testType,
      timedDuration: testType === 'timed' ? timedDuration : undefined,
      wordCountTarget: testType === 'word-count' ? wordCountTarget : undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Difficulty Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(d => (
          <Button
            key={d}
            variant={difficultyFilter === d ? "default" : "outline"}
            size="sm"
            onClick={() => setDifficultyFilter(d)}
          >
            {d === 'all' ? '전체' : DIFFICULTY_LABELS[d]}
          </Button>
        ))}
      </div>

      {/* Content Pack Selection */}
      <div className="grid sm:grid-cols-2 gap-3">
        {filteredPacks.map(pack => (
          <button
            key={pack.id}
            onClick={() => setSelectedPack(pack)}
            className={`text-left p-4 rounded-lg border transition-all ${
              selectedPack?.id === pack.id
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/40 bg-card'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-sm">{pack.titleKo}</h3>
              <Badge className={DIFFICULTY_COLORS[pack.difficulty]} variant="outline">
                {DIFFICULTY_LABELS[pack.difficulty]}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{pack.description}</p>
            <p className="text-xs text-muted-foreground">{pack.wordCount}개 항목</p>
          </button>
        ))}
      </div>

      {selectedPack && (
        <>
          {/* Test Type Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">테스트 유형</CardTitle>
              <CardDescription>연습 방식을 선택하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {([
                  { type: 'timed' as TestType, icon: Clock, label: '시간제한', desc: '제한 시간 내 타이핑' },
                  { type: 'word-count' as TestType, icon: Hash, label: '단어 수', desc: '목표 단어 수 달성' },
                  { type: 'zen' as TestType, icon: InfinityIcon, label: '자유 연습', desc: '제한 없이 연습' },
                  { type: 'sentence' as TestType, icon: BookOpen, label: '문장 연습', desc: '문장 단위 연습' },
                ]).map(({ type, icon: Icon, label, desc }) => (
                  <button
                    key={type}
                    onClick={() => setTestType(type)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      testType === type
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </button>
                ))}
              </div>

              {/* Duration/Count selectors */}
              {testType === 'timed' && (
                <div className="flex gap-2 mt-4">
                  {([30, 60, 120] as TimedDuration[]).map(d => (
                    <Button
                      key={d}
                      variant={timedDuration === d ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTimedDuration(d)}
                    >
                      {d}초
                    </Button>
                  ))}
                </div>
              )}
              {testType === 'word-count' && (
                <div className="flex gap-2 mt-4">
                  {([25, 50, 100] as WordCountTarget[]).map(w => (
                    <Button
                      key={w}
                      variant={wordCountTarget === w ? "default" : "outline"}
                      size="sm"
                      onClick={() => setWordCountTarget(w)}
                    >
                      {w}단어
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Start Button */}
          <Button onClick={handleStart} size="lg" className="w-full text-lg">
            연습 시작하기
          </Button>
        </>
      )}
    </div>
  );
}
