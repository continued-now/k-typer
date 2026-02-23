import { DiffPart, ErrorAnalysis } from '@/types';
import { decomposeHangul } from './index';
import { JAMO_CONFUSIONS, BATCHIM_CONFUSIONS } from './constants';

export function analyzeErrors(diffs: DiffPart[]): ErrorAnalysis {
    const analysis: ErrorAnalysis = {
        spacing: 0,
        jamo: 0,
        batchim: 0,
        vowel: 0,
        total: 0
    };

    diffs.forEach(part => {
        if (part.type === 'substitute' && part.original) {
            analysis.total++;

            const expected = part.original;
            const actual = part.value;

            // Check for spacing errors (if substitute involves space, though usually that's ins/del)
            // Actually spacing errors are often ins/del of space.
            // Let's handle substitutions first.

            const decompExpected = decomposeHangul(expected);
            const decompActual = decomposeHangul(actual);

            if (decompExpected && decompActual) {
                // Check Vowel (Jung) confusion
                if (decompExpected.jung !== decompActual.jung) {
                    if (JAMO_CONFUSIONS[decompExpected.jung]?.includes(decompActual.jung)) {
                        analysis.vowel++;
                    } else {
                        analysis.jamo++; // General jamo error
                    }
                }

                // Check Batchim (Jong) confusion
                if (decompExpected.jong !== decompActual.jong) {
                    if (BATCHIM_CONFUSIONS[decompExpected.jong]?.includes(decompActual.jong)) {
                        analysis.batchim++;
                    } else {
                        analysis.jamo++;
                    }
                }

                // Check Initial (Cho) confusion
                if (decompExpected.cho !== decompActual.cho) {
                    analysis.jamo++;
                }
            } else {
                // Non-Hangul substitution — already counted via analysis.total++ above
            }
        } else if (part.type === 'insert' || part.type === 'delete') {
            if (part.value === ' ') {
                analysis.spacing++;
            } else {
                analysis.total++;
            }
        }
    });

    return analysis;
}
