import assert from 'node:assert/strict'
import test from 'node:test'
import type { LiveResponse } from '@telltale/contracts'
import { buildApplication, readPort } from '../src/entry/application.js'

test('真实HTTP监听返回进程存活及独立请求编号', async () => {
  const app = buildApplication()
  const address = await app.listen({ host: '127.0.0.1', port: 0 })
  try {
    const first = await fetch(`${address}/health/live`)
    assert.equal(first.status, 200)
    const body = (await first.json()) as LiveResponse
    assert.equal(body.status, 'alive')
    assert.equal(body.service, 'telltale-api')
    assert.match(body.requestId, /^[0-9a-f-]{36}$/)
    const second = (await (
      await fetch(`${address}/health/live`)
    ).json()) as LiveResponse
    assert.notEqual(second.requestId, body.requestId)
    assert.equal((await fetch(`${address}/api/v1/not-implemented`)).status, 404)
  } finally {
    await app.close()
  }
})

test('非法端口配置在启动前立即拒绝', () => {
  assert.equal(readPort(undefined), 4281)
  assert.equal(readPort('4281'), 4281)
  for (const value of ['', '0', '65536', '3.5', ' 4281', 'abc']) {
    assert.throws(() => readPort(value), /PORT/)
  }
})
