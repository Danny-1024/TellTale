import { randomUUID } from 'node:crypto';
import Fastify from 'fastify';
import type { LiveResponse } from '@telltale/contracts';
import { LiveResponseSchema } from '@telltale/contracts/schemas';

export function buildApplication() {
  const app = Fastify({
    logger: false,
    bodyLimit: 64 * 1024,
    requestIdHeader: false,
    genReqId: () => randomUUID(),
  });

  app.get(
    '/health/live',
    { schema: { response: { 200: LiveResponseSchema } } },
    async (request): Promise<LiveResponse> => ({
      status: 'alive',
      service: 'telltale-api',
      requestId: request.id,
    }),
  );

  return app;
}

export function readPort(value: string | undefined): number {
  if (value === undefined) return 4281;
  if (!/^[1-9]\d{0,4}$/.test(value)) throw new Error('PORT必须是1至65535的整数');
  const port = Number(value);
  if (port > 65535) throw new Error('PORT必须是1至65535的整数');
  return port;
}
