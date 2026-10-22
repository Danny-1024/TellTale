import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';

test('Worker serves the Web application and health endpoint through workerd', async (t) => {
  const runtime = path.resolve('.work-dev/runtime');
  mkdirSync(runtime, { recursive: true });
  const worker = spawn(
    process.execPath,
    [
      'node_modules/wrangler/bin/wrangler.js',
      'dev',
      '--local',
      '--port',
      '4292',
      '--inspector-port',
      '0',
      '--show-interactive-dev-session=false',
    ],
    { env: { ...process.env, TMPDIR: runtime, WRANGLER_SEND_METRICS: 'false' } },
  );
  let output = '';
  worker.stdout.on('data', (chunk) => {
    output += chunk;
  });
  worker.stderr.on('data', (chunk) => {
    output += chunk;
  });
  let launchError;
  worker.on('error', (error) => {
    launchError = error;
  });
  const exited = once(worker, 'exit');
  t.after(async () => {
    if (worker.exitCode === null) worker.kill('SIGTERM');
    await exited;
  });
  const deadline = Date.now() + 30_000;
  while (!output.includes('Ready on')) {
    if (launchError) throw launchError;
    assert.equal(worker.exitCode, null, output);
    assert(Date.now() < deadline, output);
    await delay(100);
  }
  const origin = 'http://127.0.0.1:4292';
  const first = await fetch(`${origin}/health/live`);
  assert.equal(first.status, 200);
  const body = await first.json();
  assert.equal(body.status, 'alive');
  assert.equal(body.service, 'telltale-api');
  assert.match(body.requestId, /^[0-9a-f-]{36}$/);
  assert.equal(first.headers.get('cache-control'), 'no-store');
  const second = await (await fetch(`${origin}/health/live`)).json();
  assert.notEqual(second.requestId, body.requestId);
  const head = await fetch(`${origin}/health/live`, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  const post = await fetch(`${origin}/health/live`, { method: 'POST' });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');
  for (const route of ['/api', '/api/v1/missing', '/health/ready']) {
    const response = await fetch(`${origin}${route}`, {
      headers: { 'Sec-Fetch-Mode': 'navigate' },
    });
    assert.equal(response.status, 404, route);
    assert.match(response.headers.get('content-type'), /application\/json/);
  }
  for (const route of ['/', '/learning/story']) {
    const page = await fetch(`${origin}${route}`, {
      headers: { 'Sec-Fetch-Mode': 'navigate' },
    });
    assert.equal(page.status, 200);
    assert((await page.text()).includes('<title>TellTale English</title>'));
    assert(page.headers.get('content-security-policy').includes("frame-ancestors 'none'"));
    assert.equal(page.headers.get('x-content-type-options'), 'nosniff');
  }
  const scripts = readdirSync('apps/web/dist/assets').filter((name) => name.endsWith('.js'));
  assert(scripts.length > 0);
  for (const filename of scripts) {
    const response = await fetch(`${origin}/assets/${filename}`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /javascript/);
  }
});
