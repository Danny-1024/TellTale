import type { CourseAttempt, StoryLesson, WordPracticeResult } from '@telltale/contracts';

export function wordPracticeResults(
  lesson: StoryLesson,
  attempts: CourseAttempt[],
  events: { kind: string; targetId: string }[],
): WordPracticeResult[] {
  // 配对题的每组有独立targetId，必须按位置关联词语，不能把整题结果重复计给所有词。
  const targets = new Map<string, string>();
  for (const exercise of lesson.exercises) {
    if (exercise.type === 'match')
      exercise.left.forEach((left, index) => targets.set(left.id, exercise.targetWordIds[index]!));
    else targets.set(exercise.id, exercise.targetWordIds[0]!);
  }
  const focus = new Set(lesson.exercises.flatMap((exercise) => exercise.targetWordIds));
  return lesson.words.map((word) => {
    const history = attempts.filter((attempt) => targets.get(attempt.targetId) === word.id);
    const latest = history.at(-1);
    const status = !latest
      ? 'unpracticed'
      : latest.result === 'incorrect'
        ? 'needs_retry'
        : latest.result === 'skipped'
          ? 'skipped'
          : latest.evidence;
    return {
      wordId: word.id,
      word: word.word,
      meaning: word.meaning,
      isFocus: focus.has(word.id),
      sentenceViewed: events.some(
        (event) => event.kind === 'sentence' && event.targetId === word.sentenceId,
      ),
      cardViewed: events.some((event) => event.kind === 'word' && event.targetId === word.id),
      status,
      attempts: history,
    };
  });
}
