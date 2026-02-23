export const CHOSUNG = [
    "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
    "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
] as const;

export const JUNGSUNG = [
    "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ",
    "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"
] as const;

export const JONGSUNG = [
    "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ",
    "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ",
    "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
] as const;

export const HANGUL_START = 0xAC00;
export const HANGUL_END = 0xD7A3;

export const CHO_PERIOD = 588; // 21 * 28
export const JUNG_PERIOD = 28;

export const JAMO_CONFUSIONS: Record<string, string[]> = {
    "ㅐ": ["ㅔ"],
    "ㅔ": ["ㅐ"],
    "ㅒ": ["ㅖ"],
    "ㅖ": ["ㅒ"],
    "ㅓ": ["ㅗ"],
    "ㅗ": ["ㅓ"],
    "ㅡ": ["ㅜ"],
    "ㅜ": ["ㅡ"],
};

export const BATCHIM_CONFUSIONS: Record<string, string[]> = {
    "ㄱ": ["ㅋ", "ㄲ"],
    "ㄷ": ["ㅌ", "ㅅ", "ㅆ", "ㅈ", "ㅊ", "ㅎ"],
    "ㅂ": ["ㅍ"],
    "ㅅ": ["ㅆ"],
    "ㅆ": ["ㅅ"],
    "ㅈ": ["ㅊ"],
};
