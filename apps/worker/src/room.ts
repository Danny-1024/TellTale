import { DurableObject } from 'cloudflare:workers';
import { z } from 'zod';
import { hasContactInformation, inspectStoryInput } from '@telltale/contracts';
import type {
  CourseSnapshot,
  CourseAttempt,
  CourseSummary,
  CourseReview,
  IllustrationStatus,
  MistakeReview,
  ReviewContent,
} from '@telltale/contracts';
import {
  createContent,
  generatedSchema,
  SAMPLE_IDS,
  sampleContent,
  type GeneratedStory,
} from './content';
import { generateStory, ProviderError } from './provider';
import {
  CourseImages,
  makeCourseImage,
  pictureTargets,
  type CourseImage,
} from './course-illustrations';
import {
  IMAGE_DEADLINE,
  IMAGE_REQUEST_LIMIT,
  moderate,
  type IllustrationEnvironment,
} from './openai-images';
import { focusExercises } from './focus';
import { wordPracticeResults } from './report';
import {
  equalToken,
  HttpError,
  randomToken,
  requireCondition,
  settingsSchema,
  uuid,
} from './security';

interface RoomState {
  id: string;
  cookieHash: string;
  csrf: string;
  mode: 'adult' | 'child';
  phase: CourseSnapshot['phase'];
  kind: CourseSnapshot['kind'];
  settings: CourseSnapshot['settings'];
  content: ReviewContent | null;
  raw: GeneratedStory | null;
  source: string;
  job:
    | (NonNullable<CourseSnapshot['job']> & {
        deadline: number;
        difficulty: 'L' | 'M' | 'H';
        revision?: number;
      })
    | null;
  illustrationsRequired?: boolean;
  illustrationCount?: number;
  illustrationReview?: { revision: number; safetyModel: string; safetyId: string } | null;
  runtime: string;
  createdAt: number;
  expiresAt: number;
  leaseUntil: number;
  attempts: CourseAttempt[];
  reviewAttempts?: CourseAttempt[];
  events: { kind: string; targetId: string }[];
  seen: Record<string, { hash: string; value: unknown }>;
  generationCount: number;
  summary: CourseSummary | null;
}
interface Identity {
  cookieHash: string;
  csrf: string;
  runtime: string;
}
const LEASE = 15 * 60_000;
const TOTAL = 4 * 60 * 60_000;
const bodyWithOperation = z.object({ operationId: uuid });
const answerSchema = z.strictObject({
  operationId: uuid,
  revision: z.number().int(),
  exerciseId: uuid,
  leftId: uuid.nullable(),
  optionId: uuid.nullable(),
  skip: z.boolean(),
  review: z.boolean().default(false),
});

function mistakeReviews(state: RoomState): MistakeReview[] {
  // 配对题按左侧词语分别回顾，普通练习的错误与回顾提交分别保留。
  const mistakes = new Map<string, MistakeReview>();
  for (const attempt of state.attempts) {
    if (attempt.result === 'incorrect' && !mistakes.has(attempt.targetId))
      mistakes.set(attempt.targetId, {
        exerciseId: attempt.exerciseId,
        targetId: attempt.targetId,
        reviews: 0,
        lastResult: null,
      });
  }
  for (const attempt of state.reviewAttempts ?? []) {
    const item = mistakes.get(attempt.targetId);
    if (item && attempt.result !== 'skipped') {
      item.reviews++;
      item.lastResult = attempt.result;
    }
  }
  return [...mistakes.values()];
}

export class CourseRoom extends DurableObject<IllustrationEnvironment> {
  private readonly images: CourseImages;
  private imageRequest: { id: string; controller: AbortController } | null = null;

  constructor(ctx: DurableObjectState, env: IllustrationEnvironment) {
    super(ctx, env);
    ctx.storage.sql.exec(
      'CREATE TABLE IF NOT EXISTS room (id INTEGER PRIMARY KEY CHECK(id=1), value TEXT NOT NULL)',
    );
    this.images = new CourseImages(ctx.storage.sql);
  }
  private read(): RoomState | null {
    const row = this.ctx.storage.sql
      .exec<{ value: string }>('SELECT value FROM room WHERE id=1')
      .toArray()[0];
    return row ? (JSON.parse(row.value) as RoomState) : null;
  }
  private save(state: RoomState): void {
    this.ctx.storage.sql.exec(
      'INSERT INTO room(id,value) VALUES(1,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value',
      JSON.stringify(state),
    );
  }
  private illustrationStatus(state: RoomState): IllustrationStatus {
    if (!state.illustrationsRequired) return 'disabled';
    const lesson = state.content?.lesson;
    if (
      lesson &&
      state.illustrationReview?.revision === lesson.revision &&
      this.images.count(lesson) === lesson.sentences.length + lesson.words.length
    )
      return 'ready';
    return this.env.OPENAI_API_KEY ? 'required' : 'unavailable';
  }

  private discardIllustrations(state: RoomState, keepCancelledJob: boolean) {
    // 编辑或换课使旧修订版及正在处理的配图失效，后续返回的图片不能写回。
    this.imageRequest?.controller.abort();
    state.illustrationReview = null;
    if (state.job?.kind === 'images' && !keepCancelledJob) state.job = null;
    if (state.content?.lesson.source === 'custom') {
      for (const sentence of state.content.lesson.sentences) {
        sentence.imageUrl = null;
        sentence.imageAlt = null;
      }
      for (const word of state.content.lesson.words) word.imageUrl = null;
    }
  }

  private deleteCourse() {
    this.imageRequest?.controller.abort();
    this.ctx.storage.transactionSync(() => {
      this.images.clear();
      this.ctx.storage.sql.exec('DELETE FROM room');
    });
  }
  private snapshot(state: RoomState, runtime: string): CourseSnapshot {
    const canRead =
      state.mode === 'adult' || Boolean(runtime && equalToken(runtime, state.runtime));
    return {
      id: state.id,
      mistakes: canRead ? mistakeReviews(state) : [],
      // 收藏使用当前课堂的词卡事件，旧课堂自然得到空列表。
      favoriteWordIds: canRead
        ? state.events.filter((event) => event.kind === 'favorite').map((event) => event.targetId)
        : [],
      mode: state.mode,
      phase: state.phase,
      kind: state.kind,
      settings: state.settings,
      lesson:
        canRead && ['learning', 'finished'].includes(state.phase) ? state.content!.lesson : null,
      job: state.job
        ? {
            id: state.job.id,
            ...(state.job.kind === 'images' ? { kind: 'images' as const } : {}),
            status: state.job.status,
            stage: state.job.stage,
            error: state.job.error,
            attempts: state.job.attempts,
          }
        : null,
      // 已存在的1.0课堂也从原始事件补充逐词投影，不推测缺失的结束时间。
      summary:
        canRead && state.summary
          ? this.summarize(state, state.summary.reason, state.summary.finishedAt ?? null)
          : null,
      expiresAt: Math.min(state.leaseUntil, state.expiresAt),
    };
  }
  async initialize(input: {
    id: string;
    cookieHash: string;
    kind: RoomState['kind'];
    settings: RoomState['settings'];
  }) {
    requireCondition(!this.read(), 409, 'SESSION_EXISTS', '课程已存在。');
    const now = Date.now();
    const state: RoomState = {
      ...input,
      csrf: randomToken(),
      mode: 'adult',
      phase: 'prepare',
      content: null,
      raw: null,
      source: '',
      job: null,
      runtime: '',
      createdAt: now,
      expiresAt: now + TOTAL,
      leaseUntil: now + LEASE,
      attempts: [],
      events: [],
      seen: {},
      generationCount: 0,
      summary: null,
    };
    this.save(state);
    await this.ctx.storage.setAlarm(state.leaseUntil);
    return { session: this.snapshot(state, ''), csrf: state.csrf };
  }
  private authorize(identity: Identity, write: boolean): RoomState {
    const state = this.read();
    requireCondition(
      state &&
        state.expiresAt > Date.now() &&
        state.leaseUntil > Date.now() &&
        equalToken(state.cookieHash, identity.cookieHash),
      401,
      'SESSION_EXPIRED',
      '本课已结束或已过期，请成人重新准备课程。',
    );
    if (write)
      requireCondition(
        equalToken(state.csrf, identity.csrf),
        403,
        'CSRF_INVALID',
        '页面验证失效，请重新打开。',
      );
    return state;
  }
  async handle(
    action: string,
    input: unknown,
    identity: Identity,
    requestHash: string,
  ): Promise<Response> {
    try {
      return await this.perform(action, input, identity, requestHash);
    } catch (error) {
      if (error instanceof HttpError)
        return Response.json(
          { error: { code: error.code, message: error.message } },
          { status: error.status },
        );
      if (error instanceof z.ZodError)
        return Response.json(
          { error: { code: 'INPUT_INVALID', message: '提交字段无效，请检查填写内容。' } },
          { status: 400 },
        );
      throw error;
    }
  }
  private async perform(
    action: string,
    input: unknown,
    identity: Identity,
    requestHash: string,
  ): Promise<Response> {
    let state = this.authorize(
      identity,
      !['session', 'review', 'report', 'media'].includes(action),
    );
    const adult = () =>
      requireCondition(state.mode === 'adult', 403, 'ADULT_REQUIRED', '请先进入课程设置。');
    const child = () =>
      requireCondition(
        state.mode === 'child' && identity.runtime && equalToken(identity.runtime, state.runtime),
        403,
        'RUNTIME_REQUIRED',
        '学习页面已重新打开，请重新准备课程。',
      );
    if (action === 'session')
      return Response.json({ session: this.snapshot(state, identity.runtime), csrf: state.csrf });
    if (action === 'review') {
      adult();
      requireCondition(
        state.content && state.phase === 'review',
        409,
        'INVALID_TRANSITION',
        '当前没有待审核的课程。',
      );
      const result: CourseReview = {
        ...state.content,
        raw: state.raw,
        illustrations: this.illustrationStatus(state),
      };
      return Response.json(result);
    }
    if (action === 'media') {
      if (state.mode === 'child') child();
      const lesson = state.content?.lesson;
      requireCondition(
        lesson &&
          state.illustrationReview?.revision === lesson.revision &&
          (state.phase === 'review' || state.phase === 'learning' || state.phase === 'finished'),
        404,
        'MEDIA_NOT_FOUND',
        '找不到当前课程图片。',
      );
      const image = this.images.read(lesson, uuid.parse(input));
      requireCondition(image, 404, 'MEDIA_NOT_FOUND', '找不到当前课程图片。');
      return new Response(image.bytes, {
        headers: { 'Content-Type': image.mime, 'Cross-Origin-Resource-Policy': 'same-origin' },
      });
    }
    if (action === 'report') {
      // 本课报告仅包含已审核内容和本课结果，儿童运行令牌可以读取。
      if (state.mode === 'child') child();
      requireCondition(
        state.phase === 'finished' && state.content && state.summary,
        409,
        'REPORT_NOT_READY',
        '请先结束本课，再生成练习报告。',
      );
      return Response.json({
        lesson: state.content.lesson,
        summary: this.summarize(state, state.summary.reason, state.summary.finishedAt ?? null),
      });
    }
    if (action === 'unlock') {
      z.strictObject({}).parse(input);
      // 切换入口不验证身份；学习中的切换会结束本课并保留已提交结果。
      state.mode = 'adult';
      state.runtime = '';
      if (state.phase === 'learning') state.summary = this.summarize(state, 'early');
      if (state.phase === 'learning') state.phase = 'finished';
      this.save(state);
      return Response.json({ session: this.snapshot(state, '') });
    }
    if (action === 'heartbeat') {
      if (state.mode === 'child') child();
      state.leaseUntil = Math.min(Date.now() + LEASE, state.expiresAt);
      this.save(state);
      if (!state.job || !['queued', 'running'].includes(state.job.status))
        await this.ctx.storage.setAlarm(state.leaseUntil);
      return Response.json({ expiresAt: state.leaseUntil });
    }
    if (action === 'close') {
      if (state.mode === 'child') child();
      this.deleteCourse();
      await this.ctx.storage.deleteAlarm();
      return Response.json({ closed: true });
    }
    const { operationId } = bodyWithOperation.parse(input);
    const existing = state.seen[operationId];
    if (existing) {
      requireCondition(
        existing.hash === requestHash,
        409,
        'IDEMPOTENCY_CONFLICT',
        '同一次操作的内容发生变化。',
      );
      // 重复提交仍执行当前权限检查。
      if (['sample', 'generate', 'cancel', 'edit', 'focus', 'illustrate'].includes(action)) adult();
      else if (action === 'approve') {
        // 批准响应丢失时可重取当前运行令牌；成人重新进入后旧回执失效。
        const receipt = existing.value as { runtime: string };
        requireCondition(
          state.mode === 'child' && equalToken(receipt.runtime, state.runtime),
          409,
          'APPROVAL_EXPIRED',
          '本次审核已失效，请重新检查当前内容。',
        );
      } else child();
      return Response.json(existing.value);
    }
    requireCondition(
      Object.keys(state.seen).length < 500,
      429,
      'SESSION_LIMIT',
      '本课操作次数已达到上限，请成人结束课程。',
    );
    let value: unknown;
    let discardImages = false;
    if (action === 'sample') {
      adult();
      // 缺省仍打开原来的公园示例，已有调用不需要额外字段。
      const data = z
        .strictObject({
          operationId: uuid,
          sampleId: z.enum(SAMPLE_IDS).default('park-morning'),
        })
        .parse(input);
      requireCondition(
        state.phase !== 'learning' && !['queued', 'running'].includes(state.job?.status ?? ''),
        409,
        'INVALID_TRANSITION',
        '请先结束当前处理。',
      );
      state.content = sampleContent(data.sampleId);
      state.reviewAttempts = [];
      state.raw = null;
      state.source = '';
      state.phase = 'review';
      state.job = null;
      state.attempts = [];
      state.events = [];
      state.summary = null;
      state.illustrationsRequired = false;
      discardImages = true;
      value = { session: this.snapshot(state, '') };
    } else if (action === 'generate') {
      adult();
      const data = z
        .strictObject({
          operationId: uuid,
          source: z.string(),
          difficulty: z.enum(['L', 'M', 'H']),
          confirmed: z.literal(true),
        })
        .parse(input);
      const storyInput = inspectStoryInput(data.source);
      if (storyInput.issue)
        throw new HttpError(400, storyInput.issue.code, storyInput.issue.message);
      requireCondition(
        state.phase !== 'learning' && !['queued', 'running'].includes(state.job?.status ?? ''),
        409,
        'GENERATION_ACTIVE',
        '本课已有正在处理的任务。',
      );
      requireCondition(
        this.env.DEEPSEEK_API_KEY,
        503,
        'PROVIDER_NOT_CONFIGURED',
        '故事生成服务尚未配置。',
      );
      requireCondition(
        state.generationCount < 10,
        429,
        'GENERATION_LIMIT',
        '本课已达到10次生成上限。',
      );
      // 全站额度在请求接收时预留，防止匿名请求无限调用模型。
      // 预留标识包含课堂归属，客户端UUID不能复用其他课堂的额度。
      const reserved = await this.env.QUOTAS.getByName('generation-budget').reserve(
        'generation',
        100,
        24 * 60 * 60_000,
        `${state.id}:${operationId}`,
      );
      requireCondition(reserved, 429, 'GENERATION_LIMIT', '今天的故事生成额度已用完，请稍后再来。');
      state = this.authorize(identity, true);
      adult();
      // 额度预留跨越RPC等待，并发的相同请求可能已写入原回执。
      const repeated = state.seen[operationId];
      if (repeated) {
        requireCondition(
          repeated.hash === requestHash,
          409,
          'IDEMPOTENCY_CONFLICT',
          '同一次操作的内容发生变化。',
        );
        return Response.json(repeated.value);
      }
      requireCondition(
        state.phase !== 'learning' && !['queued', 'running'].includes(state.job?.status ?? ''),
        409,
        'GENERATION_ACTIVE',
        '本课已有正在处理的任务。',
      );
      requireCondition(
        state.generationCount < 10,
        429,
        'GENERATION_LIMIT',
        '本课已达到10次生成上限。',
      );
      state.generationCount += 1;
      state.reviewAttempts = [];
      state.source = storyInput.source;
      state.raw = null;
      state.content = null;
      state.phase = 'prepare';
      state.attempts = [];
      state.events = [];
      state.summary = null;
      state.illustrationsRequired = Boolean(this.env.OPENAI_API_KEY);
      discardImages = true;
      state.job = {
        id: crypto.randomUUID(),
        status: 'queued',
        stage: '等待生成故事',
        error: null,
        attempts: 0,
        deadline: Date.now() + 45_000,
        difficulty: data.difficulty,
      };
      value = { session: this.snapshot(state, '') };
    } else if (action === 'cancel') {
      adult();
      const data = z.strictObject({ operationId: uuid, jobId: uuid }).parse(input);
      requireCondition(
        state.job?.id === data.jobId && ['queued', 'running'].includes(state.job.status),
        409,
        'INVALID_TRANSITION',
        '该任务已结束。',
      );
      state.job.status = 'cancelled';
      state.job.stage = '已取消';
      if (state.job.kind === 'images') discardImages = true;
      else {
        state.content = null;
        state.raw = null;
      }
      value = { session: this.snapshot(state, '') };
    } else if (action === 'illustrate') {
      adult();
      const data = z
        .strictObject({ operationId: uuid, revision: z.number().int(), confirmed: z.literal(true) })
        .parse(input);
      const lesson = state.content?.lesson;
      requireCondition(
        lesson?.source === 'custom' &&
          state.raw &&
          state.phase === 'review' &&
          state.illustrationsRequired,
        409,
        'INVALID_TRANSITION',
        '请先准备待审核的自编故事。',
      );
      requireCondition(
        lesson.revision === data.revision,
        409,
        'REVISION_CONFLICT',
        '内容已更新，请重新打开审核。',
      );
      requireCondition(
        this.env.OPENAI_API_KEY,
        503,
        'IMAGE_PROVIDER_NOT_CONFIGURED',
        '本课配图服务尚未配置。',
      );
      requireCondition(
        this.illustrationStatus(state) === 'required' &&
          !['queued', 'running'].includes(state.job?.status ?? ''),
        409,
        'IMAGE_JOB_EXISTS',
        '本课配图已完成或正在处理。',
      );
      requireCondition(
        !hasContactInformation(JSON.stringify(state.raw)),
        400,
        'PERSONAL_INFORMATION',
        '请先删除教学内容中的联系方式。',
      );
      requireCondition(
        (state.illustrationCount ?? 0) < 10,
        429,
        'IMAGE_LIMIT',
        '本课已达到10次配图上限。',
      );
      const reserved = await this.env.QUOTAS.getByName('generation-budget').reserve(
        'illustration',
        30,
        24 * 60 * 60_000,
        `illustration:${state.id}:${operationId}`,
      );
      requireCondition(reserved, 429, 'IMAGE_LIMIT', '今天的课堂配图额度已用完，请稍后再来。');
      state = this.authorize(identity, true);
      adult();
      const repeated = state.seen[operationId];
      if (repeated) {
        requireCondition(
          repeated.hash === requestHash,
          409,
          'IDEMPOTENCY_CONFLICT',
          '同一次操作的内容发生变化。',
        );
        return Response.json(repeated.value);
      }
      requireCondition(
        state.content?.lesson.id === lesson.id &&
          state.content.lesson.revision === data.revision &&
          state.phase === 'review',
        409,
        'REVISION_CONFLICT',
        '内容已更新，请重新打开审核。',
      );
      requireCondition(
        this.illustrationStatus(state) === 'required' &&
          !['queued', 'running'].includes(state.job?.status ?? ''),
        409,
        'IMAGE_JOB_EXISTS',
        '本课配图已完成或正在处理。',
      );
      requireCondition(
        (state.illustrationCount ?? 0) < 10,
        429,
        'IMAGE_LIMIT',
        '本课已达到10次配图上限。',
      );
      state.illustrationCount = (state.illustrationCount ?? 0) + 1;
      state.job = {
        id: crypto.randomUUID(),
        kind: 'images',
        revision: data.revision,
        status: 'queued',
        stage: '等待生成配图',
        error: null,
        attempts: 0,
        deadline: Date.now() + IMAGE_DEADLINE,
        difficulty: lesson.difficulty,
      };
      value = { session: this.snapshot(state, '') };
    } else if (action === 'focus') {
      adult();
      const data = z
        .strictObject({
          operationId: uuid,
          revision: z.number().int(),
          wordIds: z.array(uuid).min(2).max(3),
        })
        .parse(input);
      requireCondition(
        new Set(data.wordIds).size === data.wordIds.length,
        400,
        'FOCUS_INVALID',
        '请选择2–3个不同的词语。',
      );
      requireCondition(
        state.content && state.raw && state.phase === 'review',
        409,
        'INVALID_TRANSITION',
        '请在自编故事审核页面调整重点词。',
      );
      requireCondition(
        state.content.lesson.revision === data.revision,
        409,
        'REVISION_CONFLICT',
        '内容已更新，请重新打开审核。',
      );
      const result = focusExercises(state.content, state.raw, data.wordIds);
      state.content = result.content;
      state.raw = result.raw;
      discardImages = true;
      value = { session: this.snapshot(state, '') };
    } else if (action === 'edit') {
      adult();
      const data = z
        .strictObject({ operationId: uuid, revision: z.number().int(), raw: generatedSchema })
        .parse(input);
      requireCondition(
        state.content?.lesson.source === 'custom' && state.phase === 'review',
        409,
        'INVALID_TRANSITION',
        '仅可编辑待审核的自编故事。',
      );
      requireCondition(
        state.content.lesson.revision === data.revision,
        409,
        'REVISION_CONFLICT',
        '内容已更新，请重新打开审核。',
      );
      let edited: ReviewContent;
      try {
        edited = createContent(data.raw, state.content.lesson.difficulty, 'custom');
      } catch (error) {
        if (error instanceof Error && error.message.startsWith('CONTENT_INVALID'))
          throw new HttpError(
            422,
            'CONTENT_INVALID',
            error.message.slice('CONTENT_INVALID: '.length),
          );
        throw error;
      }
      edited.lesson.id = state.content.lesson.id;
      edited.lesson.revision = state.content.lesson.revision + 1;
      state.content = edited;
      state.raw = data.raw;
      discardImages = true;
      value = { session: this.snapshot(state, '') };
    } else if (action === 'approve') {
      adult();
      const data = z
        .strictObject({
          operationId: uuid,
          revision: z.number().int(),
          checks: z.array(z.literal(true)).length(5),
          settings: settingsSchema,
        })
        .parse(input);
      requireCondition(
        state.content && state.phase === 'review',
        409,
        'INVALID_TRANSITION',
        '请先完成内容审核。',
      );
      requireCondition(
        state.content.lesson.revision === data.revision,
        409,
        'REVISION_CONFLICT',
        '内容已更新，请重新检查。',
      );
      requireCondition(
        !state.illustrationsRequired || this.illustrationStatus(state) === 'ready',
        409,
        'ILLUSTRATIONS_NOT_READY',
        '请先生成本课配图并通过文字和图片安全检查。',
      );
      state.phase = 'learning';
      state.mode = 'child';
      state.runtime = randomToken();
      state.settings = data.settings;
      value = { session: this.snapshot(state, state.runtime), runtime: state.runtime };
    } else if (action === 'event') {
      child();
      requireCondition(state.phase === 'learning', 409, 'RUN_FINISHED', '本课已结束。');
      const data = z
        .strictObject({
          operationId: uuid,
          kind: z.enum([
            'sentence',
            'word',
            'favorite',
            'unfavorite',
            'hint',
            'adultHelp',
            'replay',
            'rest',
          ]),
          targetId: z.string().max(36),
        })
        .parse(input);
      const lesson = state.content!.lesson;
      const allowed =
        data.kind === 'rest' ||
        (data.kind === 'sentence'
          ? lesson.sentences.some((s) => s.id === data.targetId)
          : ['word', 'favorite', 'unfavorite'].includes(data.kind)
            ? lesson.words.some((w) => w.id === data.targetId)
            : lesson.exercises.some((e) => e.id === data.targetId));
      requireCondition(allowed, 400, 'TARGET_INVALID', '学习项目已失效。');
      if (data.kind === 'unfavorite')
        state.events = state.events.filter(
          (event) => !(event.kind === 'favorite' && event.targetId === data.targetId),
        );
      else if (!state.events.some((e) => e.kind === data.kind && e.targetId === data.targetId))
        state.events.push({ kind: data.kind, targetId: data.targetId });
      value =
        data.kind === 'hint' ? { hint: state.content!.hints[data.targetId] } : { recorded: true };
    } else if (action === 'answer') {
      child();
      requireCondition(state.phase === 'learning', 409, 'RUN_FINISHED', '本课已结束。');
      const data = answerSchema.parse(input);
      const lesson = state.content!.lesson;
      requireCondition(
        lesson.revision === data.revision,
        409,
        'REVISION_CONFLICT',
        '题目版本已更新。',
      );
      const exercise = lesson.exercises.find((e) => e.id === data.exerciseId);
      requireCondition(exercise, 404, 'NOT_FOUND', '找不到这道题。');
      const targetId = exercise.type === 'match' ? data.leftId : exercise.id;
      requireCondition(
        targetId &&
          (exercise.type !== 'match' || exercise.left.some((item) => item.id === targetId)),
        400,
        'TARGET_INVALID',
        '请选择要配对的英文。',
      );
      if (!data.skip)
        requireCondition(
          data.optionId &&
            (exercise.type === 'match' ? exercise.right : exercise.options).some(
              (o) => o.id === data.optionId,
            ),
          400,
          'OPTION_INVALID',
          '请先选择一个选项。',
        );
      const answer = state.content!.answers[exercise.id]!;
      const correctId = typeof answer === 'string' ? answer : answer[targetId];
      const prior = state.attempts.filter((a) => a.targetId === targetId);
      if (data.review) {
        requireCondition(
          !data.skip && prior.some((attempt) => attempt.result === 'incorrect'),
          409,
          'REVIEW_UNAVAILABLE',
          '只能重新练习本课实际答错的项目。',
        );
        requireCondition(
          !state.reviewAttempts?.some(
            (attempt) => attempt.targetId === targetId && attempt.result === 'correct',
          ),
          409,
          'REVIEW_COMPLETE',
          '这一项已经回顾完成。',
        );
      }
      const support = state.events
        .filter(
          (event) =>
            event.targetId === exercise.id && ['hint', 'adultHelp', 'replay'].includes(event.kind),
        )
        .map((event) => event.kind as 'hint' | 'adultHelp' | 'replay');
      // 重听正常示范单独记录；提示和成人协助才改变支持条件。
      const supported = support.some((kind) => kind === 'hint' || kind === 'adultHelp');
      const attempt: CourseAttempt = {
        id: crypto.randomUUID(),
        exerciseId: exercise.id,
        targetId,
        result: data.skip ? 'skipped' : data.optionId === correctId ? 'correct' : 'incorrect',
        evidence: data.skip
          ? 'skipped'
          : prior.length
            ? 'retry'
            : supported
              ? 'supported'
              : 'independent',
        createdAt: new Date().toISOString(),
        support,
      };
      if (data.review) (state.reviewAttempts ??= []).push(attempt);
      else state.attempts.push(attempt);
      value = {
        attempt,
        mistakes: mistakeReviews(state),
        message:
          attempt.result === 'correct'
            ? '配合得很好，继续下一步吧。'
            : attempt.result === 'skipped'
              ? '这一项先放一放。'
              : '再看看故事里的意思，也可以使用提示。',
      };
    } else if (action === 'finish') {
      child();
      const data = z
        .strictObject({ operationId: uuid, reason: z.enum(['completed', 'early']) })
        .parse(input);
      requireCondition(state.phase === 'learning', 409, 'RUN_FINISHED', '本课已经结束。');
      if (data.reason === 'completed') {
        const all = state.content!.lesson.exercises.every((exercise) =>
          (exercise.type === 'match' ? exercise.left.map((l) => l.id) : [exercise.id]).every((id) =>
            state.attempts.some((a) => a.targetId === id && a.result !== 'incorrect'),
          ),
        );
        requireCondition(all, 409, 'INCOMPLETE', '请完成或跳过剩余练习，也可以提前结束。');
      }
      state.phase = 'finished';
      state.summary = this.summarize(state, data.reason);
      value = { session: this.snapshot(state, identity.runtime) };
    } else throw new HttpError(404, 'NOT_FOUND', '找不到该操作。');
    if (discardImages) {
      this.discardIllustrations(state, action === 'cancel');
      if (action === 'edit' || action === 'focus') value = { session: this.snapshot(state, '') };
    }
    state.seen[operationId] = { hash: requestHash, value };
    this.ctx.storage.transactionSync(() => {
      if (discardImages) this.images.clear();
      this.save(state);
    });
    await this.ctx.storage.setAlarm(
      state.job?.status === 'queued' ? Date.now() + 1 : Math.min(state.leaseUntil, state.expiresAt),
    );
    return Response.json(value);
  }
  private summarize(
    state: RoomState,
    reason: CourseSummary['reason'],
    finishedAt: string | null = new Date().toISOString(),
  ): CourseSummary {
    const latest = new Map(state.attempts.map((a) => [a.targetId, a]));
    return {
      reason,
      sentences: state.events.filter((e) => e.kind === 'sentence').length,
      words: state.events.filter((e) => e.kind === 'word').length,
      completed: [...latest.values()].filter((a) => a.result === 'correct').length,
      skipped: [...latest.values()].filter((a) => a.result === 'skipped').length,
      attempts: state.attempts,
      finishedAt,
      wordResults: wordPracticeResults(state.content!.lesson, state.attempts, state.events),
      suggestion: state.events.some((e) => e.kind === 'rest')
        ? '本课使用了休息。下次开始前，可以一起约定随时休息的方式。'
        : state.events.some((e) => e.kind === 'hint')
          ? '本课使用了提示。下次可以先回顾故事，再让孩子自己选择。'
          : '下次开始前，请孩子自己选择想讲的故事，并留出慢慢回答的时间。',
    };
  }

  private async withImageSlot<T>(deadline: number, signal: AbortSignal, run: () => Promise<T>) {
    const quota = this.env.QUOTAS.getByName('image-concurrency');
    const ticket = crypto.randomUUID();
    while (Date.now() < deadline) {
      if (signal.aborted) throw new ProviderError('IMAGE_CANCELLED', false);
      // 租约同时涵盖生成和独立审核。进程中断后也会自动释放全站并发额度。
      if (
        await quota.acquireImageSlot(
          ticket,
          Math.min(deadline, Date.now() + IMAGE_REQUEST_LIMIT * 2 + 5_000),
        )
      ) {
        try {
          if (signal.aborted) throw new ProviderError('IMAGE_CANCELLED', false);
          return await run();
        } finally {
          await quota.releaseImageSlot(ticket);
        }
      }
      await new Promise<void>((resolve) => setTimeout(resolve, 250));
    }
    throw new ProviderError('IMAGE_DEADLINE', false);
  }

  private async runIllustrations(state: RoomState) {
    const job = state.job!;
    const current = () => {
      const room = this.read();
      return room?.phase === 'review' &&
        room.job?.id === job.id &&
        room.job.status === 'running' &&
        room.content?.lesson.revision === job.revision
        ? room
        : null;
    };
    if (job.status === 'running') {
      // 告警被重放时，供应商可能已完成计费。由成人决定是否启动下一组。
      job.status = 'failed';
      job.error = 'IMAGE_RESULT_UNKNOWN';
      job.stage = '配图中断，请重试';
      this.save(state);
      return;
    }
    const lesson = state.content!.lesson;
    const apiKey = this.env.OPENAI_API_KEY;
    job.status = 'running';
    job.attempts = 1;
    job.stage = '正在检查故事、词卡和练习文字';
    this.save(state);
    const controller = new AbortController();
    this.imageRequest = { id: job.id, controller };
    const { signal } = controller;
    try {
      if (!apiKey) throw new ProviderError('IMAGE_PROVIDER_NOT_CONFIGURED', false);
      // 成人确认后审核当前教学文字，保留独立的文本安全结果。原始经历不进入 OpenAI 请求。
      const textSafety = await moderate(apiKey, JSON.stringify(state.raw), job.deadline, signal);
      if (textSafety.flagged) throw new ProviderError('ILLUSTRATION_TEXT_FLAGGED', false);
      const status = current();
      if (!status) return;
      status.job!.stage = '正在生成并检查本课配图';
      this.save(status);

      const targets = pictureTargets(lesson);
      const images: CourseImage[] = [];
      const worker = async () => {
        try {
          for (let target = targets.shift(); target && !signal.aborted; target = targets.shift())
            images.push(
              await makeCourseImage(apiKey, target, job.deadline, signal, (run) =>
                this.withImageSlot(job.deadline, signal, run),
              ),
            );
        } catch (error) {
          controller.abort(error);
          throw error;
        }
      };
      await Promise.allSettled([worker(), worker()]);
      if (signal.aborted) throw signal.reason;
      const latest = current();
      if (!latest) return;
      if (Date.now() >= Math.min(latest.leaseUntil, latest.expiresAt)) {
        this.deleteCourse();
        return;
      }
      if (Date.now() >= job.deadline) throw new ProviderError('IMAGE_DEADLINE', false);
      if (images.length !== lesson.sentences.length + lesson.words.length)
        throw new Error('Illustration targets were incomplete.');
      latest.illustrationReview = {
        revision: lesson.revision,
        safetyModel: textSafety.model,
        safetyId: textSafety.id,
      };
      latest.job!.status = 'ready';
      latest.job!.stage = '配图已通过检查，请成人审核';
      this.ctx.storage.transactionSync(() => {
        this.images.store(latest.content!.lesson, job.id, images);
        this.save(latest);
      });
    } catch (error) {
      const latest = current();
      if (!latest) return;
      if (!(error instanceof ProviderError)) throw error;
      latest.job!.status = 'failed';
      latest.job!.error = error.code;
      latest.job!.stage = '配图未完成';
      console.error(JSON.stringify({ stage: 'illustration', errorCode: error.code }));
      this.save(latest);
    } finally {
      if (this.imageRequest?.id === job.id) this.imageRequest = null;
    }
  }

  async alarm(): Promise<void> {
    let state = this.read();
    if (!state) return;
    if (Date.now() >= Math.min(state.leaseUntil, state.expiresAt)) {
      this.deleteCourse();
      return;
    }
    if (state.job?.kind === 'images' && ['queued', 'running'].includes(state.job.status)) {
      await this.runIllustrations(state);
    } else if (state.job?.status === 'running') {
      state.job.status = 'failed';
      state.job.error = 'PROVIDER_RESULT_UNKNOWN';
      state.job.stage = '生成中断，请重新发起';
      this.save(state);
    }
    if (state.job?.status === 'queued' && state.job.kind !== 'images') {
      const id = state.job.id;
      state.job.status = 'running';
      state.job.stage = '正在生成英语故事与练习';
      this.save(state);
      let correction = '';
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        state = this.read();
        if (!state || state.job?.id !== id || state.job.status !== 'running') break;
        state.job.attempts = attempt;
        this.save(state);
        try {
          const result = await generateStory(
            this.env.DEEPSEEK_API_KEY,
            state.source,
            state.job.difficulty,
            state.job.deadline,
            correction,
          );
          const latest = this.read();
          if (!latest || latest.job?.id !== id || latest.job.status !== 'running') break;
          if (Date.now() >= Math.min(latest.leaseUntil, latest.expiresAt)) {
            this.deleteCourse();
            return;
          }
          // 网络完成与解析结束都必须处于原任务期限内，迟到内容不能进入审核。
          if (Date.now() >= latest.job.deadline) {
            latest.job.status = 'failed';
            latest.job.error = 'GENERATION_DEADLINE';
            latest.job.stage = '生成未完成';
            this.save(latest);
            break;
          }
          latest.content = result.content;
          latest.raw = result.raw;
          latest.phase = 'review';
          latest.job.status = 'ready';
          latest.job.stage = '内容已生成，请成人审核';
          this.save(latest);
          break;
        } catch (error) {
          const latest = this.read();
          if (!latest || latest.job?.id !== id || latest.job.status !== 'running') break;
          const expected =
            error instanceof ProviderError ||
            error instanceof z.ZodError ||
            error instanceof SyntaxError ||
            (error instanceof Error &&
              (error.message.startsWith('CONTENT_INVALID') ||
                ['TimeoutError', 'AbortError'].includes(error.name))) ||
            (error instanceof TypeError && /fetch|network/i.test(error.message));
          if (!expected) throw error;
          const code =
            error instanceof ProviderError
              ? error.code
              : error instanceof z.ZodError || error instanceof SyntaxError
                ? 'CONTENT_INVALID'
                : error instanceof Error && error.message.startsWith('CONTENT_INVALID')
                  ? error.message
                  : error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name)
                    ? 'GENERATION_DEADLINE'
                    : 'PROVIDER_CONNECTION_FAILED';
          const retryable =
            error instanceof ProviderError ? error.retryable : code.startsWith('CONTENT_INVALID');
          correction = code;
          console.error(JSON.stringify({ stage: 'generation', errorCode: code, attempt }));
          if (retryable && attempt < 3 && Date.now() + 1000 < latest.job.deadline) continue;
          latest.job.status = 'failed';
          latest.job.error = code;
          latest.job.stage = '生成未完成';
          this.save(latest);
          break;
        }
      }
    }
    const latest = this.read();
    if (latest)
      // 取消期间可能已经接收下一次生成，旧请求结束后仍需及时唤醒新任务。
      await this.ctx.storage.setAlarm(
        latest.job?.status === 'queued'
          ? Date.now() + 1
          : Math.min(latest.leaseUntil, latest.expiresAt),
      );
  }
}

export class TrafficQuota extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.storage.sql.exec(
      'CREATE TABLE IF NOT EXISTS quota (key TEXT PRIMARY KEY, used INTEGER NOT NULL, expires INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS reservations (id TEXT PRIMARY KEY, expires INTEGER NOT NULL)',
    );
  }
  acquireImageSlot(id: string, expires: number): boolean {
    const now = Date.now();
    if (expires <= now) return false;
    const sql = this.ctx.storage.sql;
    return this.ctx.storage.transactionSync(() => {
      sql.exec(
        'CREATE TABLE IF NOT EXISTS image_slots (id TEXT PRIMARY KEY, expires INTEGER NOT NULL)',
      );
      sql.exec('DELETE FROM image_slots WHERE expires<=?', now);
      if (sql.exec<{ total: number }>('SELECT COUNT(*) AS total FROM image_slots').one().total >= 2)
        return false;
      sql.exec('INSERT INTO image_slots VALUES (?,?)', id, expires);
      return true;
    });
  }
  releaseImageSlot(id: string): void {
    this.ctx.storage.sql.exec('DELETE FROM image_slots WHERE id=?', id);
  }
  async reserve(key: string, limit: number, period: number, operationId: string): Promise<boolean> {
    const now = Date.now();
    const sql = this.ctx.storage.sql;
    const allowed = this.ctx.storage.transactionSync(() => {
      sql.exec('DELETE FROM reservations WHERE expires<=?', now);
      sql.exec('DELETE FROM quota WHERE expires<=?', now);
      if (sql.exec('SELECT id FROM reservations WHERE id=?', operationId).toArray().length)
        return true;
      const row = sql
        .exec<{ used: number; expires: number }>('SELECT used,expires FROM quota WHERE key=?', key)
        .toArray()[0];
      if (row && row.used >= limit) return false;
      const expires = row?.expires ?? now + period;
      sql.exec(
        'INSERT INTO quota(key,used,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET used=used+1',
        key,
        expires,
      );
      sql.exec('INSERT INTO reservations(id,expires) VALUES(?,?)', operationId, expires);
      return true;
    });
    await this.ctx.storage.setAlarm(now + period);
    return allowed;
  }
  alarm(): void {
    this.ctx.storage.sql.exec('DELETE FROM quota; DELETE FROM reservations');
  }
}
