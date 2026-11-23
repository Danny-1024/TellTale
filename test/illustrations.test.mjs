import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import test from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';

const require = createRequire(path.resolve('apps/worker/package.json'));
const { decode, encode } = require('fast-png');
const origin = 'https://telltale.test';
const name = 'telltale-illustration-test';
const settings = { showChinese: true, volume: 0, reduceMotion: true };
const source = '小猫和小狗在公园玩球。他们坐在树旁休息。';
const example = {
  title: '公园游戏',
  titleEn: 'Park Play',
  sentences: [
    { en: 'A cat plays.', zh: '一只猫在玩。' },
    { en: 'A dog runs.', zh: '一只狗在跑。' },
    { en: 'The park is green.', zh: '公园是绿色的。' },
    { en: 'A ball rolls.', zh: '一个球滚动。' },
    { en: 'A tree grows.', zh: '一棵树在生长。' },
  ],
  words: ['cat', 'dog', 'park', 'ball', 'tree'].map((word, sentenceIndex) => ({
    word,
    meaning: ['猫', '狗', '公园', '球', '树'][sentenceIndex],
    sentenceIndex,
  })),
  choice: {
    prompt: '选择表示猫的英语。',
    options: ['cat', 'dog', 'ball'],
    correct: 0,
    wordIndex: 0,
    hint: '回想故事里的小动物。',
  },
  match: { wordIndices: [0, 1], hint: '看看两种动物。' },
  cloze: {
    sentenceIndex: 1,
    wordIndex: 1,
    sentence: 'A ____ runs.',
    options: ['cat', 'dog', 'ball'],
    correct: 1,
    hint: '回想第二句话。',
  },
};

async function until(read, check) {
  const deadline = Date.now() + 15_000;
  for (;;) {
    const value = await read();
    if (check(value)) return value;
    assert(Date.now() < deadline, JSON.stringify(value));
    await delay(25);
  }
}

test('workerd isolates current lesson illustrations and enforces safety approval and cleanup', async (t) => {
  const runtime = path.resolve('.work-dev/runtime');
  mkdirSync(runtime, { recursive: true });
  const directory = mkdtempSync(path.resolve('.work-dev/illustrations-'));
  const previousTmp = process.env.TMPDIR;
  process.env.TMPDIR = runtime;
  let worker;
  t.after(async () => {
    if (worker) await worker.dispose();
    if (previousTmp === undefined) delete process.env.TMPDIR;
    else process.env.TMPDIR = previousTmp;
    rmSync(directory, { recursive: true });
  });
  const build = spawnSync(
    process.execPath,
    [
      'node_modules/wrangler/bin/wrangler.js',
      'deploy',
      '--dry-run',
      '--config',
      'test/fixtures/security-worker.jsonc',
      '--outdir',
      directory,
    ],
    { encoding: 'utf8', env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } },
  );
  if (build.error) throw build.error;
  assert.equal(build.status, 0, build.stderr);

  const sourcePng = Buffer.from(
    encode({
      width: 1024,
      height: 1024,
      channels: 3,
      data: new Uint8Array(1024 * 1024 * 3).fill(128),
      text: { source: 'private fixture metadata' },
    }),
  ).toString('base64');
  let blockImage = false;
  let holdImage;
  let inflight = 0;
  let maxInflight = 0;
  let imagesRequested = 0;
  let imagesReviewed = 0;
  worker = new Miniflare(
    convertV4MiniflareOptions({
      name,
      modules: true,
      scriptPath: path.join(directory, 'security-worker.js'),
      compatibilityDate: '2026-10-22',
      unsafeInspectDurableObjects: true,
      bindings: { DEEPSEEK_API_KEY: 'isolated-text', OPENAI_API_KEY: 'isolated-images' },
      durableObjects: {
        COURSES: { className: 'SecurityTestRoom', useSQLite: true },
        QUOTAS: { className: 'TrafficQuota', useSQLite: true },
      },
      durableObjectsPersist: path.join(directory, 'sqlite'),
      // 隔离外部供应商。图片格式、版本、权限和 SQLite 持久化使用真实 workerd。
      outboundService: async (request) => {
        const input = await request.json();
        if (request.url === 'https://api.deepseek.com/chat/completions')
          return Response.json({
            id: 'isolated-draft',
            choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(example) } }],
          });
        assert.equal(request.headers.get('authorization'), 'Bearer isolated-images');
        assert(!JSON.stringify(input).includes(source));
        if (request.url === 'https://api.openai.com/v1/images/generations') {
          assert.equal(input.model, 'gpt-image-2.6-flare');
          assert.equal(input.size, '1024x1024');
          imagesRequested++;
          maxInflight = Math.max(maxInflight, ++inflight);
          try {
            await delay(20);
            if (holdImage) await holdImage;
            return Response.json({ data: [{ b64_json: sourcePng }] });
          } finally {
            inflight--;
          }
        }
        assert.equal(request.url, 'https://api.openai.com/v1/moderations');
        assert.equal(input.model, 'omni-moderation-latest');
        const isImage = Array.isArray(input.input);
        if (isImage) {
          imagesReviewed++;
          const image = decode(Buffer.from(input.input[0].image_url.url.split(',')[1], 'base64'));
          assert.equal(image.width, 640);
          assert.deepEqual(image.text, {});
        }
        return Response.json({
          id: 'isolated-moderation',
          model: input.model,
          results: [{ flagged: isImage && blockImage }],
        });
      },
    }),
  );
  const namespace = await worker.getDurableObjectNamespace('COURSES');
  function browser() {
    let cookie = '',
      csrf = '',
      runtime = '',
      roomId;
    const fetch = (route, body, headers = {}) =>
      worker.dispatchFetch(new URL(route, origin), {
        method: body === undefined ? 'GET' : 'POST',
        headers: {
          Origin: origin,
          'Content-Type': 'application/json',
          'X-Telltale-Request': '1',
          Cookie: cookie,
          'X-CSRF-Token': csrf,
          'X-Runtime-Token': runtime,
          ...headers,
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    async function request(route, body, expected = 200) {
      const response = await fetch(`/api/v1/${route}`, body);
      const result = await response.json();
      assert.equal(response.status, expected, JSON.stringify(result));
      if (response.headers.has('set-cookie'))
        cookie = response.headers.get('set-cookie').split(';')[0];
      if (result.csrf) csrf = result.csrf;
      if (result.runtime) runtime = result.runtime;
      if (result.session) roomId = result.session.id;
      return result;
    }
    return {
      fetch,
      request,
      state: () => request('session').then(({ session }) => session),
      prepare: async () => {
        await request('session', { kind: 'class', settings }, 201);
        await request('course/generate', {
          operationId: crypto.randomUUID(),
          source,
          difficulty: 'L',
          confirmed: true,
        });
        await until(
          () => request('session'),
          ({ session }) => session.job.status === 'ready',
        );
      },
      command: (route, body, expected) =>
        request(`course/${route}`, { operationId: crypto.randomUUID(), ...body }, expected),
      review: () => request('course/review'),
      storage: () =>
        worker.unsafeGetDurableObjectStorage(name, 'SecurityTestRoom', { name: roomId }),
      runAlarm: () => namespace.getByName(roomId).runAlarmForTest(),
      close: () => request('course/close', {}),
    };
  }
  const approval = (revision) => ({ revision, settings, checks: Array(5).fill(true) });
  const imagesFor = (lesson) => [...lesson.sentences, ...lesson.words].map((item) => item.imageUrl);
  const person = browser(),
    other = browser();
  await Promise.all([person.prepare(), other.prepare()]);
  const draft = await person.review();
  assert.equal(draft.illustrations, 'required');
  assert.equal(
    (await person.command('approve', approval(1), 409)).error.code,
    'ILLUSTRATIONS_NOT_READY',
  );
  await Promise.all(
    [person, other].map((client) => client.command('illustrate', { revision: 1, confirmed: true })),
  );
  await Promise.all(
    [person, other].map((client) => until(client.state, (state) => state.job.status === 'ready')),
  );
  assert.equal(imagesRequested, 20);
  assert.equal(imagesReviewed, 20);
  assert.equal(maxInflight, 2);

  const ready = await person.review();
  assert.equal(ready.illustrations, 'ready');
  const paths = imagesFor(ready.lesson);
  assert.equal(new Set(paths).size, 10);
  const asset = paths[0];
  const image = await person.fetch(asset);
  assert.equal(image.status, 200);
  assert.equal(image.headers.get('content-type'), 'image/png');
  assert.equal(image.headers.get('cache-control'), 'no-store');
  assert.equal(decode(new Uint8Array(await image.arrayBuffer())).height, 640);
  assert.equal((await other.fetch(asset)).status, 404);
  const otherAsset = imagesFor((await other.review()).lesson)[0];
  const storage = await person.storage();
  const metadata = await storage.exec(
    'SELECT target_id, revision, ai_generated, width, height, sha256, safety_status FROM course_image',
  );
  assert.equal(metadata.length, 10);
  assert(
    metadata.every(
      (row) =>
        row.revision === 1 &&
        row.ai_generated === 1 &&
        row.width === 640 &&
        row.height === 640 &&
        /^[0-9a-f]{64}$/.test(row.sha256) &&
        row.safety_status === 'pass',
    ),
  );
  await other.command('edit', { revision: 1, raw: { ...draft.raw, title: '改写标题' } });
  assert.equal((await other.fetch(otherAsset)).status, 404);
  assert.equal(
    (await other.command('approve', approval(2), 409)).error.code,
    'ILLUSTRATIONS_NOT_READY',
  );
  await other.command('edit', { revision: 2, raw: { ...draft.raw, title: '电话 13800000000' } });
  assert.equal(
    (await other.command('illustrate', { revision: 3, confirmed: true }, 400)).error.code,
    'PERSONAL_INFORMATION',
  );
  assert.equal(imagesRequested, 20);
  await other.command('edit', { revision: 3, raw: draft.raw });
  await person.command('approve', approval(1));
  await person.request('course/review', undefined, 403);
  assert.equal((await person.fetch(asset, undefined, { 'X-Runtime-Token': '' })).status, 403);
  assert.equal((await person.fetch(asset)).status, 200);
  await person.close();
  assert.equal((await person.fetch(asset)).status, 401);
  assert.equal((await storage.exec('SELECT id FROM course_image')).length, 0);

  let release;
  holdImage = new Promise((resolve) => {
    release = resolve;
  });
  const pending = await other.command('illustrate', { revision: 4, confirmed: true });
  try {
    await until(
      async () => inflight,
      (count) => count > 0,
    );
    await other.command('cancel', { jobId: pending.session.job.id });
  } finally {
    release();
    holdImage = undefined;
  }
  await until(
    async () => inflight,
    (count) => count === 0,
  );
  assert.equal((await other.review()).illustrations, 'required');
  const otherStorage = await other.storage();
  assert.equal((await otherStorage.exec('SELECT id FROM course_image')).length, 0);

  blockImage = true;
  await other.command('illustrate', { revision: 4, confirmed: true });
  const blocked = await until(other.state, (state) => state.job.status === 'failed');
  assert.equal(blocked.job.error, 'IMAGE_FLAGGED');
  assert.equal(
    (await other.command('approve', approval(4), 409)).error.code,
    'ILLUSTRATIONS_NOT_READY',
  );
  assert.equal((await otherStorage.exec('SELECT id FROM course_image')).length, 0);

  blockImage = false;
  const [unfinished] = await otherStorage.exec('SELECT value FROM room WHERE id=1');
  const overdue = JSON.parse(unfinished.value);
  overdue.job.status = 'queued';
  overdue.job.deadline = Date.now() - 1;
  const beforeDeadline = imagesRequested;
  await otherStorage.exec('UPDATE room SET value=? WHERE id=1', JSON.stringify(overdue));
  await other.runAlarm();
  assert.equal((await other.state()).job.error, 'IMAGE_DEADLINE');
  assert.equal(imagesRequested, beforeDeadline);

  await other.command('illustrate', { revision: 4, confirmed: true });
  await until(other.state, (state) => state.job.status === 'ready');
  const [expiringImage] = imagesFor((await other.review()).lesson);
  assert.equal((await other.fetch(expiringImage)).status, 200);
  // 提前设置真实 SQLite 租约，触发与正式环境相同的过期清理逻辑。
  const [persisted] = await otherStorage.exec('SELECT value FROM room WHERE id=1');
  await otherStorage.exec(
    'UPDATE room SET value=? WHERE id=1',
    JSON.stringify({ ...JSON.parse(persisted.value), leaseUntil: Date.now() - 1 }),
  );
  assert.equal((await other.fetch(expiringImage)).status, 401);
  await other.runAlarm();
  assert.equal((await otherStorage.exec('SELECT id FROM course_image')).length, 0);
  assert.equal((await otherStorage.exec('SELECT id FROM room')).length, 0);
});
