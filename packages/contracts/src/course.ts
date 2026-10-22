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
}

export interface CourseSummary {
  reason: 'completed' | 'early';
  sentences: number;
  words: number;
  completed: number;
  skipped: number;
  attempts: CourseAttempt[];
  suggestion: string;
}

export interface CourseJob {
  id: string;
  status: 'queued' | 'running' | 'ready' | 'failed' | 'cancelled';
  stage: string;
  error: string | null;
  attempts: number;
}

export interface CourseSnapshot {
  id: string;
  mode: 'adult' | 'child';
  phase: 'prepare' | 'review' | 'learning' | 'finished';
  kind: 'sample' | 'class';
  settings: CourseSettings;
  lesson: StoryLesson | null;
  job: CourseJob | null;
  summary: CourseSummary | null;
  expiresAt: number;
}

export interface ReviewContent {
  lesson: StoryLesson;
  answers: Record<string, string | Record<string, string>>;
  hints: Record<string, string>;
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
