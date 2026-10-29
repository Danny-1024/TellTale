import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import type { CourseSnapshot, ReviewContent, StoryDraft, CourseAttempt } from '@telltale/contracts';
import { inspectStoryInput, reviewIssues } from '@telltale/contracts';
import * as api from './api';
import { LessonAudio, renderBook, renderPracticeReport } from './media';

export function useCourse() {
  const stage = ref('home');
  const session = ref<CourseSnapshot | null>(null);
  const review = ref<(ReviewContent & { raw: StoryDraft | null }) | null>(null);
  const busy = ref(false),
    error = ref(''),
    loading = ref(true),
    playing = ref(false);
  const pin = ref(''),
    confirmationPin = ref(''),
    unlockPin = ref('');
  const chosen = ref<'sample' | 'custom'>('custom');
  const story = ref(''),
    confirmed = ref(false),
    difficulty = ref<'L' | 'M' | 'H'>('L');
  const checks = ref([false, false, false, false, false]);
  const focusWordIds = ref<string[]>([]);
  const savedFocus = computed(() => [
    ...new Set(review.value?.lesson.exercises.flatMap((item) => item.targetWordIds) ?? []),
  ]);
  const focusChanged = computed(
    () => [...focusWordIds.value].sort().join(',') !== [...savedFocus.value].sort().join(','),
  );
  const editIssues = computed(() =>
    review.value?.raw ? reviewIssues(review.value.raw, review.value.lesson.difficulty) : [],
  );
  const settings = ref({ showChinese: true, volume: 0.8, reduceMotion: true });
  const sentenceIndex = ref(0),
    exerciseIndex = ref(0),
    wordIndex = ref<number | null>(null);
  const selected = ref<string | null>(null),
    leftId = ref<string | null>(null);
  const resolved = ref<Record<string, 'correct' | 'skipped'>>({});
  const feedback = ref(''),
    hint = ref(''),
    lastAttempt = ref<CourseAttempt | null>(null);
  const dialog = ref<'help' | 'adult' | 'end' | 'privacy' | 'guide' | 'close' | null>(null);
  const returnStage = ref('listen'),
    bookUrl = ref(''),
    reportUrl = ref('');
  function clearExports() {
    if (bookUrl.value) URL.revokeObjectURL(bookUrl.value);
    if (reportUrl.value) URL.revokeObjectURL(reportUrl.value);
    bookUrl.value = '';
    reportUrl.value = '';
  }
  const audio = new LessonAudio((value) => {
    playing.value = value;
  });
  let interval: ReturnType<typeof setInterval> | undefined;
  let polling = false;
  const lesson = computed(() => session.value?.lesson ?? null);
  const sentence = computed(() => lesson.value?.sentences[sentenceIndex.value] ?? null);
  const word = computed(() =>
    wordIndex.value === null ? null : (lesson.value?.words[wordIndex.value] ?? null),
  );
  const exercise = computed(() => lesson.value?.exercises[exerciseIndex.value] ?? null);
  const targetId = computed(() =>
    exercise.value?.type === 'match' ? leftId.value : exercise.value?.id,
  );
  const targets = computed(() =>
    exercise.value?.type === 'match'
      ? exercise.value.left.map((item) => item.id)
      : [exercise.value?.id ?? ''],
  );
  const exerciseDone = computed(() => targets.value.every((id) => resolved.value[id]));
  const storyInput = computed(() => inspectStoryInput(story.value));
  const count = computed(() => storyInput.value.count);
  const inputIssue = computed(() => storyInput.value.issue);
  const progress = computed(() =>
    stage.value === 'listen'
      ? `第 ${sentenceIndex.value + 1} 句 / 共 ${lesson.value?.sentences.length ?? 0} 句`
      : stage.value === 'practice'
        ? `练习 ${exerciseIndex.value + 1} / 3`
        : stage.value === 'rest'
          ? '休息时间'
          : stage.value === 'summary' || stage.value === 'book'
            ? '本课完成'
            : '跟着自己的节奏',
  );
  const isChild = computed(() =>
    ['cover', 'listen', 'practice', 'rest', 'summary', 'book'].includes(stage.value),
  );
  async function act(operation: () => Promise<void>) {
    if (busy.value) return;
    busy.value = true;
    error.value = '';
    try {
      await operation();
    } catch (cause) {
      error.value =
        cause instanceof api.ApiError
          ? cause.message
          : cause instanceof Error
            ? cause.message
            : '操作失败，请重试。';
      if (!(cause instanceof api.ApiError)) console.error(cause);
      if (cause instanceof api.ApiError && cause.status === 401) {
        clearExports();
        audio.stop();
        session.value = null;
        stage.value = 'expired';
      }
    } finally {
      busy.value = false;
    }
  }
  function move(next: string) {
    audio.stop();
    stage.value = next;
  }
  async function openReview() {
    review.value = await api.getReview();
    focusWordIds.value = [...savedFocus.value];
    checks.value = [false, false, false, false, false];
    move('review');
  }
  async function apply(result: api.CourseResult, fromRefresh = false) {
    // 旧版本完成回执升级时，重新读取服务端逐词投影，保留真实原始记录。
    if (result.session.summary && !result.session.summary.wordResults)
      result = await api.loadSession();
    session.value = result.session;
    settings.value = { ...result.session.settings };
    if (fromRefresh && result.session.mode === 'child') {
      move('recover');
      return;
    }
    if (result.session.phase === 'review') await openReview();
    else if (result.session.job && ['running', 'queued'].includes(result.session.job.status))
      move('waiting');
    else if (result.session.phase === 'finished') move('summary');
    else move('choose');
  }
  async function create() {
    await act(async () => {
      if (!/^\d{6}$/.test(pin.value) || pin.value !== confirmationPin.value)
        throw new Error('请填写两次相同的6位成人口令。');
      await apply(await api.createSession(pin.value, settings.value));
      pin.value = '';
      confirmationPin.value = '';
    });
  }
  async function chooseStory() {
    await act(async () => {
      if (chosen.value === 'sample') await apply(await api.command('sample'));
      else {
        confirmed.value = false;
        move('input');
      }
    });
  }
  async function generate() {
    await act(async () => {
      if (inputIssue.value)
        throw new api.ApiError(400, inputIssue.value.code, inputIssue.value.message);
      if (!confirmed.value)
        throw new api.ApiError(400, 'CONFIRMATION_REQUIRED', '请检查全文并确认发送。');
      await apply(
        await api.command('generate', {
          source: storyInput.value.source,
          difficulty: difficulty.value,
          confirmed: confirmed.value,
        }),
      );
    });
  }
  async function cancelGeneration() {
    await act(async () => {
      session.value = (await api.command('cancel', { jobId: session.value?.job?.id })).session;
      move('input');
    });
  }
  async function saveEdits() {
    await act(async () => {
      if (editIssues.value.length) throw new Error(editIssues.value.join('；'));
      await apply(
        await api.command('edit', {
          revision: review.value!.lesson.revision,
          raw: review.value!.raw,
        }),
      );
    });
  }
  async function saveFocus() {
    await act(async () => {
      await apply(
        await api.command('focus', {
          revision: review.value!.lesson.revision,
          wordIds: focusWordIds.value,
        }),
      );
    });
  }
  async function start() {
    await act(async () => {
      const result = await api.command('approve', {
        revision: review.value!.lesson.revision,
        checks: checks.value,
        settings: settings.value,
      });
      session.value = result.session;
      clearExports();
      review.value = null;
      story.value = '';
      checks.value.fill(false);
      sentenceIndex.value = 0;
      exerciseIndex.value = 0;
      wordIndex.value = null;
      resolved.value = {};
      hint.value = '';
      selected.value = null;
      leftId.value = null;
      lastAttempt.value = null;
      move('cover');
    });
  }
  async function visitSentence(index: number) {
    await act(async () => {
      audio.stop();
      wordIndex.value = null;
      const current = lesson.value!.sentences[index]!;
      await api.recordEvent('sentence', current.id);
      sentenceIndex.value = index;
      move('listen');
    });
  }
  async function showWord(index: number | null) {
    await act(async () => {
      audio.stop();
      if (index !== null) await api.recordEvent('word', lesson.value!.words[index]!.id);
      wordIndex.value = index;
    });
  }
  async function toggleAudio(url: string | null, isReplay = false) {
    if (playing.value) {
      audio.stop();
      return;
    }
    await act(async () => {
      if (!url) return;
      if (isReplay && exercise.value) await api.recordEvent('replay', exercise.value.id);
      await audio.play(url, settings.value.volume);
    });
  }
  function resetQuestion() {
    selected.value = null;
    leftId.value = null;
    feedback.value = '';
    hint.value = '';
    lastAttempt.value = null;
  }
  function practice() {
    audio.stop();
    resetQuestion();
    move('practice');
  }
  async function answer(skip = false) {
    await act(async () => {
      if (!exercise.value || !targetId.value) throw new Error('请先选择一个英文词。');
      const result = await api.submitAnswer({
        revision: lesson.value!.revision,
        exerciseId: exercise.value.id,
        leftId: exercise.value.type === 'match' ? leftId.value : null,
        optionId: skip ? null : selected.value,
        skip,
      });
      lastAttempt.value = result.attempt;
      feedback.value = result.message;
      if (result.attempt.result !== 'incorrect')
        resolved.value[result.attempt.targetId] = result.attempt.result;
      if (exercise.value.type === 'match' && result.attempt.result !== 'incorrect') {
        leftId.value = null;
        selected.value = null;
      }
    });
  }
  function retry() {
    if (targetId.value) delete resolved.value[targetId.value];
    selected.value = null;
    feedback.value = '';
    lastAttempt.value = null;
  }
  async function showHint() {
    await act(async () => {
      if (!exercise.value) return;
      const result = await api.recordEvent('hint', exercise.value.id);
      hint.value = result.hint ?? '';
      dialog.value = null;
    });
  }
  async function adultHelp() {
    await act(async () => {
      if (stage.value === 'practice' && exercise.value)
        await api.recordEvent('adultHelp', exercise.value.id);
      feedback.value = '可以请身边的成人陪你看一看。';
      dialog.value = null;
    });
  }
  async function rest() {
    audio.stop();
    await act(async () => {
      await api.recordEvent('rest', '');
      returnStage.value = stage.value;
      move('rest');
    });
  }
  function resume() {
    move(returnStage.value);
  }
  async function finish(reason: 'completed' | 'early') {
    audio.stop();
    await act(async () => {
      await apply(await api.command('finish', { reason }));
      dialog.value = null;
      move('summary');
    });
  }
  async function nextQuestion() {
    if (exerciseIndex.value < 2) {
      exerciseIndex.value += 1;
      resetQuestion();
    } else await finish('completed');
  }
  async function unlockAdult() {
    await act(async () => {
      const result = await api.unlock(unlockPin.value);
      unlockPin.value = '';
      dialog.value = null;
      await apply(result);
    });
  }
  async function makeBook() {
    if (session.value?.mode !== 'adult') {
      dialog.value = 'adult';
      return;
    }
    await act(async () => {
      if (bookUrl.value) URL.revokeObjectURL(bookUrl.value);
      const blob = await renderBook(lesson.value!);
      bookUrl.value = URL.createObjectURL(blob);
      move('book');
    });
  }
  async function makeReport() {
    if (session.value?.mode !== 'adult') {
      dialog.value = 'adult';
      return;
    }
    await act(async () => {
      const report = await api.getReport();
      const blob = await renderPracticeReport(report);
      if (reportUrl.value) URL.revokeObjectURL(reportUrl.value);
      reportUrl.value = URL.createObjectURL(blob);
      move('report');
    });
  }
  async function close() {
    await act(async () => {
      await api.closeSession();
      session.value = null;
      review.value = null;
      story.value = '';
      dialog.value = null;
      clearExports();
      move('home');
    });
  }
  async function background() {
    if (document.hidden) audio.stop();
    else if (session.value && stage.value !== 'recover') {
      try {
        await api.heartbeat();
      } catch (cause) {
        error.value = cause instanceof Error ? cause.message : '连接失败，请重试。';
        if (cause instanceof api.ApiError && cause.status === 401) {
          clearExports();
          session.value = null;
          move('expired');
        }
      }
    }
  }
  const stopAudio = () => audio.stop();
  onMounted(async () => {
    try {
      await apply(await api.loadSession(), true);
    } catch (cause) {
      if (!(cause instanceof api.ApiError && cause.status === 401))
        error.value = cause instanceof Error ? cause.message : '无法读取课程。';
    } finally {
      loading.value = false;
    }
    document.addEventListener('visibilitychange', background);
    window.addEventListener('pagehide', stopAudio);
    interval = setInterval(async () => {
      if (document.hidden || polling || busy.value || !session.value || stage.value === 'recover')
        return;
      polling = true;
      try {
        if (stage.value === 'waiting') {
          const result = await api.loadSession();
          session.value = result.session;
          if (result.session.phase === 'review') await openReview();
          else if (
            result.session.job?.status === 'failed' ||
            result.session.job?.status === 'cancelled'
          )
            move('generation-error');
        }
        if (Date.now() % 30_000 < 2500) await api.heartbeat();
      } catch (cause) {
        error.value = cause instanceof Error ? cause.message : '连接失败，请重试。';
      } finally {
        polling = false;
      }
    }, 2000);
  });
  onUnmounted(() => {
    if (interval) clearInterval(interval);
    document.removeEventListener('visibilitychange', background);
    window.removeEventListener('pagehide', stopAudio);
    audio.stop();
    clearExports();
  });
  watch(
    [story, difficulty],
    () => {
      confirmed.value = false;
    },
    { flush: 'sync' },
  );
  watch(dialog, (value) => {
    if (value) audio.stop();
  });
  return {
    stage,
    session,
    review,
    busy,
    error,
    loading,
    playing,
    pin,
    confirmationPin,
    unlockPin,
    chosen,
    story,
    confirmed,
    difficulty,
    checks,
    focusWordIds,
    focusChanged,
    editIssues,
    saveFocus,
    settings,
    sentenceIndex,
    exerciseIndex,
    wordIndex,
    selected,
    leftId,
    resolved,
    feedback,
    hint,
    lastAttempt,
    dialog,
    bookUrl,
    reportUrl,
    makeReport,
    lesson,
    sentence,
    word,
    exercise,
    targetId,
    exerciseDone,
    count,
    inputIssue,
    progress,
    isChild,
    move,
    create,
    chooseStory,
    generate,
    cancelGeneration,
    saveEdits,
    discardEdits: () => act(openReview),
    start,
    visitSentence,
    showWord,
    toggleAudio,
    practice,
    answer,
    retry,
    showHint,
    adultHelp,
    rest,
    resume,
    finish,
    nextQuestion,
    unlockAdult,
    makeBook,
    close,
  };
}
