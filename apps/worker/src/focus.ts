import type { ReviewContent, StoryDraft } from '@telltale/contracts';
import { createContent } from './content';
import { HttpError } from './security';

// 练习取材于当前词卡和原句；重点调整不调用模型，也不改写成人已检查的故事。
export function focusExercises(content: ReviewContent, raw: StoryDraft, ids: string[]) {
  const indices = ids.map((id) => content.lesson.words.findIndex((word) => word.id === id));
  if (indices.some((index) => index < 0))
    throw new HttpError(400, 'FOCUS_INVALID', '请选择当前故事中的词语。');
  const meanings = indices.map((index) => raw.words[index]!.meaning.trim());
  if (new Set(meanings).size !== meanings.length)
    throw new HttpError(422, 'FOCUS_AMBIGUOUS', '重点词的中文释义相同，请修改词义后重新选择。');
  const choiceIndex = indices[0]!;
  const clozeIndex = indices[indices.length - 1]!;
  const choiceWord = raw.words[choiceIndex]!;
  const clozeWord = raw.words[clozeIndex]!;
  const sentence = raw.sentences[clozeWord.sentenceIndex]!.en;
  const match = [...new Intl.Segmenter('en', { granularity: 'word' }).segment(sentence)].find(
    (part) => part.isWordLike && part.segment.toLowerCase() === clozeWord.word.toLowerCase(),
  );
  if (!match) throw new HttpError(422, 'FOCUS_INVALID', '重点词需要出现在对应原句中。');
  const options = (index: number) =>
    [raw.words[index]!, ...raw.words.filter((_, i) => i !== index).slice(0, 2)]
      .map((word) => word.word)
      .sort((a, b) => a.localeCompare(b));
  const choiceOptions = options(choiceIndex),
    clozeOptions = options(clozeIndex);
  const draft: StoryDraft = {
    ...structuredClone(raw),
    choice: {
      wordIndex: choiceIndex,
      prompt: `「${choiceWord.meaning}」用英语怎么说？`,
      options: choiceOptions,
      correct: choiceOptions.indexOf(choiceWord.word),
      hint: '回到故事原句，想想这个词的意思。',
    },
    match: { wordIndices: indices, hint: '按照故事里的意思，把英文和中文配在一起。' },
    cloze: {
      wordIndex: clozeIndex,
      sentenceIndex: clozeWord.sentenceIndex,
      sentence:
        sentence.slice(0, match.index) +
        '____' +
        sentence.slice(match.index + match.segment.length),
      options: clozeOptions,
      correct: clozeOptions.indexOf(clozeWord.word),
      hint: '对照故事原句，选择原来使用的词语。',
    },
  };
  const updated = createContent(draft, content.lesson.difficulty, 'custom');
  const wordIds = new Map(
    updated.lesson.words.map((word, index) => [word.id, content.lesson.words[index]!.id]),
  );
  const sentenceIds = new Map(
    updated.lesson.sentences.map((line, index) => [line.id, content.lesson.sentences[index]!.id]),
  );
  for (const exercise of updated.lesson.exercises) {
    exercise.targetWordIds = exercise.targetWordIds.map((id) => wordIds.get(id)!);
    exercise.replaySentenceId = sentenceIds.get(exercise.replaySentenceId)!;
  }
  updated.lesson = {
    ...content.lesson,
    revision: content.lesson.revision + 1,
    exercises: updated.lesson.exercises,
  };
  return { content: updated, raw: draft };
}
