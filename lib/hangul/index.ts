import { CHOSUNG, JUNGSUNG, JONGSUNG, HANGUL_START, HANGUL_END, CHO_PERIOD, JUNG_PERIOD } from './constants';

export interface DecomposedHangul {
    cho: string;
    jung: string;
    jong: string;
}

export function isHangul(char: string): boolean {
    if (char.length !== 1) return false;
    const code = char.charCodeAt(0);
    return code >= HANGUL_START && code <= HANGUL_END;
}

export function decomposeHangul(char: string): DecomposedHangul | null {
    if (!isHangul(char)) return null;

    const code = char.charCodeAt(0) - HANGUL_START;

    const choIndex = Math.floor(code / CHO_PERIOD);
    const jungIndex = Math.floor((code % CHO_PERIOD) / JUNG_PERIOD);
    const jongIndex = code % JUNG_PERIOD;

    return {
        cho: CHOSUNG[choIndex],
        jung: JUNGSUNG[jungIndex],
        jong: JONGSUNG[jongIndex],
    };
}

export function getJamos(text: string): string[] {
    const result: string[] = [];
    for (const char of text) {
        const decomposed = decomposeHangul(char);
        if (decomposed) {
            result.push(decomposed.cho);
            result.push(decomposed.jung);
            if (decomposed.jong) {
                result.push(decomposed.jong);
            }
        } else {
            result.push(char);
        }
    }
    return result;
}
