"use client"

import * as React from "react"
import { LiveTypingArea } from "./LiveTypingArea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { calculateDiff } from "@/lib/hangul/diff"
import { calculateScore } from "@/lib/scoring"
import { analyzeErrors } from "@/lib/hangul/analysis"
import { db } from "@/lib/db"
import { DiffViewer } from "@/components/features/dictation/DiffViewer"
import { StatsWidgets } from "@/components/features/analytics/StatsWidgets"
import type { TestConfig } from "./TestConfig"
import type { ScoreResult, DiffPart, ErrorAnalysis } from "@/types"
import { RotateCcw, ArrowRight } from "lucide-react"

interface WordTestProps {
  config: TestConfig;
  onFinish: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateTargetText(config: TestConfig): string {
  const { contentPack, testType, wordCountTarget } = config;
  const items = shuffleArray(contentPack.items);

  if (contentPack.mode === 'words') {
    const count = testType === 'word-count' ? (wordCountTarget || 50) : Math.min(100, items.length);
    const words: string[] = [];
    while (words.length < count) {
      words.push(...items);
    }
    return shuffleArray(words).slice(0, count).join(' ');
  }

  // Sentence mode — join sentences
  if (testType === 'sentence') {
    return items[0];
  }
  const count = testType === 'word-count' ? (wordCountTarget || 50) : items.length;
  const sentences: string[] = [];
  let wordCount = 0;
  for (const sentence of items) {
    sentences.push(sentence);
    wordCount += sentence.split(/\s+/).length;
    if (testType === 'word-count' && wordCount >= count) break;
    if (sentences.length >= 10 && testType !== 'word-count') break;
  }
  return sentences.join(' ');
}

export function WordTest({ config, onFinish }: WordTestProps) {
  const [targetText, setTargetText] = React.useState(() => generateTargetText(config));
  const [userInput, setUserInput] = React.useState('');
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = React.useState(config.timedDuration || 0);
  const [isFinished, setIsFinished] = React.useState(false);
  const [result, setResult] = React.useState<ScoreResult | null>(null);
  const [diffs, setDiffs] = React.useState<DiffPart[]>([]);
  const [countdown, setCountdown] = React.useState(3);
  const [isCountingDown, setIsCountingDown] = React.useState(true);
  const [currentWpm, setCurrentWpm] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [maxStreak, setMaxStreak] = React.useState(0);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [sentenceIndex, setSentenceIndex] = React.useState(0);
  const sentences = React.useMemo(() => shuffleArray(config.contentPack.items), [config.contentPack.items]);

  // Countdown
  React.useEffect(() => {
    if (!isCountingDown) return;
    if (countdown <= 0) {
      setIsCountingDown(false);
      setStartTime(Date.now());
      inputRef.current?.focus();
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, isCountingDown]);

  // Timer for timed mode
  React.useEffect(() => {
    if (config.testType !== 'timed' || !startTime || isFinished || isCountingDown) return;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, (config.timedDuration || 60) - elapsed);
      setTimeRemaining(Math.ceil(remaining));
      if (remaining <= 0) {
        finishTest();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [config.testType, config.timedDuration, startTime, isFinished, isCountingDown]);

  // Live WPM calculation
  React.useEffect(() => {
    if (!startTime || isFinished || isCountingDown) return;
    const elapsed = (Date.now() - startTime) / 1000 / 60;
    if (elapsed > 0) {
      setCurrentWpm(Math.round((userInput.length / 5) / elapsed));
    }
  }, [userInput, startTime, isFinished, isCountingDown]);

  // Streak tracking
  React.useEffect(() => {
    if (userInput.length === 0) return;
    const lastIdx = userInput.length - 1;
    if (lastIdx < targetText.length && userInput[lastIdx] === targetText[lastIdx]) {
      setStreak(s => {
        const newS = s + 1;
        setMaxStreak(m => Math.max(m, newS));
        return newS;
      });
    } else {
      setStreak(0);
    }
  }, [userInput, targetText]);

  const finishTest = React.useCallback(() => {
    if (isFinished || !startTime) return;
    setIsFinished(true);
    const timeMs = Date.now() - startTime;
    const typed = config.testType === 'sentence' ? userInput : userInput;
    const target = config.testType === 'sentence' ? targetText : targetText.slice(0, Math.max(typed.length, targetText.length));

    const diffResult = calculateDiff(target, typed);
    const scoreResult = calculateScore(target, typed, timeMs, diffResult);
    const errorAnalysis = analyzeErrors(diffResult);

    setDiffs(diffResult);
    setResult(scoreResult);

    db.saveSession({
      mode: config.testType === 'sentence' ? 'dictation' : 'speed',
      sentences: [target],
      results: scoreResult,
      errors: errorAnalysis,
      createdAt: new Date()
    }).catch(console.error);
  }, [isFinished, startTime, userInput, targetText, config.testType]);

  // Auto-finish for word-count and sentence modes
  React.useEffect(() => {
    if (isFinished || isCountingDown || !startTime) return;
    if (config.testType === 'sentence' && userInput.length >= targetText.length) {
      finishTest();
    }
    if (config.testType === 'word-count' && userInput.length >= targetText.length) {
      finishTest();
    }
  }, [userInput, targetText, config.testType, isFinished, isCountingDown, startTime, finishTest]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished || isCountingDown) return;
    setUserInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      finishTest();
    }
  };

  const handleNextSentence = () => {
    const next = sentenceIndex + 1;
    if (next >= sentences.length) {
      onFinish();
      return;
    }
    setSentenceIndex(next);
    setTargetText(sentences[next]);
    setUserInput('');
    setIsFinished(false);
    setResult(null);
    setDiffs([]);
    setStreak(0);
    setMaxStreak(0);
    setCountdown(0);
    setIsCountingDown(false);
    setStartTime(Date.now());
    inputRef.current?.focus();
  };

  const handleRestart = () => {
    setTargetText(generateTargetText(config));
    setUserInput('');
    setIsFinished(false);
    setResult(null);
    setDiffs([]);
    setStreak(0);
    setMaxStreak(0);
    setCountdown(3);
    setIsCountingDown(true);
    setTimeRemaining(config.timedDuration || 0);
    setStartTime(null);
  };

  // Countdown overlay
  if (isCountingDown && countdown > 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="text-8xl font-bold text-primary animate-pulse">{countdown}</div>
          <p className="text-muted-foreground mt-4">준비하세요...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* HUD */}
      {!isFinished && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <span className="text-2xl font-bold text-foreground">{currentWpm}</span> WPM
            </div>
            {streak >= 5 && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                {streak} 연속
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            {config.testType === 'timed' && (
              <div className={`text-2xl font-bold tabular-nums ${timeRemaining <= 10 ? 'text-red-500' : 'text-foreground'}`}>
                {timeRemaining}초
              </div>
            )}
            {config.testType === 'zen' && (
              <Button variant="outline" size="sm" onClick={finishTest}>
                완료
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Typing Area */}
      {!isFinished && (
        <>
          <LiveTypingArea
            targetText={targetText}
            userInput={userInput}
            isActive={!isFinished && !isCountingDown}
          />
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className="sr-only"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          <p className="text-xs text-center text-muted-foreground">
            화면을 클릭하고 타이핑을 시작하세요 &middot; Esc로 종료
          </p>
        </>
      )}

      {/* Results */}
      {isFinished && result && (
        <div className="space-y-4">
          <StatsWidgets result={result} />

          {maxStreak >= 5 && (
            <Card>
              <CardContent className="py-4 text-center">
                <p className="text-sm text-muted-foreground">최고 연속 정답</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{maxStreak}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">정답 비교</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1 text-muted-foreground">원문:</p>
                  <p className="font-mono text-base">{targetText}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1 text-muted-foreground">내 입력:</p>
                  <DiffViewer diffs={diffs} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            {config.testType === 'sentence' ? (
              <Button onClick={handleNextSentence} className="flex-1">
                <ArrowRight className="h-4 w-4 mr-2" />
                다음 문장
              </Button>
            ) : (
              <Button onClick={handleRestart} className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                다시 하기
              </Button>
            )}
            <Button variant="outline" onClick={onFinish} className="flex-1">
              돌아가기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
