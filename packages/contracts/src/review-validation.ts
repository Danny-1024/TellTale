import type { StoryDraft } from './course.js';

const segmenter = new Intl.Segmenter('en', { granularity: 'word' });
export const englishWords = (text: string) =>
  [...segmenter.segment(text)]
    .filter((part) => part.isWordLike)
    .map((part) => part.segment.toLowerCase());

// 成人编辑和服务端保存使用相同业务校验，错误说明定位到具体句子或题目。
export function reviewIssues(data: StoryDraft, difficulty: 'L' | 'M' | 'H'): string[] {
  const issues: string[] = [];
  const limit = { L: 8, M: 12, H: 16 }[difficulty];
  data.sentences.forEach((sentence, index) => {
    if (englishWords(sentence.en).length > limit)
      issues.push(`第${index + 1}句超过${limit}个英文词，请缩短句子。`);
    if (!sentence.en.trim() || !sentence.zh.trim())
      issues.push(`第${index + 1}句的英中内容需要填写完整。`);
  });
  if (new Set(data.words.map((word) => word.word.toLowerCase())).size !== 5)
    issues.push('5张词卡的英文词语不能重复。');
  data.words.forEach((word, index) => {
    const sentence = data.sentences[word.sentenceIndex];
    if (!sentence || !englishWords(sentence.en).includes(word.word.toLowerCase()))
      issues.push(`第${index + 1}张词卡的词语需要出现在所选原句中。`);
  });
  if (new Set(data.choice.options.map((option) => option.toLowerCase())).size !== 3)
    issues.push('选择题的3个选项不能重复。');
  if (
    data.choice.options[data.choice.correct]?.toLowerCase() !==
    data.words[data.choice.wordIndex]?.word.toLowerCase()
  )
    issues.push('选择题的正确选项需要与目标词语一致。');
  if (
    new Set(data.match.wordIndices).size !== data.match.wordIndices.length ||
    !data.match.wordIndices.every((index) => data.words[index])
  )
    issues.push('配对题需要选择2–3个不同且有效的词语。');
  const targets = new Set([data.choice.wordIndex, ...data.match.wordIndices, data.cloze.wordIndex]);
  if (targets.size < 2 || targets.size > 3) issues.push('三类练习需要共同覆盖2–3个重点词语。');
  if (
    new Set(data.cloze.options.map((option) => option.toLowerCase())).size !==
    data.cloze.options.length
  )
    issues.push('填空题的候选词不能重复。');
  const correct = data.cloze.options[data.cloze.correct];
  if (correct?.toLowerCase() !== data.words[data.cloze.wordIndex]?.word.toLowerCase())
    issues.push('填空题的正确候选词需要与目标词语一致。');
  if (
    data.cloze.sentence.split('____').length !== 2 ||
    !correct ||
    data.cloze.sentence.replace('____', correct).toLowerCase() !==
      data.sentences[data.cloze.sentenceIndex]?.en.toLowerCase()
  )
    issues.push('填空题需要一个空格，补入正确词语后必须还原所选故事原句。');
  return issues;
}
