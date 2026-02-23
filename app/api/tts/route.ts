import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

        if (!apiKey) {
            // Fallback to client-side Web Speech API
            return NextResponse.json({
                error: 'Google Cloud API key not configured',
                fallback: true
            }, { status: 200 });
        }

        const response = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input: { text },
                    voice: {
                        languageCode: 'ko-KR',
                        name: 'ko-KR-Neural2-A', // High-quality neural voice
                        ssmlGender: 'FEMALE',
                    },
                    audioConfig: {
                        audioEncoding: 'MP3',
                        speakingRate: 1.0,
                        pitch: 0.0,
                    },
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error('Google TTS API error:', error);
            return NextResponse.json({
                error: 'TTS API error',
                fallback: true
            }, { status: 200 });
        }

        const data = await response.json();

        return NextResponse.json({
            audioContent: data.audioContent, // Base64 encoded audio
        });
    } catch (error) {
        console.error('TTS error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            fallback: true
        }, { status: 200 });
    }
}
