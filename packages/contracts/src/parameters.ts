import type { Difficulty } from './schemas.js';

export const DIFFICULTY_WORD_LIMIT: Readonly<Record<Difficulty, number>> = Object.freeze({
  L: 8,
  M: 12,
  H: 16,
});
export const COURSE_LIMITS = Object.freeze({
  sentencesMinimum: 3,
  sentencesMaximum: 5,
  vocabCards: 5,
  exercises: 3,
  focusWordsMinimum: 2,
  focusWordsMaximum: 3,
  reviewWordsMaximum: 3,
});
export const SUPPORT_DEFAULTS = Object.freeze({
  showChinese: true,
  volume: 0.8,
  reduceMotion: true,
});
export const GRADE_BAND_LABELS = Object.freeze({
  '1-2': '1–2年级',
  '3-4': '3–4年级',
  '5-6': '5–6年级',
});
export const ENGLISH_START_LABELS = Object.freeze({
  new: '刚开始接触',
  words: '认识部分单词',
  sentences: '能够理解简单句',
});
