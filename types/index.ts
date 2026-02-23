export type DiffType = 'equal' | 'insert' | 'delete' | 'substitute';

export interface DiffPart {
    type: DiffType;
    value: string;
    original?: string; // For substitute
}

export interface ScoreResult {
    wpm: number;
    cpm: number;
    cer: number; // Character Error Rate (0-1)
    wer: number; // Word Error Rate (0-1)
    accuracy: number; // 1 - CER (0-1)
    totalChars: number;
    correctChars: number;
    errorCount: number;
}

export interface ErrorAnalysis {
    spacing: number;
    jamo: number;
    batchim: number;
    vowel: number; // ㅓ/ㅗ, ㅐ/ㅔ etc.
    total: number;
}
