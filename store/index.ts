import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSettings } from '@/lib/db';

interface SettingsState extends UserSettings {
    setTheme: (theme: UserSettings['theme']) => void;
    setTTSRate: (rate: number) => void;
    setVoiceURI: (uri: string) => void;
    setKeyboardGuide: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            theme: 'system',
            ttsRate: 1.0,
            voiceURI: undefined,
            keyboardGuide: true,
            setTheme: (theme) => set({ theme }),
            setTTSRate: (ttsRate) => set({ ttsRate }),
            setVoiceURI: (voiceURI) => set({ voiceURI }),
            setKeyboardGuide: (keyboardGuide) => set({ keyboardGuide }),
        }),
        {
            name: 'k-type-settings',
        }
    )
);

