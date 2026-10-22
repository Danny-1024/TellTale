import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('apps/worker/package.json'));
const { parseSetCookie, stringifyCookie } = require('cookie');
const origin = 'http://127.0.0.1:4293';
const settings = { showChinese: true, volume: 0.8, reduceMotion: true };

async function launch(directory) {
  const worker = spawn(
    process.execPath,
    [
      'node_modules/wrangler/bin/wrangler.js',
      'dev',
      '--local',
      '--port',
      '4293',
      '--inspector-port',
      '0',
      '--persist-to',
      directory,
      '--show-interactive-dev-session=false',
    ],
    {
      env: {
        ...process.env,
        TMPDIR: path.resolve('.work-dev/runtime'),
        WRANGLER_SEND_METRICS: 'false',
      },
    },
  );
  let output = '';
  worker.stdout.on('data', (chunk) => {
    output += chunk;
  });
  worker.stderr.on('data', (chunk) => {
    output += chunk;
  });
  let error;
  worker.on('error', (value) => {
    error = value;
  });
  const exited = once(worker, 'exit');
  const deadline = Date.now() + 30_000;
  while (!output.includes('Ready on')) {
    if (error) throw error;
    assert.equal(worker.exitCode, null, output);
    assert(Date.now() < deadline, output);
    await delay(100);
  }
  return async () => {
    worker.kill('SIGTERM');
    await exited;
  };
}

function client() {
  let cookie = '',
    csrf = '',
    runtime = '';
  return {
    setRuntime(value) {
      runtime = value;
    },
    async request(route, body, expected = 200, overrides = {}) {
      const response = await fetch(`${origin}/api/v1/${route}`, {
        method: body === undefined ? 'GET' : 'POST',
        headers: {
          Origin: origin,
          'Content-Type': 'application/json',
          'X-Telltale-Request': '1',
          Cookie: cookie,
          'X-CSRF-Token': csrf,
          'X-Runtime-Token': runtime,
          ...overrides,
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
      const result = await response.json();
      assert.equal(response.status, expected, JSON.stringify(result));
      assert.equal(response.headers.get('cache-control'), 'no-store');
      const header = response.headers.get('set-cookie');
      if (header) {
        const parsed = parseSetCookie(header);
        cookie = stringifyCookie({ [parsed.name]: parsed.value });
      }
      if (result.csrf) csrf = result.csrf;
      if (result.runtime) runtime = result.runtime;
      return result;
    },
    async command(action, data = {}, expected = 200) {
      return this.request(
        `course/${action}`,
        { operationId: crypto.randomUUID(), ...data },
        expected,
      );
    },
  };
}

test('real Workers course flow protects answers, persists state, grades attempts and cleans up', async (t) => {
  mkdirSync('.work-dev/runtime', { recursive: true });
  const directory = mkdtempSync(path.resolve('.work-dev/course-test-'));
  let stop = await launch(directory);
  t.after(async () => {
    await stop();
    rmSync(directory, { recursive: true });
  });
  const adult = client();
  await adult.request('session', { pin: '385729', kind: 'class', settings }, 403, {
    Origin: 'https://untrusted.example',
  });
  await adult.request('session', { pin: '385729', kind: 'class', settings }, 201);
  const sampleOperation = crypto.randomUUID();
  await adult.command('sample', { operationId: sampleOperation });
  const review = await adult.request('course/review');
  assert.equal(review.lesson.sentences.length, 5);
  assert.equal(review.lesson.words.length, 5);
  assert.equal(review.lesson.exercises.length, 3);
  assert.equal(review.lesson.exercises[0].options.length, 3);
  await adult.command('sample', { operationId: sampleOperation });
  assert.equal((await adult.request('course/review')).lesson.id, review.lesson.id);
  await stop();
  stop = await launch(directory);
  assert.equal(
    (await adult.request('course/review')).lesson.id,
    review.lesson.id,
    'SQLite state survives a process restart',
  );
  await adult.command('approve', { revision: 99, checks: Array(5).fill(true), settings }, 409);
  await adult.command('approve', { revision: 1, checks: Array(5).fill(false), settings }, 400);
  const approvalId = crypto.randomUUID();
  const started = await adult.command('approve', {
    operationId: approvalId,
    revision: 1,
    checks: Array(5).fill(true),
    settings,
  });
  assert(started.runtime);
  const repeatedApproval = await adult.command('approve', {
    operationId: approvalId,
    revision: 1,
    checks: Array(5).fill(true),
    settings,
  });
  assert.equal(repeatedApproval.runtime, started.runtime);
  assert(
    !/correctOption|correctPairs|answers|hints|sourceSnapshot/.test(
      JSON.stringify(started.session),
    ),
  );
  await adult.request('course/review', undefined, 403);
  await adult.command('sample', {}, 403);
  adult.setRuntime('');
  assert.equal((await adult.request('session')).session.lesson, null);
  await adult.command('event', { kind: 'rest', targetId: '' }, 403);
  adult.setRuntime(started.runtime);
  const second = client();
  await second.request('session', { pin: '513246', kind: 'class', settings }, 201);
  await second.command('sample');
  await second.command('approve', { revision: 1, checks: Array(5).fill(true), settings });
  second.setRuntime(started.runtime);
  await second.command('event', { kind: 'rest', targetId: '' }, 403);
  const [choice, match, cloze] = started.session.lesson.exercises;
  await adult.command(
    'answer',
    {
      revision: 2,
      exerciseId: choice.id,
      leftId: null,
      optionId: choice.options[0].id,
      skip: false,
    },
    409,
  );
  const incorrect = choice.options.find((option) => option.id !== review.answers[choice.id]);
  const answerId = crypto.randomUUID();
  const wrongData = {
    operationId: answerId,
    revision: 1,
    exerciseId: choice.id,
    leftId: null,
    optionId: incorrect.id,
    skip: false,
  };
  const wrong = await adult.command('answer', wrongData);
  assert.equal(wrong.attempt.result, 'incorrect');
  assert.equal((await adult.command('answer', wrongData)).attempt.id, wrong.attempt.id);
  await adult.command('answer', { ...wrongData, skip: true }, 409);
  const hint = await adult.command('event', { kind: 'hint', targetId: choice.id });
  assert.equal(typeof hint.hint, 'string');
  const corrected = await adult.command('answer', {
    revision: 1,
    exerciseId: choice.id,
    leftId: null,
    optionId: review.answers[choice.id],
    skip: false,
  });
  assert.equal(corrected.attempt.result, 'correct');
  assert.equal(corrected.attempt.evidence, 'retry');
  await adult.command('event', { kind: 'adultHelp', targetId: match.id });
  for (const left of match.left) {
    const result = await adult.command('answer', {
      revision: 1,
      exerciseId: match.id,
      leftId: left.id,
      optionId: review.answers[match.id][left.id],
      skip: false,
    });
    assert.equal(result.attempt.result, 'correct');
    assert.equal(result.attempt.evidence, 'supported');
  }
  await adult.command('finish', { reason: 'completed' }, 409);
  await adult.command('answer', {
    revision: 1,
    exerciseId: cloze.id,
    leftId: null,
    optionId: null,
    skip: true,
  });
  for (const sentence of started.session.lesson.sentences)
    await adult.command('event', { kind: 'sentence', targetId: sentence.id });
  await adult.command('event', { kind: 'word', targetId: started.session.lesson.words[0].id });
  await adult.command('event', { kind: 'rest', targetId: '' });
  const finished = await adult.command('finish', { reason: 'completed' });
  assert.deepEqual(
    [
      finished.session.summary.sentences,
      finished.session.summary.words,
      finished.session.summary.completed,
      finished.session.summary.skipped,
      finished.session.summary.attempts.length,
    ],
    [5, 1, 3, 1, 5],
  );
  assert(finished.session.summary.suggestion.includes('休息'));
  await adult.command(
    'answer',
    { revision: 1, exerciseId: cloze.id, leftId: null, optionId: null, skip: true },
    409,
  );
  await adult.request('course/close', {}, 403);
  await adult.request('course/unlock', { pin: '000000' }, 403);
  await adult.request('course/unlock', { pin: '385729' });
  await adult.request('course/close', {});
  await adult.request('session', undefined, 401);
  await second.request('course/unlock', { pin: '513246' });
  await second.request('course/close', {});
});
