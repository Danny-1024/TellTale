import type { ClassicStoryId } from '@telltale/contracts';
import type { GeneratedStory } from './content';

// 根据 1919 年版《The Aesop for Children》编排。保留故事因果，缩短句子以供独立听读。
export const CLASSIC_LESSONS = {
  'hare-tortoise': {
    sentences: [
      { en: 'A hare laughs at a slow tortoise.', zh: '一只野兔嘲笑走得慢的乌龟。' },
      { en: 'They start a race together.', zh: '它们一起开始赛跑。' },
      { en: 'The hare stops to take a nap.', zh: '野兔停下来打了个盹。' },
      { en: 'The tortoise walks past him.', zh: '乌龟从野兔身旁走过去。' },
      { en: 'The tortoise reaches the finish first.', zh: '乌龟第一个到达终点。' },
    ],
    words: [
      { word: 'hare', meaning: '野兔', sentenceIndex: 0 },
      { word: 'tortoise', meaning: '乌龟', sentenceIndex: 0 },
      { word: 'race', meaning: '赛跑', sentenceIndex: 1 },
      { word: 'nap', meaning: '小睡', sentenceIndex: 2 },
      { word: 'finish', meaning: '终点', sentenceIndex: 4 },
    ],
    choice: {
      prompt: '「乌龟」用英语怎么说？',
      options: ['hare', 'tortoise', 'race'],
      correct: 1,
      wordIndex: 1,
      hint: '想想哪只动物背着壳，走得比较慢。',
    },
    match: { wordIndices: [0, 1, 2], hint: '找出两位选手和它们参加的活动。' },
    cloze: {
      sentenceIndex: 1,
      wordIndex: 2,
      sentence: 'They start a ____ together.',
      options: ['nap', 'race', 'finish'],
      correct: 1,
      hint: '它们想比一比谁先到终点。',
    },
  },
  'lion-mouse': {
    sentences: [
      { en: 'A mouse wakes a sleeping lion.', zh: '一只小老鼠吵醒了熟睡的狮子。' },
      { en: 'The lion lets the mouse go.', zh: '狮子让小老鼠离开了。' },
      { en: 'Later, the lion gets caught in a net.', zh: '后来，狮子被一张网困住了。' },
      { en: 'The mouse bites through the rope.', zh: '小老鼠咬断了绳子。' },
      { en: 'The lion is free again.', zh: '狮子又自由了。' },
    ],
    words: [
      { word: 'mouse', meaning: '老鼠', sentenceIndex: 0 },
      { word: 'lion', meaning: '狮子', sentenceIndex: 0 },
      { word: 'net', meaning: '网', sentenceIndex: 2 },
      { word: 'rope', meaning: '绳子', sentenceIndex: 3 },
      { word: 'free', meaning: '自由的', sentenceIndex: 4 },
    ],
    choice: {
      prompt: '哪个词指困住狮子的「网」？',
      options: ['net', 'rope', 'mouse'],
      correct: 0,
      wordIndex: 2,
      hint: '它有许多网眼，把狮子罩住了。',
    },
    match: { wordIndices: [0, 1, 2], hint: '想想故事里的两只动物和困住狮子的东西。' },
    cloze: {
      sentenceIndex: 2,
      wordIndex: 2,
      sentence: 'Later, the lion gets caught in a ____.',
      options: ['rope', 'net', 'mouse'],
      correct: 1,
      hint: '第三句说的是狮子怎样被困住的。',
    },
  },
  'crow-pitcher': {
    sentences: [
      { en: 'A thirsty crow finds a pitcher.', zh: '一只口渴的乌鸦找到一个水罐。' },
      { en: 'The water is too low to reach.', zh: '水位太低，乌鸦够不着。' },
      { en: 'The crow drops pebbles into the pitcher.', zh: '乌鸦把小石子放进水罐。' },
      { en: 'With each pebble, the water rises.', zh: '每放进一颗小石子，水就升高一点。' },
      { en: 'At last, the crow can drink.', zh: '乌鸦终于喝到了水。' },
    ],
    words: [
      { word: 'thirsty', meaning: '口渴的', sentenceIndex: 0 },
      { word: 'pitcher', meaning: '水罐', sentenceIndex: 0 },
      { word: 'water', meaning: '水', sentenceIndex: 1 },
      { word: 'pebbles', meaning: '小石子', sentenceIndex: 2 },
      { word: 'drink', meaning: '喝', sentenceIndex: 4 },
    ],
    choice: {
      prompt: '「水罐」用英语怎么说？',
      options: ['pebbles', 'water', 'pitcher'],
      correct: 2,
      wordIndex: 1,
      hint: '这是乌鸦找到的容器。',
    },
    match: { wordIndices: [1, 2, 3], hint: '区分容器、里面的水和放进去的小石子。' },
    cloze: {
      sentenceIndex: 2,
      wordIndex: 3,
      sentence: 'The crow drops ____ into the pitcher.',
      options: ['pebbles', 'water', 'pitcher'],
      correct: 0,
      hint: '乌鸦放进去的是一颗又一颗的小东西。',
    },
  },
  'fox-grapes': {
    sentences: [
      { en: 'A fox sees grapes high on a vine.', zh: '一只狐狸看见葡萄藤高处挂着葡萄。' },
      { en: 'The fox jumps to reach them.', zh: '狐狸跳起来想够到葡萄。' },
      { en: 'He tries again and lands on the ground.', zh: '它又试了一次，还是落回了地上。' },
      { en: 'The fox says the grapes are sour.', zh: '狐狸说那些葡萄是酸的。' },
      { en: 'Then he walks away without tasting them.', zh: '接着，它一颗也没尝就走了。' },
    ],
    words: [
      { word: 'grapes', meaning: '葡萄', sentenceIndex: 0 },
      { word: 'vine', meaning: '藤', sentenceIndex: 0 },
      { word: 'jumps', meaning: '跳起来', sentenceIndex: 1 },
      { word: 'ground', meaning: '地面', sentenceIndex: 2 },
      { word: 'sour', meaning: '酸的', sentenceIndex: 3 },
    ],
    choice: {
      prompt: '狐狸用哪个词说葡萄是「酸的」？',
      options: ['grapes', 'vine', 'sour'],
      correct: 2,
      wordIndex: 4,
      hint: '回想第四句，找描述味道的词。',
    },
    match: { wordIndices: [0, 1, 4], hint: '找出果实、长出果实的藤，以及狐狸说的味道。' },
    cloze: {
      sentenceIndex: 0,
      wordIndex: 0,
      sentence: 'A fox sees ____ high on a vine.',
      options: ['leaves', 'flowers', 'grapes'],
      correct: 2,
      hint: '狐狸想吃的是藤上挂着的果实。',
    },
  },
} satisfies Record<ClassicStoryId, Omit<GeneratedStory, 'title' | 'titleEn'>>;
