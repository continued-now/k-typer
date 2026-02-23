import { DiffPart } from '@/types';

export function calculateDiff(expected: string, actual: string): DiffPart[] {
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
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,     // deletion
                    dp[i][j - 1] + 1,     // insertion
                    dp[i - 1][j - 1] + 1  // substitution
                );
            }
        }
    }

    // Backtrack
    let i = m;
    let j = n;
    const parts: DiffPart[] = [];

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && expected[i - 1] === actual[j - 1]) {
            parts.unshift({ type: 'equal', value: expected[i - 1] });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || dp[i][j] === dp[i][j - 1] + 1)) {
            parts.unshift({ type: 'insert', value: actual[j - 1] });
            j--;
        } else if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] + 1)) {
            parts.unshift({ type: 'delete', value: expected[i - 1] });
            i--;
        } else {
            parts.unshift({ type: 'substitute', value: actual[j - 1], original: expected[i - 1] });
            i--;
            j--;
        }
    }

    return parts;
}
