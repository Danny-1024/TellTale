import { z } from 'zod';
import type { ReviewContent, StoryLesson } from '@telltale/contracts';
import { reviewIssues } from '@telltale/contracts';

const text = z.string().trim().min(1).max(300);
const index = z.number().int().min(0).max(4);
export const generatedSchema = z.strictObject({
  title: text,
  titleEn: text,
  sentences: z
    .array(z.strictObject({ en: text, zh: text }))
    .min(3)
    .max(5),
  words: z
    .array(
      z.strictObject({
        word: z.string().regex(/^[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/),
        meaning: text,
        sentenceIndex: index,
      }),
    )
    .length(5),
  choice: z.strictObject({
    prompt: text,
    options: z.array(text).length(3),
    correct: z.number().int().min(0).max(2),
    wordIndex: index,
    hint: text,
  }),
  match: z.strictObject({ wordIndices: z.array(index).min(2).max(3), hint: text }),
  cloze: z.strictObject({
    sentenceIndex: index,
    wordIndex: index,
    sentence: text,
    options: z.array(text).min(2).max(3),
    correct: z.number().int().min(0).max(2),
    hint: text,
  }),
});
export type GeneratedStory = z.infer<typeof generatedSchema>;
const wordLimits = { L: 8, M: 12, H: 16 };
const segmenter = new Intl.Segmenter('en', { granularity: 'word' });
const tokens = (s: string) =>
  [...segmenter.segment(s)]
    .filter((part) => part.isWordLike)
    .map((part) => part.segment.toLowerCase());

export function createContent(
  input: unknown,
  difficulty: 'L' | 'M' | 'H',
  source: 'sample' | 'custom',
): ReviewContent {
  const data = generatedSchema.parse(input);
  const issues = reviewIssues(data, difficulty);
  if (issues.length) throw new Error(`CONTENT_INVALID: ${issues.join('；')}`);
  const require = (valid: boolean, reason: string) => {
    if (!valid) throw new Error(`CONTENT_INVALID: ${reason}`);
  };
  require(new Set(data.words.map((w) => w.word.toLowerCase())).size === 5, 'duplicate words');
  for (const sentence of data.sentences)
    require(tokens(sentence.en).length <= wordLimits[difficulty], 'sentence word limit');
  for (const word of data.words) {
    const sentence = data.sentences[word.sentenceIndex];
    require(Boolean(
      sentence && tokens(sentence.en).includes(word.word.toLowerCase()),
    ), 'word must occur in referenced sentence');
  }
  require(new Set(data.match.wordIndices).size ===
    data.match.wordIndices.length, 'duplicate matching words');
  require(data.match.wordIndices.every((i) => Boolean(data.words[i])), 'matching word index');
  const targetCount = new Set([
    data.choice.wordIndex,
    ...data.match.wordIndices,
    data.cloze.wordIndex,
  ]).size;
  require(targetCount >= 2 && targetCount <= 3, 'exercises require two or three target words');
  require(new Set(data.choice.options).size === 3, 'duplicate choices');
  require(data.choice.options[data.choice.correct]?.toLowerCase() ===
    data.words[data.choice.wordIndex]?.word.toLowerCase(), 'choice target mismatch');
  require(new Set(data.cloze.options).size ===
    data.cloze.options.length, 'duplicate cloze options');
  const clozeWord = data.words[data.cloze.wordIndex];
  require(data.cloze.options[data.cloze.correct]?.toLowerCase() ===
    clozeWord?.word.toLowerCase(), 'cloze target mismatch');
  require(data.cloze.sentence.split('____').length === 2, 'one blank required');
  const restored = data.cloze.sentence.replace(
    '____',
    data.cloze.options[data.cloze.correct] ?? '',
  );
  require(restored.toLowerCase() ===
    data.sentences[
      data.cloze.sentenceIndex
    ]?.en.toLowerCase(), 'cloze must reference exact story sentence');
  const lesson: StoryLesson = {
    id: crypto.randomUUID(),
    revision: 1,
    title: data.title,
    titleEn: data.titleEn,
    source,
    difficulty,
    sentences: data.sentences.map((s) => ({
      ...s,
      id: crypto.randomUUID(),
      imageUrl: null,
      imageAlt: null,
      audioUrl: null,
    })),
    words: [],
    exercises: [],
  };
  lesson.words = data.words.map((word) => ({
    id: crypto.randomUUID(),
    word: word.word,
    meaning: word.meaning,
    sentenceId: lesson.sentences[word.sentenceIndex]!.id,
    imageUrl: null,
  }));
  const choiceOptions = data.choice.options.map((value) => ({
    id: crypto.randomUUID(),
    text: value,
  }));
  const clozeOptions = data.cloze.options.map((value) => ({
    id: crypto.randomUUID(),
    text: value,
  }));
  const left = data.match.wordIndices.map((i) => ({
    id: crypto.randomUUID(),
    text: data.words[i]!.word,
  }));
  const right = data.match.wordIndices.map((i) => ({
    id: crypto.randomUUID(),
    text: data.words[i]!.meaning,
  }));
  const choiceId = crypto.randomUUID(),
    matchId = crypto.randomUUID(),
    clozeId = crypto.randomUUID();
  lesson.exercises = [
    {
      id: choiceId,
      type: 'choice',
      prompt: data.choice.prompt,
      sentence: null,
      options: choiceOptions,
      left: [],
      right: [],
      targetWordIds: [lesson.words[data.choice.wordIndex]!.id],
      replaySentenceId: lesson.words[data.choice.wordIndex]!.sentenceId,
    },
    {
      id: matchId,
      type: 'match',
      prompt: '把英语和中文配在一起。',
      sentence: null,
      options: [],
      left,
      right: [...right].reverse(),
      targetWordIds: data.match.wordIndices.map((i) => lesson.words[i]!.id),
      replaySentenceId: lesson.words[data.match.wordIndices[0]!]!.sentenceId,
    },
    {
      id: clozeId,
      type: 'cloze',
      prompt: '选择一个词，补全故事里的句子。',
      sentence: data.cloze.sentence,
      options: clozeOptions,
      left: [],
      right: [],
      targetWordIds: [lesson.words[data.cloze.wordIndex]!.id],
      replaySentenceId: lesson.sentences[data.cloze.sentenceIndex]!.id,
    },
  ];
  return {
    lesson,
    answers: {
      [choiceId]: choiceOptions[data.choice.correct]!.id,
      [matchId]: Object.fromEntries(left.map((item, i) => [item.id, right[i]!.id])),
      [clozeId]: clozeOptions[data.cloze.correct]!.id,
    },
    hints: { [choiceId]: data.choice.hint, [matchId]: data.match.hint, [clozeId]: data.cloze.hint },
  };
}

export const SAMPLE_IDS = [
  'park-morning',
  'family-dinner',
  'school-day',
  'small-pet',
  'after-rain',
  'happy-weekend',
] as const;

export type SampleId = (typeof SAMPLE_IDS)[number];

// 每个示例的选择、配对和填空共同覆盖 2–3 个词语。
const SAMPLE_STORIES: Record<SampleId, { difficulty: 'L' | 'M' | 'H'; story: unknown }> = {
  'park-morning': {
    difficulty: 'L',
    story: {
      title: '公园的早晨',
      titleEn: 'A Morning at the Park',
      sentences: [
        { en: 'Ming and Mom go to the park.', zh: '小明和妈妈去公园。' },
        { en: 'They see a little dog.', zh: '他们看见一只小狗。' },
        { en: 'The dog runs after a ball.', zh: '小狗去追球。' },
        { en: 'Ming picks up the ball.', zh: '小明把球捡起来。' },
        { en: 'The dog wags its tail.', zh: '小狗摇摇尾巴。' },
      ],
      words: [
        { word: 'park', meaning: '公园', sentenceIndex: 0 },
        { word: 'mom', meaning: '妈妈', sentenceIndex: 0 },
        { word: 'dog', meaning: '狗', sentenceIndex: 1 },
        { word: 'ball', meaning: '球', sentenceIndex: 2 },
        { word: 'tail', meaning: '尾巴', sentenceIndex: 4 },
      ],
      choice: {
        prompt: '「公园」用英语怎么说？',
        options: ['ball', 'park', 'tail'],
        correct: 1,
        wordIndex: 0,
        hint: '想想故事开头有草地和树的地方。',
      },
      match: { wordIndices: [2, 3], hint: '可以先找追着球跑的小动物。' },
      cloze: {
        sentenceIndex: 2,
        wordIndex: 3,
        sentence: 'The dog runs after a ____.',
        options: ['dog', 'ball', 'park'],
        correct: 1,
        hint: '小狗追着一个可以滚动的玩具。',
      },
    },
  },
  'family-dinner': {
    difficulty: 'L',
    story: {
      title: '温暖的晚饭',
      titleEn: 'A Warm Dinner',
      sentences: [
        { en: 'Ana and Mom cook rice.', zh: '安娜和妈妈做米饭。' },
        { en: 'The kitchen is warm.', zh: '厨房很温暖。' },
        { en: 'Dad sets the table.', zh: '爸爸摆好餐桌。' },
        { en: 'Grandma tells a story.', zh: '奶奶讲了一个故事。' },
        { en: 'They eat and smile together.', zh: '他们一起吃饭，一起微笑。' },
      ],
      words: [
        { word: 'cook', meaning: '做饭', sentenceIndex: 0 },
        { word: 'kitchen', meaning: '厨房', sentenceIndex: 1 },
        { word: 'table', meaning: '桌子', sentenceIndex: 2 },
        { word: 'story', meaning: '故事', sentenceIndex: 3 },
        { word: 'smile', meaning: '微笑', sentenceIndex: 4 },
      ],
      choice: {
        prompt: '「厨房」用英语怎么说？',
        options: ['table', 'kitchen', 'smile'],
        correct: 1,
        wordIndex: 1,
        hint: '做饭的地方就是它。',
      },
      match: { wordIndices: [0, 2], hint: '先找做饭的动作，再找吃饭用的桌子。' },
      cloze: {
        sentenceIndex: 2,
        wordIndex: 2,
        sentence: 'Dad sets the ____.',
        options: ['story', 'table', 'kitchen'],
        correct: 1,
        hint: '吃饭前要先把桌子放好。',
      },
    },
  },
  'school-day': {
    difficulty: 'L',
    story: {
      title: '上学的一天',
      titleEn: 'A School Day',
      sentences: [
        { en: 'Lily walks to school.', zh: '莉莉走去学校。' },
        { en: 'She reads a new book.', zh: '她读一本新书。' },
        { en: 'Her friend draws a cat.', zh: '她的朋友画了一只猫。' },
        { en: 'The teacher says, "Good job!"', zh: '老师说：“做得很好！”' },
        { en: 'They play in the yard.', zh: '他们在院子里玩耍。' },
      ],
      words: [
        { word: 'school', meaning: '学校', sentenceIndex: 0 },
        { word: 'book', meaning: '书', sentenceIndex: 1 },
        { word: 'cat', meaning: '猫', sentenceIndex: 2 },
        { word: 'teacher', meaning: '老师', sentenceIndex: 3 },
        { word: 'play', meaning: '玩耍', sentenceIndex: 4 },
      ],
      choice: {
        prompt: '「老师」用英语怎么说？',
        options: ['teacher', 'book', 'school'],
        correct: 0,
        wordIndex: 3,
        hint: '课堂里帮助我们学习的人。',
      },
      match: { wordIndices: [1, 2], hint: '一本可以读的书，一只会画出来的猫。' },
      cloze: {
        sentenceIndex: 1,
        wordIndex: 1,
        sentence: 'She reads a new ____.',
        options: ['cat', 'book', 'play'],
        correct: 1,
        hint: '可以一页一页读的东西。',
      },
    },
  },
  'small-pet': {
    difficulty: 'L',
    story: {
      title: '我的小宠物',
      titleEn: 'My Small Pet',
      sentences: [
        { en: 'Ben has a small cat.', zh: '本有一只小猫。' },
        { en: 'The cat drinks milk.', zh: '小猫喝牛奶。' },
        { en: 'Ben feeds the fish.', zh: '本喂小鱼。' },
        { en: 'The cat sleeps on the bed.', zh: '小猫在床上睡觉。' },
        { en: 'Ben gives it a soft hug.', zh: '本轻轻地抱抱它。' },
      ],
      words: [
        { word: 'cat', meaning: '猫', sentenceIndex: 0 },
        { word: 'milk', meaning: '牛奶', sentenceIndex: 1 },
        { word: 'fish', meaning: '鱼', sentenceIndex: 2 },
        { word: 'bed', meaning: '床', sentenceIndex: 3 },
        { word: 'hug', meaning: '拥抱', sentenceIndex: 4 },
      ],
      choice: {
        prompt: '「牛奶」用英语怎么说？',
        options: ['milk', 'fish', 'bed'],
        correct: 0,
        wordIndex: 1,
        hint: '小猫喝的白色饮品。',
      },
      match: { wordIndices: [2, 3], hint: '一条水里的小鱼，一个软软的睡觉地方。' },
      cloze: {
        sentenceIndex: 2,
        wordIndex: 2,
        sentence: 'Ben feeds the ____.',
        options: ['milk', 'fish', 'bed'],
        correct: 1,
        hint: '本喂的是水里的小动物。',
      },
    },
  },
  'after-rain': {
    difficulty: 'L',
    story: {
      title: '雨后的一天',
      titleEn: 'After the Rain',
      sentences: [
        { en: 'It rains in the morning.', zh: '早上下雨了。' },
        { en: 'Ana opens her umbrella.', zh: '安娜打开雨伞。' },
        { en: 'She jumps over a puddle.', zh: '她跳过一个水坑。' },
        { en: 'The sun comes out.', zh: '太阳出来了。' },
        { en: 'She sees a rainbow.', zh: '她看见一道彩虹。' },
      ],
      words: [
        { word: 'rains', meaning: '下雨', sentenceIndex: 0 },
        { word: 'umbrella', meaning: '雨伞', sentenceIndex: 1 },
        { word: 'puddle', meaning: '水坑', sentenceIndex: 2 },
        { word: 'sun', meaning: '太阳', sentenceIndex: 3 },
        { word: 'rainbow', meaning: '彩虹', sentenceIndex: 4 },
      ],
      choice: {
        prompt: '「彩虹」用英语怎么说？',
        options: ['sun', 'rainbow', 'puddle'],
        correct: 1,
        wordIndex: 4,
        hint: '雨后天上有七种颜色。',
      },
      match: { wordIndices: [1, 3], hint: '下雨时打开，天晴时出现。' },
      cloze: {
        sentenceIndex: 3,
        wordIndex: 3,
        sentence: 'The ____ comes out.',
        options: ['umbrella', 'rainbow', 'sun'],
        correct: 2,
        hint: '雨停以后，天上亮起来。',
      },
    },
  },
  'happy-weekend': {
    difficulty: 'L',
    story: {
      title: '开心的周末',
      titleEn: 'A Happy Weekend',
      sentences: [
        { en: 'Leo visits Grandma.', zh: '利奥去看奶奶。' },
        { en: 'They make a cake.', zh: '他们做了一个蛋糕。' },
        { en: 'Leo reads a story.', zh: '利奥读了一个故事。' },
        { en: 'Grandma sings a song.', zh: '奶奶唱了一首歌。' },
        { en: 'Leo draws a picture.', zh: '利奥画了一幅画。' },
      ],
      words: [
        { word: 'grandma', meaning: '奶奶', sentenceIndex: 0 },
        { word: 'cake', meaning: '蛋糕', sentenceIndex: 1 },
        { word: 'story', meaning: '故事', sentenceIndex: 2 },
        { word: 'song', meaning: '歌', sentenceIndex: 3 },
        { word: 'picture', meaning: '画', sentenceIndex: 4 },
      ],
      choice: {
        prompt: '「蛋糕」用英语怎么说？',
        options: ['cake', 'song', 'picture'],
        correct: 0,
        wordIndex: 1,
        hint: '甜甜的、可以分享的食物。',
      },
      match: { wordIndices: [2, 3], hint: '可以读的故事，也可以唱一首歌。' },
      cloze: {
        sentenceIndex: 2,
        wordIndex: 2,
        sentence: 'Leo reads a ____.',
        options: ['cake', 'story', 'song'],
        correct: 1,
        hint: '可以一页一页读的东西。',
      },
    },
  },
};

export function sampleContent(sampleId: SampleId = 'park-morning'): ReviewContent {
  const sample = SAMPLE_STORIES[sampleId]!;
  const content = createContent(sample.story, sample.difficulty, 'sample');
  const knownWords = new Set(['park', 'mom', 'dog', 'ball', 'tail']);
  content.lesson.words.forEach((word) => {
    if (knownWords.has(word.word)) word.imageUrl = `/spots/${word.word}.svg`;
  });
  if (sampleId === 'park-morning') {
    content.lesson.sentences.forEach((sentence, index) => {
      const part = String(index + 1).padStart(2, '0');
      sentence.imageUrl = `/samples/park-morning/images/${part}.svg`;
      sentence.imageAlt = sentence.zh;
      sentence.audioUrl = `/samples/park-morning/audio/${part}.wav`;
    });
  } else {
    // 其他静态示例暂不提供录制的示例音频；本地朗读会作为可选声音支持。
    content.lesson.sentences[0]!.imageUrl = `/samples/${sampleId}/scene.svg`;
    content.lesson.sentences[0]!.imageAlt = content.lesson.sentences[0]!.zh;
  }
  return content;
}
