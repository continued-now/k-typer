import { COMMON_100 } from './common-100';
import { COMMON_1000 } from './common-1000';
import { ANTHEM_ALL_LINES, ANTHEM_TITLE } from './anthem';
import { PROVERBS } from './proverbs';
import { TONGUE_TWISTERS } from './tongue-twisters';
import { NEWS_EXCERPTS } from './news-excerpts';
import { KPOP_LYRICS } from './k-pop-lyrics';
import { TECH_VOCABULARY } from './tech-vocabulary';
import { ALL_CONVERSATIONAL_PHRASES } from './conversational';
import { FORMAL_WRITING } from './formal-writing';

export type ContentCategory = 'words' | 'sentences' | 'special' | 'vocabulary';
export type ContentDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ContentMode = 'words' | 'sentences';

export interface ContentPack {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  category: ContentCategory;
  difficulty: ContentDifficulty;
  mode: ContentMode;
  items: string[];
  wordCount: number;
}

export const CONTENT_PACKS: ContentPack[] = [
  {
    id: 'common-100',
    title: '100 Most Common Words',
    titleKo: '자주 쓰는 단어 100',
    description: 'The 100 most frequently used Korean words',
    category: 'words',
    difficulty: 'beginner',
    mode: 'words',
    items: COMMON_100,
    wordCount: COMMON_100.length,
  },
  {
    id: 'common-1000',
    title: '1000 Most Common Words',
    titleKo: '자주 쓰는 단어 1000',
    description: 'The 1000 most frequently used Korean words',
    category: 'words',
    difficulty: 'intermediate',
    mode: 'words',
    items: COMMON_1000,
    wordCount: COMMON_1000.length,
  },
  {
    id: 'anthem',
    title: 'National Anthem',
    titleKo: ANTHEM_TITLE,
    description: 'The Korean national anthem (애국가) — all verses and chorus',
    category: 'special',
    difficulty: 'intermediate',
    mode: 'sentences',
    items: ANTHEM_ALL_LINES,
    wordCount: ANTHEM_ALL_LINES.join(' ').split(/\s+/).length,
  },
  {
    id: 'proverbs',
    title: 'Korean Proverbs',
    titleKo: '속담 모음',
    description: '55 classic Korean proverbs and sayings',
    category: 'sentences',
    difficulty: 'advanced',
    mode: 'sentences',
    items: PROVERBS,
    wordCount: PROVERBS.join(' ').split(/\s+/).length,
  },
  {
    id: 'tongue-twisters',
    title: 'Tongue Twisters',
    titleKo: '잰말 놀이',
    description: 'Korean tongue twisters for speed and accuracy',
    category: 'special',
    difficulty: 'advanced',
    mode: 'sentences',
    items: TONGUE_TWISTERS,
    wordCount: TONGUE_TWISTERS.join(' ').split(/\s+/).length,
  },
  {
    id: 'news',
    title: 'News Excerpts',
    titleKo: '뉴스 기사',
    description: 'News-style sentences across economy, tech, sports, culture',
    category: 'sentences',
    difficulty: 'advanced',
    mode: 'sentences',
    items: NEWS_EXCERPTS,
    wordCount: NEWS_EXCERPTS.join(' ').split(/\s+/).length,
  },
  {
    id: 'kpop',
    title: 'K-Pop Lyrics',
    titleKo: '케이팝 가사',
    description: 'K-pop inspired lyric snippets for fun typing practice',
    category: 'sentences',
    difficulty: 'intermediate',
    mode: 'sentences',
    items: KPOP_LYRICS,
    wordCount: KPOP_LYRICS.join(' ').split(/\s+/).length,
  },
  {
    id: 'tech',
    title: 'Tech Vocabulary',
    titleKo: '기술 용어',
    description: 'Korean tech and programming terminology',
    category: 'vocabulary',
    difficulty: 'intermediate',
    mode: 'words',
    items: TECH_VOCABULARY,
    wordCount: TECH_VOCABULARY.length,
  },
  {
    id: 'conversational',
    title: 'Daily Conversation',
    titleKo: '일상 대화',
    description: 'Everyday Korean phrases for common situations',
    category: 'sentences',
    difficulty: 'beginner',
    mode: 'sentences',
    items: ALL_CONVERSATIONAL_PHRASES,
    wordCount: ALL_CONVERSATIONAL_PHRASES.join(' ').split(/\s+/).length,
  },
  {
    id: 'formal',
    title: 'Formal Writing',
    titleKo: '공식 문서',
    description: 'Business emails, official documents, academic writing',
    category: 'sentences',
    difficulty: 'advanced',
    mode: 'sentences',
    items: FORMAL_WRITING,
    wordCount: FORMAL_WRITING.join(' ').split(/\s+/).length,
  },
];

export function getContentPack(id: string): ContentPack | undefined {
  return CONTENT_PACKS.find(p => p.id === id);
}

export function getContentByDifficulty(difficulty: ContentDifficulty): ContentPack[] {
  return CONTENT_PACKS.filter(p => p.difficulty === difficulty);
}

export function getContentByCategory(category: ContentCategory): ContentPack[] {
  return CONTENT_PACKS.filter(p => p.category === category);
}
