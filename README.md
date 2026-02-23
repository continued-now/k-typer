# K-Type Coach | 한글 타이핑 코치

Master Korean typing with AI-powered dictation and analytics.

## Features

- 🎯 **받아쓰기 연습** - TTS dictation practice with real-time feedback
- 📊 **정확도 분석** - Detailed error analysis (자모 혼동, 받침 오타, 띄어쓰기)
- 🎓 **맞춤 드릴** - Personalized drills based on your error patterns
- 📈 **통계 추적** - Track WPM, CPM, CER, and improvement over time
- 💾 **로컬 우선** - All data stored locally in IndexedDB

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google Cloud TTS (Optional but Recommended)

For high-quality, natural-sounding Korean voices:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Cloud Text-to-Speech API**
4. Create an API key in **APIs & Services > Credentials**
5. Create a `.env.local` file in the project root:

```bash
GOOGLE_CLOUD_API_KEY=your_api_key_here
```

**Without the API key**, the app will fall back to the browser's built-in Web Speech API (which may sound robotic).

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **Database**: IndexedDB (via `idb`)
- **TTS**: Google Cloud Text-to-Speech API (with Web Speech fallback)
- **Icons**: Lucide React

## Project Structure

```
/app
  /api/tts         # Google Cloud TTS API route
  /practice        # Practice hub with dictation mode
  /results         # Analytics and session history
  /page.tsx        # Landing page
/components
  /ui              # Shared UI components (Button, Card, etc.)
  /features        # Feature-specific components
/lib
  /hangul          # Hangul decomposition and analysis
  /db              # IndexedDB service
  /tts             # TTS adapter
  /scoring         # Metrics calculation
```

## Available Voices

When using Google Cloud TTS, the app uses:
- **ko-KR-Neural2-A** - High-quality female Korean voice
- **ko-KR-Neural2-B** - High-quality male Korean voice (configurable)
- **ko-KR-Neural2-C** - Alternative female voice (configurable)

These neural voices sound much more natural than browser TTS.

## License

MIT
