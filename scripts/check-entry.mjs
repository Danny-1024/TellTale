import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync } from 'node:fs';
import { createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import puppeteer from 'puppeteer-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runtime = path.join(root, '.work-dev/entry-verification');
mkdirSync(runtime, { recursive: true });

async function freePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  assert(address && typeof address !== 'string');
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  return address.port;
}

function start(command, args, environment) {
  const child = spawn(command, args, {
    cwd: root,
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, ...environment, TMPDIR: runtime },
  });
  let output = '';
  child.stdout.on('data', (data) => {
    output = (output + data).slice(-10000);
  });
  child.stderr.on('data', (data) => {
    output = (output + data).slice(-10000);
  });
  let spawnError;
  child.once('error', (error) => {
    spawnError = error;
  });
  return {
    child,
    inspect() {
      if (spawnError) throw spawnError;
      assert(
        child.exitCode === null && child.signalCode === null,
        `启动进程已经结束：${output}`,
      );
    },
  };
}

async function waitFor(url, process) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    process.inspect();
    let response;
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(1000) });
    } catch (error) {
      if (!(error instanceof TypeError) && error.name !== 'TimeoutError')
        throw error;
      await delay(150);
      continue;
    }
    assert.equal(response.status, 200, `${url}返回${response.status}`);
    return response;
  }
  throw new Error(`启动等待超时：${url}`);
}

async function stop({ child }) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const closed = new Promise((resolve) => child.once('exit', resolve));
  process.kill(-child.pid, 'SIGTERM');
  await Promise.race([closed, delay(5000)]);
  if (child.exitCode === null && child.signalCode === null) {
    process.kill(-child.pid, 'SIGKILL');
    await closed;
    throw new Error('验证进程未在5秒内正常结束，已终止本次创建的进程');
  }
}

const apiPort = await freePort();
let webPort = await freePort();
while (webPort === apiPort) webPort = await freePort();
const webUrl = `http://127.0.0.1:${webPort}`;
const development = start('pnpm', ['dev'], {
  WEB_PORT: String(webPort),
  API_PORT: String(apiPort),
  PORT: String(apiPort),
});
let browser;
const results = {
  checkedAt: new Date().toISOString(),
  scope: '工程入口，真实本机HTTP与Chrome；未调用云服务或课程业务',
  viewports: [],
};
try {
  const live = await (
    await waitFor(`http://127.0.0.1:${apiPort}/health/live`, development)
  ).json();
  assert.equal(live.status, 'alive');
  await waitFor(webUrl, development);
  browser = await puppeteer.launch({
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    userDataDir: mkdtempSync(path.join(runtime, 'chrome-')),
    env: { ...process.env, TMPDIR: runtime },
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const width of [360, 1280]) {
    await page.setViewport({ width, height: 900 });
    await page.goto(webUrl, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() =>
      document
        .querySelector('[data-testid="connection-status"]')
        ?.textContent?.includes('应用已连接。'),
    );
    assert.equal(await page.title(), 'TellTale English');
    const measurements = await page.evaluate(() => ({
      title: document.querySelector('h1')?.textContent,
      buttonHeight: document.querySelector('button').getBoundingClientRect()
        .height,
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    assert.equal(measurements.title, '让故事陪伴英语学习');
    assert(measurements.buttonHeight >= 56);
    assert(measurements.content <= measurements.viewport);
    results.viewports.push({ width, ...measurements });
  }
  const response = page.waitForResponse(
    (response) => response.url() === `${webUrl}/health/live`,
  );
  await page.click('button');
  const rechecked = await (await response).json();
  assert.equal(rechecked.status, 'alive');
  assert.notEqual(rechecked.requestId, live.requestId);
  await page.goto(`${webUrl}/unknown-route`, { waitUntil: 'networkidle0' });
  assert.equal(new URL(page.url()).pathname, '/');
  assert.deepEqual(errors, []);
  results.development = {
    api: 'alive',
    vueMounted: true,
    proxy: 'verified',
    recheck: 'verified',
    router: 'verified',
    browser: await browser.version(),
    pageErrors: errors,
  };
} finally {
  try {
    if (browser) await browser.close();
  } finally {
    await stop(development);
  }
}

const builtPort = await freePort();
const built = start(process.execPath, ['apps/api/dist/main.js'], {
  PORT: String(builtPort),
});
try {
  const live = await (
    await waitFor(`http://127.0.0.1:${builtPort}/health/live`, built)
  ).json();
  assert.equal(live.status, 'alive');
  results.builtApi = { started: true, requestId: live.requestId };
} finally {
  await stop(built);
}
console.log(JSON.stringify(results, null, 2));
