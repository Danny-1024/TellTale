import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import Fastify from 'fastify'
import type { HealthResponse } from '@telltale/shared'
import { resolveContentRoot } from './contentRoot'
import {
  gradeSampleExercise,
  listSampleSummaries,
  loadChildSample,
  SampleInvalidError,
} from './samples'

interface BuildOptions {
  logger?: boolean
}

function sendSampleError(
  error: unknown,
  log: { error: (obj: object, msg: string) => void },
): { statusCode: number; body: { error: string } } | null {
  if (!(error instanceof SampleInvalidError)) return null
  log.error({ code: error.code }, 'sample invalid')
  return { statusCode: 500, body: { error: 'sample_invalid' } }
}

export async function buildServer(options: BuildOptions = {}) {
  const app = Fastify({ logger: options.logger ?? true })
  const contentRoot = resolveContentRoot()
  const origins = (process.env.WEB_ORIGIN ?? 'http://localhost:4280,http://127.0.0.1:4280')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0)

  await app.register(cors, {
    origin: origins,
    credentials: true,
  })

  app.get('/health', async (): Promise<HealthResponse> => {
    return { status: 'ok', service: 'telltale-api' }
  })

  app.get('/api/v1/samples', async (request, reply) => {
    try {
      return { samples: listSampleSummaries(contentRoot) }
    } catch (error) {
      const invalid = sendSampleError(error, request.log)
      if (invalid) return reply.code(invalid.statusCode).send(invalid.body)
      throw error
    }
  })

  app.get<{ Params: { id: string } }>('/api/v1/samples/:id', async (request, reply) => {
    try {
      const lesson = loadChildSample(contentRoot, request.params.id)
      if (!lesson) return reply.code(404).send({ error: 'not_found' })
      return lesson
    } catch (error) {
      const invalid = sendSampleError(error, request.log)
      if (invalid) return reply.code(invalid.statusCode).send(invalid.body)
      throw error
    }
  })

  app.post<{ Params: { id: string; exerciseId: string } }>(
    '/api/v1/samples/:id/exercises/:exerciseId/submit',
    async (request, reply) => {
      try {
        const outcome = gradeSampleExercise(
          contentRoot,
          request.params.id,
          request.params.exerciseId,
          request.body,
        )
        return reply.code(outcome.status).send(outcome.body)
      } catch (error) {
        const invalid = sendSampleError(error, request.log)
        if (invalid) return reply.code(invalid.statusCode).send(invalid.body)
        throw error
      }
    },
  )

  await app.register(fastifyStatic, {
    root: contentRoot,
    prefix: '/media/',
    list: false,
  })

  return app
}
