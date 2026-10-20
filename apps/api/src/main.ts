import { buildApplication, readPort } from './entry/application.js'

const app = buildApplication()
const port = readPort(process.env.PORT ?? process.env.API_PORT)
const address = await app.listen({ host: '127.0.0.1', port })
console.info(`TellTale API listening at ${address}`)

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void app.close()
  })
}
