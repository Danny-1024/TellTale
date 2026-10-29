import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import test from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';

const require = createRequire(path.resolve('apps/worker/package.json'));
const { parseSetCookie, stringifyCookie } = require('cookie');
const origin = 'https://telltale.test';
const name = 'telltale-security-test';
const settings = { showChinese: true, volume: 0, reduceMotion: true };
const source = '小猫和小狗在公园玩球。他们坐在树旁休息。';
const isolatedKey = 'isolated-provider-security-canary';
const generated = {
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
const completion = () =>
  Response.json({
    id: 'isolated-completion',
    choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(generated) } }],
  });

async function until(read, accept, message, timeout = 5000) {
  const deadline = Date.now() + timeout;
  for (;;) {
    const value = await read();
    if (accept(value)) return value;
    assert(Date.now() < deadline, message);
    await delay(20);
  }
}

test('real workerd enforces security, lifecycle and isolated provider failure boundaries', async (t) => {
  const runtime = path.resolve('.work-dev/runtime');
  mkdirSync(runtime, { recursive: true });
  const previousTmp = process.env.TMPDIR;
  process.env.TMPDIR = runtime;
  const directory = mkdtempSync(path.resolve('.work-dev/security-test-'));
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
  let handler = async () => new Response('Isolated provider rejection', { status: 400 });
  const outbound = [],
    logs = [];
  worker = new Miniflare(
    convertV4MiniflareOptions({
      name,
      modules: true,
      scriptPath: path.join(directory, 'security-worker.js'),
      compatibilityDate: '2026-10-22',
      unsafeInspectDurableObjects: true,
      bindings: { DEEPSEEK_API_KEY: isolatedKey },
      durableObjects: {
        COURSES: { className: 'SecurityTestRoom', useSQLite: true },
        QUOTAS: { className: 'TrafficQuota', useSQLite: true },
      },
      durableObjectsPersist: path.join(directory, 'sqlite'),
      handleStructuredLogs: (entry) => logs.push(entry),
      // 仅隔离外部模型；响应错误、阻塞和迟到条件不代表真实DeepSeek集成。
      outboundService: async (request) => {
        assert.equal(request.url, 'https://api.deepseek.com/chat/completions');
        outbound.push({ at: Date.now() });
        return handler(request);
      },
    }),
  );
  const rooms = await worker.getDurableObjectNamespace('COURSES');
  const quotas = await worker.getDurableObjectNamespace('QUOTAS');
  let nextIp = 1;
  function client(ip = `203.0.113.${nextIp++}`) {
    const value = { cookie: '', csrf: '', runtime: '', id: '', ip, pin: '835729' };
    value.request = async (route, body, expected = 200, overrides = {}) => {
      const response = await worker.dispatchFetch(`${origin}/api/v1/${route}`, {
        method: body === undefined ? 'GET' : 'POST',
        headers: {
          Origin: origin,
          'Content-Type': 'application/json',
          'X-Telltale-Request': '1',
          Cookie: value.cookie,
          'X-CSRF-Token': value.csrf,
          'X-Runtime-Token': value.runtime,
          'CF-Connecting-IP': value.ip,
          ...overrides,
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
      const result = await response.json();
      assert.equal(response.status, expected, `${route}: ${JSON.stringify(result)}`);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      const cookie = response.headers.get('set-cookie');
      if (cookie) {
        const parsed = parseSetCookie(cookie);
        assert(parsed.httpOnly && parsed.secure);
        assert.equal(parsed.sameSite, 'lax');
        assert.equal(parsed.path, '/');
        value.cookie = stringifyCookie({ [parsed.name]: parsed.value });
      }
      if (result.csrf) value.csrf = result.csrf;
      if (result.runtime) value.runtime = result.runtime;
      if (result.session) value.id = result.session.id;
      return result;
    };
    value.command = (action, body = {}, expected = 200) =>
      value.request(`course/${action}`, { operationId: crypto.randomUUID(), ...body }, expected);
    value.create = () => value.request('session', { pin: value.pin, kind: 'class', settings }, 201);
    value.close = async () => {
      await value.request('course/unlock', { pin: value.pin });
      await value.request('course/close', {});
      await value.request('session', undefined, 401);
    };
    return value;
  }
  async function storage(person) {
    return worker.unsafeGetDurableObjectStorage(name, 'SecurityTestRoom', { name: person.id });
  }
  async function state(person) {
    const rows = await (await storage(person)).exec('SELECT value FROM room WHERE id=1');
    return rows[0] ? JSON.parse(rows[0].value) : null;
  }
  // 使用真实SQLite准备期限与容量边界；Date.now、授权与持久闹钟处理保持真实实现。
  async function patch(person, fields) {
    const current = await state(person);
    assert(current);
    await (
      await storage(person)
    ).exec('UPDATE room SET value=? WHERE id=1', JSON.stringify({ ...current, ...fields }));
  }
  const generate = (person, fields = {}, expected = 200) =>
    person.command('generate', { source, difficulty: 'L', confirmed: true, ...fields }, expected);
  const waitJob = (person, status) =>
    until(
      () => state(person),
      (s) => s?.job?.status === status,
      `job did not reach ${status}`,
    );
  async function learning(person) {
    await person.command('sample');
    const review = await person.request('course/review');
    const approved = await person.command('approve', {
      revision: 1,
      checks: Array(5).fill(true),
      settings,
    });
    return { review, approved };
  }

  await t.test(
    'focus selection rebuilds exercises without changing the reviewed story',
    async (test) => {
      const previousHandler = handler;
      test.after(() => {
        handler = previousHandler;
      });
      const person = client();
      await person.create();
      handler = async () => completion();
      await generate(person);
      await waitJob(person, 'ready');
      const original = await person.request('course/review');
      const selected = original.lesson.words.slice(2, 5).map((word) => word.id);
      await person.command('focus', { revision: 1, wordIds: [selected[0], selected[0]] }, 400);
      await person.command(
        'focus',
        { revision: 1, wordIds: [selected[0], crypto.randomUUID()] },
        400,
      );
      const operationId = crypto.randomUUID();
      const payload = { operationId, revision: 1, wordIds: selected };
      await person.command('focus', payload);
      const updated = await person.request('course/review');
      assert.deepEqual(updated.lesson.sentences, original.lesson.sentences);
      assert.deepEqual(updated.lesson.words, original.lesson.words);
      assert.equal(updated.lesson.id, original.lesson.id);
      assert.equal(updated.lesson.revision, 2);
      assert.deepEqual(
        [...new Set(updated.lesson.exercises.flatMap((item) => item.targetWordIds))].sort(),
        [...selected].sort(),
      );
      await person.command('focus', payload);
      assert.equal((await person.request('course/review')).lesson.revision, 2);
      await person.command('focus', { revision: 1, wordIds: selected.slice(0, 2) }, 409);
      const invalid = structuredClone(updated.raw);
      invalid.sentences[0].en = 'A cat plays with a little dog near the green park.';
      const rejected = await person.command('edit', { revision: 2, raw: invalid }, 422);
      assert(rejected.error.message.includes('第1句'));
      assert.equal((await person.request('course/review')).lesson.revision, 2);
      await person.command('approve', { revision: 1, checks: Array(5).fill(true), settings }, 409);
      await person.command('approve', { revision: 2, checks: Array(5).fill(true), settings });
      await person.command('focus', { revision: 2, wordIds: selected }, 403);
      await person.close();
    },
  );

  await t.test('same-origin, CSRF, cookie and runtime ownership protect course data', async () => {
    const first = client(),
      second = client();
    await first.request('session', { pin: first.pin, kind: 'class', settings }, 403, {
      Origin: 'https://untrusted.example',
    });
    await first.create();
    await second.create();
    assert.equal(
      (await first.request('course/heartbeat', {}, 403, { 'X-CSRF-Token': '' })).error.code,
      'CSRF_INVALID',
    );
    await first.request('course/heartbeat', {}, 403, { 'X-Telltale-Request': '0' });
    await first.request('session', undefined, 401, { Cookie: `${first.cookie}0` });
    await learning(first);
    await learning(second);
    await first.request('course/review', undefined, 403);
    await first.request('course/heartbeat', {}, 403, { 'X-Runtime-Token': second.runtime });
    const projected = JSON.stringify((await first.request('session')).session);
    assert(
      !/"(?:answers|hints|raw|correct|pinHash|cookieHash|csrf|runtime|source)"\s*:/.test(
        projected.replace('"source":"sample"', ''),
      ),
    );
    const refreshed = await first.request('session', undefined, 200, { 'X-Runtime-Token': '' });
    assert.equal(refreshed.session.lesson, null);
    assert.equal(refreshed.session.summary, null);
    await first.close();
    await second.close();
  });
  await t.test(
    'five incorrect PINs lock access and an expired lock starts a fresh attempt window',
    async () => {
      const person = client();
      await person.create();
      await learning(person);
      for (let i = 0; i < 5; i++)
        assert.equal(
          (await person.request('course/unlock', { pin: '000000' }, 403)).error.code,
          'PIN_INVALID',
        );
      const locked = await state(person);
      assert.equal(locked.pinFailures, 5);
      assert(locked.lockedUntil > Date.now() + 590000);
      assert.equal(
        (await person.request('course/unlock', { pin: person.pin }, 429)).error.code,
        'PIN_LOCKED',
      );
      await patch(person, { lockedUntil: Date.now() - 1 });
      await person.request('course/unlock', { pin: '000000' }, 403);
      assert.equal((await state(person)).pinFailures, 1);
      await person.close();
    },
  );
  await t.test(
    'idle and absolute boundaries reject access, delete content and clamp renewal',
    async () => {
      for (const field of ['leaseUntil', 'expiresAt']) {
        const person = client();
        await person.create();
        await learning(person);
        const before = await state(person);
        assert.equal(before.expiresAt - before.createdAt, 4 * 3600000);
        assert.equal(before.leaseUntil - before.createdAt, 15 * 60000);
        await patch(person, { [field]: Date.now() - 1 });
        await person.request('session', undefined, 401);
        await rooms.getByName(person.id).runAlarmForTest();
        assert.equal(await state(person), null);
      }
      const person = client();
      await person.create();
      const expiresAt = Date.now() + 5000;
      await patch(person, { expiresAt });
      assert.equal((await person.request('course/heartbeat', {})).expiresAt, expiresAt);
      await person.close();
    },
  );
  await t.test(
    'quota reservations are atomic and creation, generation and operation limits reject excess',
    async () => {
      const quota = quotas.getByName('atomic-window'),
        ids = Array.from({ length: 20 }, () => crypto.randomUUID());
      const reserved = await Promise.all(ids.map((id) => quota.reserve('test', 5, 10000, id)));
      assert.equal(reserved.filter(Boolean).length, 5);
      assert(await quota.reserve('test', 5, 10000, ids[reserved.findIndex(Boolean)]));
      const repeated = client('198.51.100.32');
      for (let i = 0; i < 5; i++) {
        await repeated.create();
        await repeated.close();
      }
      await repeated.request('session', { pin: repeated.pin, kind: 'class', settings }, 429);
      const person = client();
      await person.create();
      await patch(person, { generationCount: 10 });
      const count = outbound.length;
      await generate(person, {}, 429);
      assert.equal(outbound.length, count);
      await patch(person, {
        seen: Object.fromEntries(
          Array.from({ length: 500 }, () => [crypto.randomUUID(), { hash: 'fixture', value: {} }]),
        ),
      });
      assert.equal((await person.command('sample', {}, 429)).error.code, 'SESSION_LIMIT');
      await person.close();
      const globalQuota = await worker.unsafeGetDurableObjectStorage(name, 'TrafficQuota', {
        name: 'generation-budget',
      });
      await globalQuota.exec(
        'INSERT INTO quota(key,used,expires) VALUES(?, ?, ?) ON CONFLICT(key) DO UPDATE SET used=excluded.used,expires=excluded.expires',
        'generation',
        100,
        Date.now() + 60000,
      );
      const other = client();
      await other.create();
      await generate(other, {}, 429);
      await other.close();
      await globalQuota.exec('DELETE FROM quota; DELETE FROM reservations');
    },
  );
  await t.test(
    'concurrent duplicate generation returns one receipt and reserves one job',
    async () => {
      const person = client();
      await person.create();
      const operationId = crypto.randomUUID();
      const data = { operationId, source, difficulty: 'L', confirmed: true };
      const results = await Promise.all([
        person.command('generate', data),
        person.command('generate', data),
      ]);
      assert.equal(results[0].session.job.id, results[1].session.job.id);
      assert.equal((await state(person)).generationCount, 1);
      await waitJob(person, 'failed');
      await person.command('generate', { ...data, source: source + '大家很开心。' }, 409);
      await person.close();
    },
  );
  await t.test(
    'identical client operation IDs in different rooms consume separate global reservations',
    async () => {
      const quota = await worker.unsafeGetDurableObjectStorage(name, 'TrafficQuota', {
        name: 'generation-budget',
      });
      const before =
        (await quota.exec('SELECT used FROM quota WHERE key=?', 'generation'))[0]?.used ?? 0;
      const operationId = crypto.randomUUID();
      for (let i = 0; i < 2; i++) {
        const person = client();
        await person.create();
        await generate(person, { operationId });
        await waitJob(person, 'failed');
        await person.close();
      }
      assert.equal(
        (await quota.exec('SELECT used FROM quota WHERE key=?', 'generation'))[0].used,
        before + 2,
      );
    },
  );
  await t.test(
    'old approval receipts cannot reopen content after adult unlock and replacement',
    async () => {
      const person = client();
      await person.create();
      await person.command('sample');
      const approval = {
        operationId: crypto.randomUUID(),
        revision: 1,
        checks: Array(5).fill(true),
        settings,
      };
      const first = await person.command('approve', approval);
      const repeated = await person.command('approve', approval);
      assert.equal(first.runtime, repeated.runtime);
      await person.request('course/unlock', { pin: person.pin });
      await person.command('sample');
      assert.equal((await person.command('approve', approval, 409)).error.code, 'APPROVAL_EXPIRED');
      await person.close();
    },
  );
  await t.test('cancelled responses cannot overwrite a subsequent queued generation', async () => {
    const person = client();
    await person.create();
    let release;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    let calls = 0;
    handler = async () => {
      calls++;
      if (calls === 1) await gate;
      return completion();
    };
    try {
      const first = await generate(person);
      await until(
        async () => calls,
        (value) => value === 1,
        'provider not started',
      );
      await person.command('cancel', { jobId: first.session.job.id });
      const second = await generate(person);
      assert.notEqual(second.session.job.id, first.session.job.id);
      release();
      const finished = await waitJob(person, 'ready');
      assert.equal(finished.job.id, second.session.job.id);
      assert.equal(calls, 2);
    } finally {
      release();
      handler = async () => new Response('Isolated provider rejection', { status: 400 });
    }
    await person.close();
  });
  await t.test('close discards provider responses and clears all stored course data', async () => {
    const person = client();
    await person.create();
    let release;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    let started = false;
    handler = async () => {
      started = true;
      await gate;
      return completion();
    };
    try {
      await generate(person);
      await until(async () => started, Boolean, 'provider not started');
      await person.close();
      release();
      await delay(100);
      assert.equal(await state(person), null);
    } finally {
      release();
      handler = async () => new Response('Isolated provider rejection', { status: 400 });
    }
  });
  await t.test(
    'a response received beyond the persisted deadline cannot become review content',
    async () => {
      const person = client();
      await person.create();
      let release;
      let started = false;
      const gate = new Promise((resolve) => {
        release = resolve;
      });
      handler = async () => {
        started = true;
        await gate;
        return completion();
      };
      try {
        await generate(person);
        await until(async () => started, Boolean, 'provider not started');
        const current = await state(person);
        await patch(person, { job: { ...current.job, deadline: Date.now() - 1 } });
        release();
        const failed = await waitJob(person, 'failed');
        assert.equal(failed.job.error, 'GENERATION_DEADLINE');
        assert.equal(failed.content, null);
        await person.close();
      } finally {
        release();
        handler = async () => new Response('Isolated provider rejection', { status: 400 });
      }
    },
  );
  await t.test(
    'the actual 45-second fetch deadline stops an isolated unresponsive provider',
    async () => {
      const person = client();
      await person.create();
      let release;
      let started = false;
      const gate = new Promise((resolve) => {
        release = resolve;
      });
      handler = async () => {
        started = true;
        await gate;
        return completion();
      };
      try {
        await generate(person);
        await until(async () => started, Boolean, 'provider not started');
        const current = await state(person),
          begin = Date.now();
        assert(current.job.deadline - begin > 44000 && current.job.deadline - begin <= 45000);
        const failed = await until(
          () => state(person),
          (s) => s?.job?.status === 'failed',
          '45-second deadline did not stop the request',
          49000,
        );
        assert.equal(failed.job.error, 'GENERATION_DEADLINE');
        assert.equal(failed.job.attempts, 1);
        assert(Date.now() - begin >= 44000);
        assert.equal(failed.content, null);
        await person.close();
      } finally {
        release();
        handler = async () => new Response('Isolated provider rejection', { status: 400 });
      }
    },
  );
  await t.test(
    'provider failures preserve real error codes, retry limits, deadlines and private logs',
    async () => {
      for (const status of [400, 401, 402, 429, 500]) {
        const person = client();
        await person.create();
        const count = outbound.length;
        handler = async () => new Response('private-provider-response-canary', { status });
        await generate(person);
        const failed = await waitJob(person, 'failed');
        assert.equal(failed.job.error, `DEEPSEEK_HTTP_${status}`);
        assert.equal(outbound.length - count, status === 429 || status >= 500 ? 3 : 1);
        await person.close();
      }
      const expired = client();
      await expired.create();
      await patch(expired, {
        job: {
          id: crypto.randomUUID(),
          status: 'queued',
          stage: 'fixture deadline',
          error: null,
          attempts: 0,
          deadline: Date.now() - 1,
          difficulty: 'L',
        },
        source,
      });
      const count = outbound.length;
      await rooms.getByName(expired.id).runAlarmForTest();
      const failed = await state(expired);
      assert.equal(failed.job.error, 'GENERATION_DEADLINE');
      assert.equal(outbound.length, count);
      await expired.close();
      await delay(100);
      const text = JSON.stringify(logs);
      assert(text.includes('DEEPSEEK_HTTP_500'));
      for (const secret of [source, isolatedKey, 'private-provider-response-canary', '835729'])
        assert(!text.includes(secret));
      for (const filename of readdirSync('apps/web/dist/assets').filter((f) => f.endsWith('.js'))) {
        const text = readFileSync(`apps/web/dist/assets/${filename}`, 'utf8');
        assert(!text.includes(isolatedKey));
        assert(!text.includes('correctOption'));
        assert(!text.includes('correctPairs'));
      }
    },
  );
});
