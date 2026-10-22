import type { LiveResponse } from '@telltale/contracts';

export default {
  fetch(request: Request): Response {
    const pathname = new URL(request.url).pathname;
    const headers = {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
    };

    if (pathname === '/health/live') {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return Response.json(
          { error: 'Method not allowed' },
          { status: 405, headers: { ...headers, Allow: 'GET, HEAD' } },
        );
      }
      const body: LiveResponse = {
        status: 'alive',
        service: 'telltale-api',
        requestId: crypto.randomUUID(),
      };
      const response = Response.json(body, { headers });
      return request.method === 'HEAD'
        ? new Response(null, { headers: response.headers })
        : response;
    }

    return Response.json({ error: 'Not found' }, { status: 404, headers });
  },
} satisfies ExportedHandler<Env>;
