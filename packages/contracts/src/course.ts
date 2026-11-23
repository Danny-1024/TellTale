import type { ClassicStoryId } from './classic-stories.js';

export interface StorySentence {
  id: string;
  en: string;
  zh: string;
  imageUrl: string | null;
  imageAlt: string | null;
  audioUrl: string | null;
}

export interface StoryWord {
  id: string;
  word: string;
  meaning: string;
  sentenceId: string;
  imageUrl: string | null;
}

export interface StoryOption {
  id: string;
  text: string;
}

export interface StoryExercise {
  id: string;
  type: 'choice' | 'match' | 'cloze';
  prompt: string;
  sentence: string | null;
  options: StoryOption[];
  left: StoryOption[];
  right: StoryOption[];
  targetWordIds: string[];
  replaySentenceId: string;
}

export interface StoryLesson {
  id: string;
  revision: number;
  title: string;
  titleEn: string;
  source: 'sample' | 'custom';
  classicStoryId?: ClassicStoryId;
  difficulty: 'L' | 'M' | 'H';
  sentences: StorySentence[];
  words: StoryWord[];
  exercises: StoryExercise[];
}

export interface CourseSettings {
  showChinese: boolean;
  volume: number;
  reduceMotion: boolean;
}

export interface CourseAttempt {
  id: string;
  exerciseId: string;
  targetId: string;
  result: 'correct' | 'incorrect' | 'skipped';
  evidence: 'independent' | 'supported' | 'retry' | 'skipped';
  createdAt: string;
  support?: ('hint' | 'adultHelp' | 'replay')[];
}

export interface WordPracticeResult {
  wordId: string;
  word: string;
  meaning: string;
  isFocus: boolean;
  sentenceViewed: boolean;
  cardViewed: boolean;
  status: 'unpracticed' | 'needs_retry' | 'skipped' | 'independent' | 'supported' | 'retry';
  attempts: CourseAttempt[];
}

export const wordResultLabels = {
  unpracticed: '尚未练习',
  needs_retry: '需要再试',
  skipped: '本次跳过',
  independent: '本题独立完成',
  supported: '支持下完成',
  retry: '重做后完成',
} as const;

export interface CourseSummary {
  reason: 'completed' | 'early';
  sentences: number;
  words: number;
  completed: number;
  skipped: number;
  attempts: CourseAttempt[];
  suggestion: string;
  finishedAt: string | null;
  wordResults: WordPracticeResult[];
}

export interface PracticeReport {
  lesson: StoryLesson;
  summary: CourseSummary;
  mistakes?: MistakeReview[];
}

export interface CourseJob {
  id: string;
  kind?: 'images';
  status: 'queued' | 'running' | 'ready' | 'failed' | 'cancelled';
  stage: string;
  error: string | null;
  attempts: number;
  imageProgress?: { checked: number; total: number };
  failedImage?: { kind: 'sentence' | 'word'; position: number };
}

export const TELLTALE_VERSION = '1.4.0';
export const COURSE_MEDIA_PATH = '/api/v1/course/media/';
export type IllustrationStatus = 'disabled' | 'required' | 'ready' | 'unavailable';

export interface CourseSnapshot {
  id: string;
  favoriteWordIds: string[];
  mistakes: MistakeReview[];
  mode: 'adult' | 'child';
  phase: 'prepare' | 'review' | 'learning' | 'finished';
  kind: 'sample' | 'class';
  settings: CourseSettings;
  lesson: StoryLesson | null;
  job: CourseJob | null;
  summary: CourseSummary | null;
  expiresAt: number;
}

export interface MistakeReview {
  exerciseId: string;
  targetId: string;
  reviews: number;
  lastResult: 'incorrect' | 'correct' | null;
}

export interface ReviewContent {
  lesson: StoryLesson;
  answers: Record<string, string | Record<string, string>>;
  hints: Record<string, string>;
}

export interface CourseReview extends ReviewContent {
  raw: StoryDraft | null;
  illustrations: IllustrationStatus;
}

export interface StoryDraft {
  title: string;
  titleEn: string;
  sentences: { en: string; zh: string }[];
  words: { word: string; meaning: string; sentenceIndex: number }[];
  choice: { prompt: string; options: string[]; correct: number; wordIndex: number; hint: string };
  match: { wordIndices: number[]; hint: string };
  cloze: {
    sentenceIndex: number;
    wordIndex: number;
    sentence: string;
    options: string[];
    correct: number;
    hint: string;
  };
}
