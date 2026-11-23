export const AESOP_EDITION_URL = 'https://www.loc.gov/item/19014083/';
export const AESOP_ART_CREDIT = 'Milo Winter · 1919';

// 首页、成人审核与 Worker 使用同一组故事标识和书名。
export const CLASSIC_STORIES = {
  'hare-tortoise': {
    title: '龟兔赛跑',
    titleEn: 'The Hare and the Tortoise',
    sourceUrl: 'https://read.gov/aesop/025.html',
    artworkUrl:
      'https://commons.wikimedia.org/wiki/File:The_Tortoise_and_the_Hare_-_Project_Gutenberg_etext_19994.jpg',
  },
  'lion-mouse': {
    title: '狮子和老鼠',
    titleEn: 'The Lion and the Mouse',
    sourceUrl: 'https://read.gov/aesop/007.html',
    artworkUrl:
      'https://commons.wikimedia.org/wiki/File:The_Lion_and_the_Mouse_-_Project_Gutenberg_etext_19994.jpg',
  },
  'crow-pitcher': {
    title: '乌鸦喝水',
    titleEn: 'The Crow and the Pitcher',
    sourceUrl: 'https://read.gov/aesop/012.html',
    artworkUrl:
      'https://commons.wikimedia.org/wiki/File:The_Crow_and_the_Pitcher_-_Project_Gutenberg_etext_19994.jpg',
  },
  'fox-grapes': {
    title: '狐狸和葡萄',
    titleEn: 'The Fox and the Grapes',
    sourceUrl: 'https://read.gov/aesop/005.html',
    artworkUrl:
      'https://commons.wikimedia.org/wiki/File:The_Fox_and_the_Grapes_-_Project_Gutenberg_etext_19994.jpg',
  },
} as const;

export type ClassicStoryId = keyof typeof CLASSIC_STORIES;
export const CLASSIC_STORY_IDS = Object.keys(CLASSIC_STORIES) as ClassicStoryId[];

export function isClassicStoryId(id: string | null | undefined): id is ClassicStoryId {
  return typeof id === 'string' && Object.hasOwn(CLASSIC_STORIES, id);
}

export function classicArtwork(id: ClassicStoryId) {
  return `/stories/${id}.jpg`;
}
