import { sampleById, type SampleId } from './sampleCatalog';

export const REVIEW_TABS = [
  ['story', '故事'],
  ['words', '词卡'],
  ['exercises', '练习'],
  ['focus', '重点词'],
] as const;

export type ReviewTab = (typeof REVIEW_TABS)[number][0];

export const STORY_PROMPTS = [
  ['人物', '人物：'],
  ['地点', '地点：'],
  ['事件', '一件小事：'],
  ['心情', '心情：'],
  ['结尾', '结尾：'],
] as const;

// 已有同一提示时不重复插入，避免成人确认前的故事被提示词撑乱。
export function appendStoryPrompt(story: string, label: string): string {
  if (story.includes(label)) return story;
  const prefix = story && !story.endsWith('\n') ? '\n' : '';
  return `${story}${prefix}${label}`;
}

// 句子导航停在第一句和最后一句，不绕回。
export function adjacentSentence(
  current: number,
  length: number,
  direction: -1 | 1,
): number | null {
  if (length <= 0) return null;
  const next = current + direction;
  if (next < 0 || next >= length) return null;
  return next;
}

// 首页用 sample 指定示例；mode=custom 进入自编故事。未知示例不改变默认选择。
export function courseEntry(query: { sample?: unknown; mode?: unknown }): {
  chosen: 'sample' | 'custom';
  sampleId: SampleId | null;
} {
  const sample = sampleById(typeof query.sample === 'string' ? query.sample : null);
  if (sample) return { chosen: 'sample', sampleId: sample.id };
  if (query.mode === 'custom') return { chosen: 'custom', sampleId: null };
  return { chosen: 'custom', sampleId: null };
}
