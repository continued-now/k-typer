# K-Type Coach — Ralph Loop Plan

Granulated action items for building a robust Korean typing experience. Each item is independent and can be tackled in any order unless noted.

---

## Content & Word Lists

1. [x] Create `lib/data/common-100.ts` — export an array of the 100 most common Korean words
2. [x] Create `lib/data/common-1000.ts` — export an array of the 1000 most common Korean words, organized by frequency rank
3. [x] Create `lib/data/anthem.ts` — export the full Korean national anthem (애국가) text, split into verse arrays
4. [x] Create `lib/data/proverbs.ts` — export 50+ Korean proverbs/속담 as a string array
5. [x] Create `lib/data/tongue-twisters.ts` — export 20+ Korean tongue twisters/잰말
6. [x] Create `lib/data/news-excerpts.ts` — export 30+ real-style Korean news sentence excerpts across topics
7. [x] Create `lib/data/k-pop-lyrics.ts` — export K-pop inspired lyric snippets for fun typing practice
8. [x] Create `lib/data/tech-vocabulary.ts` — export 100+ Korean tech/programming terminology
9. [x] Create `lib/data/conversational.ts` — export 50+ everyday conversational Korean phrases organized by situation
10. [x] Create `lib/data/formal-writing.ts` — export 30+ formal Korean writing samples
11. [ ] Wire seed content packs — call `seedContent()` on app initialization so the 30 existing seed sentences are available in IndexedDB
12. [x] Create a unified content registry `lib/data/index.ts` that exports all word lists with metadata

## Typing Test Modes

13. [x] Build a word-mode typing test component (`components/features/typing/WordTest.tsx`) — displays words in a flowing line, user types each word, tracks accuracy and speed in real-time
14. [x] Build a timed test mode — 30s, 60s, 120s countdown timer options with live WPM counter
15. [x] Build a word-count test mode — type exactly N words (25, 50, 100) and measure total time + accuracy
16. [x] Build a sentence-mode typing test — shows full sentences one at a time, user types the whole sentence, next sentence on finish
17. [x] Build an endless/zen mode — continuous words flowing in, no timer, user can stop whenever they want
18. [ ] Build a race-against-yourself mode — replay your previous session's WPM as a ghost cursor/progress bar
19. [x] Create test configuration UI (`components/features/typing/TestConfig.tsx`) — select word list, test type, duration, and difficulty

## Practice Page Overhaul

20. [x] Replace hardcoded `SAMPLE_SENTENCES` in `app/practice/page.tsx` with dynamic content from the content registry
21. [x] Add a content/mode selector to the practice page — card grid to pick which word list or test type
22. [x] Add difficulty filtering (beginner/intermediate/advanced) to the practice page content selector
23. [x] Implement multi-sentence dictation sessions — queue N sentences, track cumulative score across the full session
24. [x] Add "next sentence" flow for dictation — after submitting one sentence, automatically load the next
25. [x] Show real-time character-by-character feedback while typing — highlight correct chars green and wrong chars red as user types (before submit)

## Core Engine Fixes & Improvements

26. [x] Fix double diff computation — refactor `calculateScore()` to accept pre-computed diffs
27. [x] Fix error analysis double-count bug — `lib/hangul/analysis.ts:51` remove duplicate `total++`
28. [x] Implement proper WER (Word Error Rate) — word-level Levenshtein in `lib/scoring/index.ts`
29. [ ] Add jamo-level diff mode — option to diff at the jamo (자모) level instead of syllable level
30. [ ] Add per-word timing data — track how long each word takes to type, identify slow words
31. [ ] Handle compound batchim (겹받침) in error analysis — ㄳ, ㄵ, ㄶ, ㄺ, etc. decomposition

## UI & Typing Experience

32. [x] Build a live typing area component (`components/features/typing/LiveTypingArea.tsx`) — monospace display with cursor tracking and color-coded chars
33. [x] Build a floating WPM/accuracy HUD that shows during active typing tests
34. [ ] Add a visual keyboard layout component (`components/features/keyboard/KoreanKeyboard.tsx`) — 2벌식 layout, highlights next expected key
35. [ ] Implement keyboard heat map — color keys by error frequency
36. [x] Add a countdown animation (3, 2, 1, Go!) before timed tests start
37. [x] Build a combo/streak indicator — show consecutive correct characters, reset on error
38. [ ] Add sound effects — optional key click sounds, error buzz, completion chime
39. [x] Fix DiffViewer dark mode — added dark: variants for all color classes
40. [x] Fix Toast dark mode — added dark: variants

## Results & Analytics

41. [x] Build an aggregate stats dashboard (`app/results/page.tsx` overhaul) — average WPM, accuracy, total sessions, best WPM
42. [ ] Add a WPM-over-time line chart using a lightweight chart lib
43. [ ] Add an error breakdown pie/bar chart — visualize error distribution
44. [ ] Build a "problem words" list — aggregate most frequently wrong words
45. [ ] Add per-test-type filtering on results page
46. [x] Add date range filtering on results page — today, this week, this month, all time
47. [ ] Add session detail view — click on a session card to see full diff

## Settings & Configuration

48. [x] Create `app/settings/page.tsx` — theme toggle, TTS rate slider, keyboard guide toggle
49. [ ] Add TTS voice picker — list available Korean voices, let user preview and select
50. [x] Add theme toggle (light/dark/system) that works — applies class to `<html>` element
51. [ ] Add font size setting — let users adjust the typing area font size
52. [x] Add a "reset all data" option in settings — clear IndexedDB with confirmation dialog

## Navigation & App Shell

53. [x] Build a persistent top nav component (`components/layout/AppNav.tsx`) — consistent navigation across all pages
54. [x] Create `app/drills/page.tsx` — personalized practice based on user's most common error types
55. [ ] Add breadcrumb navigation on practice/results/settings pages
56. [ ] Add a responsive mobile layout — typing area works well on tablet/mobile

## State & Data

57. [x] Clean up `usePracticeStore` from `store/index.ts` — removed unused store
58. [ ] Add session streaks tracking — track consecutive days practiced
59. [ ] Add personal best tracking — store and display best WPM, best accuracy per test type
60. [ ] Implement data export — let users export session history as JSON or CSV

## Polish & QA

61. [x] Add loading states — skeleton loaders while IndexedDB data loads
62. [ ] Add error boundaries — wrap pages in React error boundaries with fallback UI
63. [x] Add empty states — empty state designs for results page, drills page
64. [x] Add keyboard shortcut hints — "Esc to finish" shown during practice
65. [ ] Ensure all pages have proper `<title>` and meta descriptions for each route
66. [ ] Add a "How to use" or onboarding tooltip flow for first-time users
67. [ ] Audit and ensure no purple colors in the UI — replace any purple/violet tones with indigo/slate
