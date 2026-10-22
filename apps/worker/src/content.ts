import { z } from 'zod';
import type { ReviewContent, StoryLesson } from '@telltale/contracts';

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

export function sampleContent(): ReviewContent {
  const content = createContent(
    {
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
    'L',
    'sample',
  );
  content.lesson.sentences.forEach((s, i) => {
    const part = String(i + 1).padStart(2, '0');
    s.imageUrl = `/samples/park-morning/images/${part}.svg`;
    s.imageAlt = s.zh;
    s.audioUrl = `/samples/park-morning/audio/${part}.wav`;
  });
  content.lesson.words.forEach((w) => {
    w.imageUrl = `/spots/${w.word}.svg`;
  });
  return content;
}
