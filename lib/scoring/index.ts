import { DiffPart } from '@/types';
import { ScoreResult } from '@/types';

export function calculateScore(expected: string, actual: string, timeMs: number, precomputedDiffs?: DiffPart[]): ScoreResult {
    let correctChars = 0;
    let errorCount = 0;
    let distance = 0;

    // Use pre-computed diffs if provided, avoiding double computation
    if (precomputedDiffs) {
        precomputedDiffs.forEach(part => {
            if (part.type === 'equal') {
                correctChars += part.value.length;
            } else {
                distance += part.value.length;
                errorCount += part.value.length;
            }
        });
    } else {
        // Inline Levenshtein distance for when diffs aren't needed
        const m = expected.length;
        const n = actual.length;
        const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (expected[i - 1] === actual[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + 1);
                }
            }
        }
        distance = dp[m][n];
        correctChars = Math.max(0, expected.length - distance);
        errorCount = distance;
    }

    const totalChars = expected.length;
    const cer = totalChars > 0 ? distance / totalChars : 0;
    const accuracy = Math.max(0, 1 - cer);

    // WPM Calculation: (Characters / 5) / Minutes
    const minutes = timeMs / 1000 / 60;
    const wpm = minutes > 0 ? (actual.length / 5) / minutes : 0;
    const cpm = minutes > 0 ? actual.length / minutes : 0;

    // WER Calculation via word-level Levenshtein
    const expectedWords = expected.trim().split(/\s+/);
    const actualWords = actual.trim().split(/\s+/);
    const wer = calculateWordErrorRate(expectedWords, actualWords);

    return {
        wpm: Math.round(wpm),
        cpm: Math.round(cpm),
        cer,
        wer,
        accuracy,
        totalChars,
        correctChars,
        errorCount
    };
}

function calculateWordErrorRate(expected: string[], actual: string[]): number {
    const m = expected.length;
    const n = actual.length;
    if (m === 0) return n > 0 ? 1 : 0;

    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (expected[i - 1] === actual[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + 1);
            }
        }
    }
    return dp[m][n] / m;
}
