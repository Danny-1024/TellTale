import { CLASSIC_STORIES, CLASSIC_STORY_IDS } from '@telltale/contracts';

export const SAMPLE_IDS = [
  ...CLASSIC_STORY_IDS,
  'park-morning',
  'family-dinner',
  'school-day',
  'small-pet',
  'after-rain',
  'happy-weekend',
] as const;

export type SampleId = (typeof SAMPLE_IDS)[number];

export interface SampleCard {
  id: SampleId;
  theme: string;
  title: string;
  titleEn: string;
  difficulty: 'L' | 'M' | 'H';
  difficultyLabel: string;
  preview: string;
}

// 课程库标识与 Worker 一致，选书后仍由成人审核再交给孩子。
export const SAMPLE_CATALOG: SampleCard[] = [
  ...CLASSIC_STORY_IDS.map<SampleCard>((id) => ({
    id,
    theme: '经典故事',
    title: CLASSIC_STORIES[id].title,
    titleEn: CLASSIC_STORIES[id].titleEn,
    difficulty: 'L',
    difficultyLabel: '短句起步',
    preview: CLASSIC_STORIES[id].titleEn,
  })),
  {
    id: 'park-morning',
    theme: '户外',
    title: '公园的早晨',
    titleEn: 'A Morning at the Park',
    difficulty: 'L',
    difficultyLabel: '短句起步',
    preview: 'Ming and Mom go to the park.',
  },
  {
    id: 'family-dinner',
    theme: '家人',
    title: '温暖的晚饭',
    titleEn: 'A Warm Dinner',
    difficulty: 'L',
    difficultyLabel: '短句起步',
    preview: 'Ana and Mom cook rice.',
  },
  {
    id: 'school-day',
    theme: '学校',
    title: '上学的一天',
    titleEn: 'A School Day',
    difficulty: 'L',
    difficultyLabel: '短句起步',
    preview: 'Lily walks to school.',
  },
  {
    id: 'small-pet',
    theme: '动物',
    title: '我的小宠物',
    titleEn: 'My Small Pet',
    difficulty: 'L',
    difficultyLabel: '短句起步',
    preview: 'Ben has a small cat.',
  },
  {
    id: 'after-rain',
    theme: '天气',
    title: '雨后的一天',
    titleEn: 'After the Rain',
    difficulty: 'L',
    difficultyLabel: '短句起步',
    preview: 'It rains in the morning.',
  },
  {
    id: 'happy-weekend',
    theme: '家人',
    title: '开心的周末',
    titleEn: 'A Happy Weekend',
    difficulty: 'L',
    difficultyLabel: '短句起步',
    preview: 'Leo visits Grandma.',
  },
];

export function sampleById(id: string | null | undefined): SampleCard | null {
  return SAMPLE_CATALOG.find((item) => item.id === id) ?? null;
}

export function samplesByTheme(): { theme: string; items: SampleCard[] }[] {
  const themes = ['经典故事', '户外', '家人', '学校', '动物', '天气'];
  return themes.map((theme) => ({
    theme,
    items: SAMPLE_CATALOG.filter((item) => item.theme === theme),
  }));
}
