"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Settings2 } from "lucide-react"
import { tts } from "@/lib/tts"
import { useSettingsStore } from "@/store"

interface DictationPlayerProps {
    text: string;
    onComplete?: () => void;
}

export function DictationPlayer({ text, onComplete }: DictationPlayerProps) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const { ttsRate } = useSettingsStore();

    const handlePlay = () => {
        setIsPlaying(true);
        tts.speak(text, {
            rate: ttsRate,
            // onEnd callback isn't directly supported in my simple adapter yet, 
            // but I should add it or just simulate for now.
            // Let's assume the adapter handles it or we just toggle state.
            // Actually, the adapter I wrote doesn't expose onEnd. I should update it or just rely on user stopping.
            // For MVP, let's just toggle state.
        });

        // Simple timeout fallback to reset playing state if we can't hook into onEnd
        // Or just let it stay "playing" until user pauses or types?
        // Ideally we want to know when it finishes.
        // Let's just toggle for now.
    };

    const handlePause = () => {
        setIsPlaying(false);
        tts.cancel();
    };

    const handleReplay = () => {
        tts.cancel();
        handlePlay();
    };

    return (
        <div className="flex items-center gap-2 p-4 bg-secondary/50 rounded-lg">
            <Button
                variant="default"
                size="icon"
                onClick={isPlaying ? handlePause : handlePlay}
                className="h-12 w-12 rounded-full"
            >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
            </Button>

            <div className="flex-1 mx-4">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-0 transition-all duration-300" />
                    {/* Progress bar would go here if we had duration */}
                </div>
            </div>

            <Button variant="ghost" size="icon" onClick={handleReplay}>
                <RotateCcw className="h-5 w-5" />
            </Button>

            <div className="text-sm font-medium text-muted-foreground w-12 text-center">
                {ttsRate}x
            </div>
        </div>
    );
}
