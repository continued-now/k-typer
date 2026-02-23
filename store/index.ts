import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSettings } from '@/lib/db';

interface PersonalBest {
    wpm: number;
    accuracy: number;
    date: string;
}

interface LastPractice {
    packId: string;
    testType: string;
    date: string;
}

interface SettingsState extends UserSettings {
    fontSize: number;
    soundEnabled: boolean;
    personalBests: Record<string, PersonalBest>;
    lastPractice: LastPractice | null;
    streakCount: number;
    lastPracticeDate: string | null;
    setTheme: (theme: UserSettings['theme']) => void;
    setTTSRate: (rate: number) => void;
    setVoiceURI: (uri: string) => void;
    setKeyboardGuide: (enabled: boolean) => void;
    setFontSize: (size: number) => void;
    setSoundEnabled: (enabled: boolean) => void;
    updatePersonalBest: (testType: string, wpm: number, accuracy: number) => boolean;
    setLastPractice: (packId: string, testType: string) => void;
    updateStreak: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            theme: 'system',
            ttsRate: 1.0,
            voiceURI: undefined,
            keyboardGuide: true,
            fontSize: 18,
            soundEnabled: false,
            personalBests: {},
            lastPractice: null,
            streakCount: 0,
            lastPracticeDate: null,
            setTheme: (theme) => set({ theme }),
            setTTSRate: (ttsRate) => set({ ttsRate }),
            setVoiceURI: (voiceURI) => set({ voiceURI }),
            setKeyboardGuide: (keyboardGuide) => set({ keyboardGuide }),
            setFontSize: (fontSize) => set({ fontSize: Math.max(14, Math.min(24, fontSize)) }),
            setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
            updatePersonalBest: (testType, wpm, accuracy) => {
                const state = get();
                const current = state.personalBests[testType];
                const isNewBest = !current || wpm > current.wpm || accuracy > current.accuracy;
                if (isNewBest) {
                    set({
                        personalBests: {
                            ...state.personalBests,
                            [testType]: {
                                wpm: Math.max(wpm, current?.wpm ?? 0),
                                accuracy: Math.max(accuracy, current?.accuracy ?? 0),
                                date: new Date().toISOString(),
                            },
                        },
                    });
                }
                return isNewBest;
            },
            setLastPractice: (packId, testType) => set({
                lastPractice: {
                    packId,
                    testType,
                    date: new Date().toISOString(),
                },
            }),
            updateStreak: () => {
                const state = get();
                const today = new Date().toDateString();
                const lastDate = state.lastPracticeDate;

                if (lastDate === today) return;

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                if (lastDate === yesterday.toDateString()) {
                    set({
                        streakCount: state.streakCount + 1,
                        lastPracticeDate: today,
                    });
                } else {
                    set({
                        streakCount: 1,
                        lastPracticeDate: today,
                    });
                }
            },
        }),
        {
            name: 'k-type-settings',
        }
    )
);
