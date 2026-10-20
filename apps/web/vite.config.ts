import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const configuredPort = (value: string | undefined, defaultValue: number) => {
    if (value === undefined) return defaultValue
    if (!/^[1-9]\d{0,4}$/.test(value) || Number(value) > 65535) {
      throw new Error('开发端口必须是1至65535的整数')
    }
    return Number(value)
  }
  const webPort = configuredPort(process.env.WEB_PORT ?? env.WEB_PORT, 4280)
  const apiPort = configuredPort(process.env.API_PORT ?? env.API_PORT, 4281)
  const apiOrigin = `http://127.0.0.1:${apiPort}`

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '127.0.0.1',
      port: webPort,
      strictPort: true,
      proxy: {
        '/api': apiOrigin,
        '/health': apiOrigin,
        '/media': apiOrigin,
      },
    },
    preview: {
      host: '127.0.0.1',
      port: webPort,
      strictPort: true,
    },
  }
})
