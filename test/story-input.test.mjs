import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import test from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';

const require = createRequire(path.resolve('apps/worker/package.json'));
const { parseSetCookie, stringifyCookie } = require('cookie');

test('real workerd rejects invalid input before outbound calls and sends normalized accepted input', async (t) => {
  const runtime = path.resolve('.work-dev/runtime');
  mkdirSync(runtime, { recursive: true });
  const previousTmp = process.env.TMPDIR;
  process.env.TMPDIR = runtime;
  const directory = mkdtempSync(path.resolve('.work-dev/story-input-'));
  let worker;
  t.after(async () => {
    if (worker) await worker.dispose();
    if (previousTmp === undefined) delete process.env.TMPDIR;
    else process.env.TMPDIR = previousTmp;
    rmSync(directory, { recursive: true });
  });
  const build = spawnSync(
    process.execPath,
    ['node_modules/wrangler/bin/wrangler.js', 'deploy', '--dry-run', '--outdir', directory],
    { encoding: 'utf8', env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } },
  );
  if (build.error) throw build.error;
  assert.equal(build.status, 0, build.stderr);
  const outbound = [];
  worker = new Miniflare(
    convertV4MiniflareOptions({
      modules: true,
      scriptPath: path.join(directory, 'index.js'),
      compatibilityDate: '2026-10-22',
      bindings: { DEEPSEEK_API_KEY: 'isolated-provider-test' },
      durableObjects: {
        COURSES: { className: 'CourseRoom', useSQLite: true },
        QUOTAS: { className: 'TrafficQuota', useSQLite: true },
      },
      durableObjectsPersist: path.join(directory, 'sqlite'),
      // 仅隔离外部供应商并复现HTTP 400；应用、路由、持久化及闹钟使用真实workerd。
      // 此测试验证发送边界，不作为DeepSeek生成成功的证据。
      outboundService: async (request) => {
        assert.equal(request.url, 'https://api.deepseek.com/chat/completions');
        const body = await request.json();
        outbound.push(JSON.parse(body.messages.at(-1).content));
        return new Response('Isolated provider rejection', { status: 400 });
      },
    }),
  );
  const origin = 'http://localhost';
  let cookie = '',
    csrf = '';
  async function request(route, body, expected = 200) {
    const response = await worker.dispatchFetch(`${origin}/api/v1/${route}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: {
        Origin: origin,
        'Content-Type': 'application/json',
        'X-Telltale-Request': '1',
        Cookie: cookie,
        'X-CSRF-Token': csrf,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const result = await response.json();
    assert.equal(response.status, expected, JSON.stringify(result));
    const header = response.headers.get('set-cookie');
    if (header) {
      const parsed = parseSetCookie(header);
      cookie = stringifyCookie({ [parsed.name]: parsed.value });
    }
    if (result.csrf) csrf = result.csrf;
    return result;
  }
  await request(
    'session',
    {
      pin: '385729',
      kind: 'class',
      settings: { showChinese: true, volume: 0.8, reduceMotion: true },
    },
    201,
  );
  const rejected = [
    ['', 'INPUT_EMPTY'],
    [' \t\n\u3000 ', 'INPUT_EMPTY'],
    ['\u200b'.repeat(20), 'INPUT_EMPTY'],
    ['\u0301'.repeat(20), 'INPUT_EMPTY'],
    ['猫', 'INPUT_NEEDS_DETAIL'],
    ['🐈', 'INPUT_NEEDS_DETAIL'],
    ['猫\u200b\u200b\u200b\u200b', 'INPUT_NEEDS_DETAIL'],
    ['猫'.repeat(301), 'INPUT_TOO_LONG'],
    ['🐈'.repeat(301), 'INPUT_TOO_LONG'],
    ['e\u0301'.repeat(301), 'INPUT_TOO_LONG'],
    ['👩‍👩‍👧‍👦'.repeat(43), 'INPUT_TOO_LONG'],
    ['请联系12345678901', 'PERSONAL_INFORMATION'],
    ['请联系123 4567 8901', 'PERSONAL_INFORMATION'],
    ['请联系123-4567-8901', 'PERSONAL_INFORMATION'],
    ['请联系１２３４５６７８９０１', 'PERSONAL_INFORMATION'],
    ['请联系123\u200b45678901', 'PERSONAL_INFORMATION'],
    ['请联系lesson@example.com', 'PERSONAL_INFORMATION'],
    ['请联系ｌｅｓｓｏｎ＠ｅｘａｍｐｌｅ．ｃｏｍ', 'PERSONAL_INFORMATION'],
  ];
  for (const [source, code] of rejected) {
    const result = await request(
      'course/generate',
      {
        source,
        difficulty: 'L',
        confirmed: true,
        operationId: crypto.randomUUID(),
      },
      400,
    );
    assert.equal(result.error.code, code);
    assert.equal((await request('session')).session.job, null);
    assert.equal(outbound.length, 0);
  }
  await request(
    'course/generate',
    {
      source: '小猫在草地上玩球。',
      difficulty: 'L',
      confirmed: false,
      operationId: crypto.randomUUID(),
    },
    400,
  );
  assert.equal(outbound.length, 0);
  const accepted = [
    '猫'.repeat(20),
    '猫'.repeat(150),
    '猫'.repeat(300),
    ` \n${'e\u0301'.repeat(300)}\t `,
    '🐈'.repeat(300),
    'a\u0323\u0301'.repeat(150),
    '👩‍👩‍👧‍👦'.repeat(42),
  ];
  for (const [index, source] of accepted.entries()) {
    const result = await request('course/generate', {
      source,
      difficulty: 'L',
      confirmed: true,
      operationId: crypto.randomUUID(),
    });
    assert.equal(result.session.job.status, 'queued');
    const deadline = Date.now() + 10_000;
    let job;
    do {
      assert(Date.now() < deadline, 'generation alarm did not finish');
      await delay(50);
      job = (await request('session')).session.job;
    } while (job.status !== 'failed');
    assert.equal(job.error, 'DEEPSEEK_HTTP_400');
    assert.equal(outbound.length, index + 1);
    assert.deepEqual(outbound[index], { story: source.normalize('NFC').trim(), difficulty: 'L' });
  }
  await request('course/close', {});
  t.diagnostic(
    `${rejected.length + 1} rejected requests: zero outbound calls; ${accepted.length} accepted requests: normalized provider payloads`,
  );
});
