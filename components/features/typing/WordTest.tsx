"use client"

import * as React from "react"
import { LiveTypingArea } from "./LiveTypingArea"
import { ShortcutHint } from "./ShortcutHint"
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
import type { ScoreResult, DiffPart } from "@/types"
import { RotateCcw, ArrowRight, Pause, Play, Trophy } from "lucide-react"
import { KoreanKeyboard } from "@/components/features/keyboard/KoreanKeyboard"
import { useSettingsStore } from "@/store"
import { playCompletionChime, playErrorBuzz, playKeyClick } from "@/lib/audio"

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
  const [currentCpm, setCurrentCpm] = React.useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [maxStreak, setMaxStreak] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [pauseCount, setPauseCount] = React.useState(0);
  const [pausedElapsed, setPausedElapsed] = React.useState(0);
  const [isNewBest, setIsNewBest] = React.useState(false);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const pauseStartRef = React.useRef<number | null>(null);
  const { keyboardGuide, soundEnabled, updatePersonalBest, setLastPractice, updateStreak } = useSettingsStore();
  const [sentenceIndex, setSentenceIndex] = React.useState(0);
  const sentences = React.useMemo(() => shuffleArray(config.contentPack.items), [config.contentPack.items]);
  const totalSentences = config.testType === 'sentence' ? sentences.length : 0;

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
    if (config.testType !== 'timed' || !startTime || isFinished || isCountingDown || isPaused) return;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime - pausedElapsed) / 1000;
      const remaining = Math.max(0, (config.timedDuration || 60) - elapsed);
      setTimeRemaining(Math.ceil(remaining));
      if (remaining <= 0) {
        finishTest();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [config.testType, config.timedDuration, startTime, isFinished, isCountingDown, isPaused, pausedElapsed]);

  // Live WPM + CPM calculation
  React.useEffect(() => {
    if (!startTime || isFinished || isCountingDown || isPaused) return;
    const elapsed = (Date.now() - startTime - pausedElapsed) / 1000 / 60;
    if (elapsed > 0) {
      setCurrentWpm(Math.round((userInput.length / 5) / elapsed));
      setCurrentCpm(Math.round(totalKeystrokes / elapsed));
    }
  }, [userInput, startTime, isFinished, isCountingDown, isPaused, totalKeystrokes, pausedElapsed]);

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

  // Focus results when finished
  React.useEffect(() => {
    if (isFinished && resultsRef.current) {
      resultsRef.current.focus();
    }
  }, [isFinished]);

  const finishTest = React.useCallback(() => {
    if (isFinished || !startTime) return;
    setIsFinished(true);
    const timeMs = Date.now() - startTime - pausedElapsed;
    const typed = userInput;
    const target = config.testType === 'sentence' ? targetText : targetText.slice(0, Math.max(typed.length, targetText.length));

    const diffResult = calculateDiff(target, typed);
    const scoreResult = calculateScore(target, typed, timeMs, diffResult);
    const errorAnalysis = analyzeErrors(diffResult);

    setDiffs(diffResult);
    setResult(scoreResult);

    // Check personal best
    const newBest = updatePersonalBest(config.testType, scoreResult.wpm, scoreResult.accuracy);
    setIsNewBest(newBest);

    // Update streak and last practice
    updateStreak();
    setLastPractice(config.contentPack.id, config.testType);

    if (soundEnabled) playCompletionChime();

    db.saveSession({
      mode: config.testType === 'sentence' ? 'dictation' : 'speed',
      testType: config.testType,
      contentPackId: config.contentPack.id,
      sentences: [target],
      results: scoreResult,
      errors: errorAnalysis,
      createdAt: new Date()
    }).catch(console.error);
  }, [isFinished, startTime, userInput, targetText, config.testType, config.contentPack.id, config.contentPack, pausedElapsed, soundEnabled, updatePersonalBest, updateStreak, setLastPractice]);

  // Auto-finish for word-count and sentence modes
  React.useEffect(() => {
    if (isFinished || isCountingDown || !startTime || isPaused) return;
    if (config.testType === 'sentence' && userInput.length >= targetText.length) {
      finishTest();
    }
    if (config.testType === 'word-count' && userInput.length >= targetText.length) {
      finishTest();
    }
  }, [userInput, targetText, config.testType, isFinished, isCountingDown, startTime, finishTest, isPaused]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished || isCountingDown || isPaused) return;
    const newValue = e.target.value;
    setTotalKeystrokes(k => k + 1);

    if (soundEnabled) {
      const lastIdx = newValue.length - 1;
      if (lastIdx >= 0 && lastIdx < targetText.length && newValue[lastIdx] !== targetText[lastIdx]) {
        playErrorBuzz();
      } else {
        playKeyClick();
      }
    }

    setUserInput(newValue);
  };

  const handlePause = React.useCallback(() => {
    if (isPaused) {
      // Resume
      if (pauseStartRef.current) {
        setPausedElapsed(prev => prev + (Date.now() - pauseStartRef.current!));
        pauseStartRef.current = null;
      }
      setIsPaused(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else if (pauseCount < 3) {
      // Pause
      pauseStartRef.current = Date.now();
      setIsPaused(true);
      setPauseCount(c => c + 1);
    }
  }, [isPaused, pauseCount]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (isPaused) {
        handlePause(); // Resume
      } else if (!isFinished && config.testType === 'timed') {
        handlePause(); // Pause
      } else {
        finishTest();
      }
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      handleRestart();
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
    setIsNewBest(false);
    setCountdown(0);
    setIsCountingDown(false);
    setStartTime(Date.now());
    setPausedElapsed(0);
    setPauseCount(0);
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
    setIsNewBest(false);
    setCountdown(3);
    setIsCountingDown(true);
    setTimeRemaining(config.timedDuration || 0);
    setStartTime(null);
    setTotalKeystrokes(0);
    setCurrentCpm(0);
    setPausedElapsed(0);
    setPauseCount(0);
    setIsPaused(false);
  };

  // Countdown overlay
  if (isCountingDown && countdown > 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px]" role="alert" aria-live="assertive">
        <div className="text-center">
          <div className="text-8xl font-bold text-primary animate-pulse">{countdown}</div>
          <p className="text-muted-foreground mt-4">준비하세요...</p>
        </div>
      </div>
    );
  }

  // Pause overlay
  if (isPaused) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Pause className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">일시정지</h2>
          <p className="text-muted-foreground mb-6">
            남은 일시정지: {3 - pauseCount}회
          </p>
          <Button onClick={handlePause} size="lg" className="gap-2">
            <Play className="h-4 w-4" />
            계속하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* HUD */}
      {!isFinished && (
        <div
          className="flex items-center justify-between px-2 h-10 flex-wrap gap-y-2"
          role="status"
          aria-live="polite"
          aria-label={`현재 속도: ${currentWpm} WPM, ${currentCpm} CPM`}
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-sm text-muted-foreground">
              <span className="text-xl sm:text-2xl font-bold text-foreground tabular-nums inline-block w-10 sm:w-12 text-right">{currentWpm}</span>
              <span className="hidden sm:inline"> </span>WPM
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="text-xl sm:text-2xl font-bold text-foreground tabular-nums inline-block w-12 sm:w-14 text-right">{currentCpm}</span>
              <span className="hidden sm:inline"> </span>CPM
            </div>
            {streak >= 5 && (
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                {streak} 연속
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3">
            {config.testType === 'sentence' && totalSentences > 0 && (
              <Badge variant="outline" className="text-xs tabular-nums">
                문장 {sentenceIndex + 1}/{totalSentences}
              </Badge>
            )}
            {config.testType === 'timed' && (
              <>
                <div className={`text-xl sm:text-2xl font-bold tabular-nums text-right ${timeRemaining <= 10 ? 'text-destructive' : 'text-foreground'}`}>
                  {timeRemaining}초
                </div>
                {pauseCount < 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePause}
                    aria-label="일시정지"
                    className="h-8 w-8 p-0"
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
            {config.testType === 'zen' && (
              <Button variant="outline" size="sm" onClick={finishTest}>
                완료
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Sentence progress bar */}
      {!isFinished && config.testType === 'sentence' && totalSentences > 0 && (
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((sentenceIndex) / totalSentences) * 100}%` }}
          />
        </div>
      )}

      {/* Typing Area */}
      {!isFinished && (
        <>
          <LiveTypingArea
            targetText={targetText}
            userInput={userInput}
            isActive={!isFinished && !isCountingDown && !isPaused}
          />
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className="sr-only"
            aria-label="타이핑 입력 영역"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          <ShortcutHint />
          <div className="hidden md:block">
            {keyboardGuide && (
              <KoreanKeyboard
                nextChar={userInput.length < targetText.length ? targetText[userInput.length] : undefined}
                showFingerGuide
                className="mt-4"
              />
            )}
          </div>
        </>
      )}

      {/* Results */}
      {isFinished && result && (
        <div className="space-y-4" ref={resultsRef} tabIndex={-1}>
          {isNewBest && (
            <Card className="border-warning/40 bg-warning/5">
              <CardContent className="py-4 text-center">
                <Trophy className="h-8 w-8 text-warning mx-auto mb-2" />
                <p className="font-bold text-lg">새 기록!</p>
                <p className="text-sm text-muted-foreground">개인 최고 기록을 갱신했습니다</p>
              </CardContent>
            </Card>
          )}

          <StatsWidgets result={result} />

          {maxStreak >= 5 && (
            <Card>
              <CardContent className="py-4 text-center">
                <p className="text-sm text-muted-foreground">최고 연속 정답</p>
                <p className="text-3xl font-bold text-success">{maxStreak}</p>
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
