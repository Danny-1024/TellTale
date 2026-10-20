import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer } from 'node:http'
import { createPinia, setActivePinia } from 'pinia'
import { useConnection } from '../src/entry/connection'

test('连接状态读取真实HTTP响应并保留请求编号', async () => {
  const { buildApplication } =
    await import('../../api/src/entry/application.js')
  const api = buildApplication()
  const address = await api.listen({ host: '127.0.0.1', port: 0 })
  const originalFetch = globalThis.fetch
  // 仅把相对地址映射到隔离端口，响应来自真实Fastify服务。
  globalThis.fetch = (input, init) =>
    originalFetch(new URL(String(input), address), init)
  try {
    setActivePinia(createPinia())
    const connection = useConnection()
    await connection.check()
    assert.equal(connection.status, 'connected')
    assert.match(connection.requestId ?? '', /^[0-9a-f-]{36}$/)
    assert.equal(connection.reason, null)
  } finally {
    globalThis.fetch = originalFetch
    await api.close()
  }
})

test('真实HTTP服务不可用时保存失败状态与原因', async () => {
  const http = createServer((_request, response) => {
    response.writeHead(503).end()
  })
  await new Promise<void>((resolve) => {
    http.listen(0, '127.0.0.1', resolve)
  })
  const address = http.address()
  assert(address && typeof address !== 'string')
  const originalFetch = globalThis.fetch
  // 本地503服务用于隔离外部依赖并复现不可用条件。
  globalThis.fetch = (input, init) =>
    originalFetch(
      new URL(String(input), `http://127.0.0.1:${address.port}`),
      init,
    )
  try {
    setActivePinia(createPinia())
    const connection = useConnection()
    await connection.check()
    assert.equal(connection.status, 'unavailable')
    assert.equal(connection.reason, 'HTTP 503')
    assert.equal(connection.requestId, null)
  } finally {
    globalThis.fetch = originalFetch
    await new Promise<void>((resolve, reject) => {
      http.close((error) => {
        if (error) reject(error)
        else resolve()
      })
    })
  }
})
