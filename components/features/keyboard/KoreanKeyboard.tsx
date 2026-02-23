"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { decomposeHangul } from "@/lib/hangul"

const KEYBOARD_ROWS = [
  [
    { key: 'q', ko: 'ㅂ', koShift: 'ㅃ', finger: 'pinky-l' },
    { key: 'w', ko: 'ㅈ', koShift: 'ㅉ', finger: 'ring-l' },
    { key: 'e', ko: 'ㄷ', koShift: 'ㄸ', finger: 'middle-l' },
    { key: 'r', ko: 'ㄱ', koShift: 'ㄲ', finger: 'index-l' },
    { key: 't', ko: 'ㅅ', koShift: 'ㅆ', finger: 'index-l' },
    { key: 'y', ko: 'ㅛ', koShift: 'ㅛ', finger: 'index-r' },
    { key: 'u', ko: 'ㅕ', koShift: 'ㅕ', finger: 'index-r' },
    { key: 'i', ko: 'ㅑ', koShift: 'ㅑ', finger: 'middle-r' },
    { key: 'o', ko: 'ㅐ', koShift: 'ㅒ', finger: 'ring-r' },
    { key: 'p', ko: 'ㅔ', koShift: 'ㅖ', finger: 'pinky-r' },
  ],
  [
    { key: 'a', ko: 'ㅁ', koShift: 'ㅁ', finger: 'pinky-l' },
    { key: 's', ko: 'ㄴ', koShift: 'ㄴ', finger: 'ring-l' },
    { key: 'd', ko: 'ㅇ', koShift: 'ㅇ', finger: 'middle-l' },
    { key: 'f', ko: 'ㄹ', koShift: 'ㄹ', finger: 'index-l' },
    { key: 'g', ko: 'ㅎ', koShift: 'ㅎ', finger: 'index-l' },
    { key: 'h', ko: 'ㅗ', koShift: 'ㅗ', finger: 'index-r' },
    { key: 'j', ko: 'ㅓ', koShift: 'ㅓ', finger: 'index-r' },
    { key: 'k', ko: 'ㅏ', koShift: 'ㅏ', finger: 'middle-r' },
    { key: 'l', ko: 'ㅣ', koShift: 'ㅣ', finger: 'ring-r' },
  ],
  [
    { key: 'z', ko: 'ㅋ', koShift: 'ㅋ', finger: 'pinky-l' },
    { key: 'x', ko: 'ㅌ', koShift: 'ㅌ', finger: 'ring-l' },
    { key: 'c', ko: 'ㅊ', koShift: 'ㅊ', finger: 'middle-l' },
    { key: 'v', ko: 'ㅍ', koShift: 'ㅍ', finger: 'index-l' },
    { key: 'b', ko: 'ㅠ', koShift: 'ㅠ', finger: 'index-l' },
    { key: 'n', ko: 'ㅜ', koShift: 'ㅜ', finger: 'index-r' },
    { key: 'm', ko: 'ㅡ', koShift: 'ㅡ', finger: 'index-r' },
  ],
] as const;

const FINGER_COLORS: Record<string, string> = {
  'pinky-l': 'bg-rose-100 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800',
  'ring-l': 'bg-amber-100 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800',
  'middle-l': 'bg-emerald-100 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800',
  'index-l': 'bg-sky-100 dark:bg-sky-950/30 border-sky-300 dark:border-sky-800',
  'index-r': 'bg-sky-100 dark:bg-sky-950/30 border-sky-300 dark:border-sky-800',
  'middle-r': 'bg-emerald-100 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800',
  'ring-r': 'bg-amber-100 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800',
  'pinky-r': 'bg-rose-100 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800',
};

function findKeysForJamo(jamo: string): { key: string; needsShift: boolean }[] {
  const results: { key: string; needsShift: boolean }[] = [];
  for (const row of KEYBOARD_ROWS) {
    for (const keyDef of row) {
      if (keyDef.ko === jamo) {
        results.push({ key: keyDef.key, needsShift: false });
      } else if (keyDef.koShift === jamo && keyDef.ko !== jamo) {
        results.push({ key: keyDef.key, needsShift: true });
      }
    }
  }
  return results;
}

function getNextJamos(nextChar: string): string[] {
  if (nextChar === ' ') return [' '];
  const decomposed = decomposeHangul(nextChar);
  if (!decomposed) return [nextChar];
  const jamos = [decomposed.cho, decomposed.jung];
  if (decomposed.jong) jamos.push(decomposed.jong);
  return jamos;
}

interface KoreanKeyboardProps {
  nextChar?: string;
  showFingerGuide?: boolean;
  className?: string;
}

export function KoreanKeyboard({ nextChar, showFingerGuide = false, className }: KoreanKeyboardProps) {
  const highlightedKeys = React.useMemo(() => {
    if (!nextChar) return new Set<string>();
    const jamos = getNextJamos(nextChar);
    const keys = new Set<string>();
    for (const jamo of jamos) {
      if (jamo === ' ') {
        keys.add('space');
      } else {
        const found = findKeysForJamo(jamo);
        for (const { key } of found) {
          keys.add(key);
        }
      }
    }
    return keys;
  }, [nextChar]);

  const nextJamos = nextChar ? getNextJamos(nextChar) : [];
  const firstJamo = nextJamos[0];
  const firstKeyInfo = firstJamo && firstJamo !== ' ' ? findKeysForJamo(firstJamo) : [];
  const needsShift = firstKeyInfo.length > 0 && firstKeyInfo[0].needsShift;

  return (
    <div className={cn("select-none", className)}>
      {/* Next character hint — fixed height so it never collapses/shifts */}
      <div className="h-10 flex items-center justify-center gap-3 mb-3 text-sm">
        {nextChar ? (
          <>
            <span className="text-muted-foreground">다음 글자:</span>
            <span className="w-8 text-center text-2xl font-bold text-primary">{nextChar}</span>
            <span className="w-28 text-muted-foreground text-center">
              {nextJamos.length > 0 && nextJamos[0] !== ' ' ? `(${nextJamos.join(' + ')})` : '\u00A0'}
            </span>
            <span className="w-12 text-center">
              {needsShift ? (
                <span className="text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Shift
                </span>
              ) : '\u00A0'}
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">&nbsp;</span>
        )}
      </div>

      {/* Keyboard layout — no scale transforms, use box-shadow inset for highlight */}
      <div className="flex flex-col items-center gap-1">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-1"
            style={{ paddingLeft: rowIndex === 1 ? '16px' : rowIndex === 2 ? '40px' : '0' }}
          >
            {row.map((keyDef) => {
              const isHighlighted = highlightedKeys.has(keyDef.key);
              return (
                <div
                  key={keyDef.key}
                  className={cn(
                    "w-11 h-11 rounded-md border-2 flex flex-col items-center justify-center transition-colors duration-100",
                    showFingerGuide && FINGER_COLORS[keyDef.finger],
                    !showFingerGuide && "bg-card border-border",
                    isHighlighted
                      ? "border-primary bg-primary/15 dark:bg-primary/25 shadow-[inset_0_0_0_1px_var(--primary)]"
                      : "opacity-50"
                  )}
                >
                  <span className={cn(
                    "text-base font-semibold leading-none",
                    isHighlighted ? "text-primary" : "text-foreground"
                  )}>
                    {keyDef.ko}
                  </span>
                  <span className="text-[9px] text-muted-foreground leading-none mt-0.5">
                    {keyDef.key.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        ))}

        {/* Spacebar */}
        <div className="flex gap-1 mt-0.5" style={{ paddingLeft: '40px' }}>
          <div
            className={cn(
              "w-64 h-9 rounded-md border-2 flex items-center justify-center transition-colors duration-100",
              "bg-card",
              highlightedKeys.has('space')
                ? "border-primary bg-primary/15 shadow-[inset_0_0_0_1px_var(--primary)]"
                : "border-border opacity-50"
            )}
          >
            <span className="text-xs text-muted-foreground">Space</span>
          </div>
        </div>
      </div>

      {/* Finger guide legend */}
      {showFingerGuide && (
        <div className="flex items-center justify-center gap-3 mt-3 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-rose-200 dark:bg-rose-900 border border-rose-300 dark:border-rose-700" />
            새끼
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-amber-200 dark:bg-amber-900 border border-amber-300 dark:border-amber-700" />
            약지
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700" />
            중지
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-sky-200 dark:bg-sky-900 border border-sky-300 dark:border-sky-700" />
            검지
          </span>
        </div>
      )}
    </div>
  );
}
