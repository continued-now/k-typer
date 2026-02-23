export interface TTSOptions {
    rate?: number; // 0.1 to 10
    pitch?: number; // 0 to 2
    volume?: number; // 0 to 1
    voice?: SpeechSynthesisVoice;
}

export class TTSAdapter {
    private synthesis: SpeechSynthesis | null = null;
    private currentAudio: HTMLAudioElement | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.synthesis = window.speechSynthesis;
        }
    }

    async speak(text: string, options: TTSOptions = {}) {
        // Cancel any previous playback
        this.cancel();

        try {
            // Try Google Cloud TTS first
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            const data = await response.json();

            if (data.audioContent) {
                // Play the audio from Google Cloud TTS
                const audioBlob = this.base64ToBlob(data.audioContent, 'audio/mp3');
                const audioUrl = URL.createObjectURL(audioBlob);

                this.currentAudio = new Audio(audioUrl);
                this.currentAudio.playbackRate = options.rate || 1.0;

                await this.currentAudio.play();

                // Clean up URL after playback
                this.currentAudio.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                };

                return;
            }
        } catch (error) {
            console.warn('Google TTS failed, falling back to Web Speech API:', error);
        }

        // Fallback to Web Speech API
        this.speakWithWebSpeech(text, options);
    }

    private speakWithWebSpeech(text: string, options: TTSOptions = {}) {
        if (!this.synthesis) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';

        if (options.rate) utterance.rate = options.rate;
        if (options.pitch) utterance.pitch = options.pitch;
        if (options.volume) utterance.volume = options.volume;
        if (options.voice) utterance.voice = options.voice;

        // Fallback to first Korean voice if not specified
        if (!utterance.voice) {
            const voices = this.getVoices();
            if (voices.length > 0) {
                utterance.voice = voices[0];
            }
        }

        this.synthesis.speak(utterance);
    }

    private base64ToBlob(base64: string, mimeType: string): Blob {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }

    getVoices(): SpeechSynthesisVoice[] {
        if (!this.synthesis) return [];
        return this.synthesis.getVoices().filter(voice => voice.lang.startsWith('ko'));
    }

    cancel() {
        // Stop Web Speech API
        if (this.synthesis) {
            this.synthesis.cancel();
        }

        // Stop HTML5 Audio
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
    }
}

export const tts = new TTSAdapter();
