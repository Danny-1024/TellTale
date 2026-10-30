import type { LiveResponse } from '@telltale/contracts';
import { parseCookie, stringifySetCookie } from 'cookie';
import { z } from 'zod';
import {
  createSchema,
  digest,
  HttpError,
  randomToken,
  readJson,
  requireCondition,
} from './security';
export { CourseRoom, TrafficQuota } from './room';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
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

    if (!pathname.startsWith('/api/v1/'))
      return Response.json({ error: 'Not found' }, { status: 404, headers });
    try {
      if (pathname === '/api/v1/capabilities' && request.method === 'GET')
        return Response.json(
          { generation: Boolean(env.DEEPSEEK_API_KEY), model: 'deepseek-flash', version: '1.1.0' },
          { headers },
        );
      const url = new URL(request.url);
      const routes = [
        'session',
        'capabilities',
        ...[
          'review',
          'report',
          'sample',
          'generate',
          'cancel',
          'edit',
          'focus',
          'approve',
          'event',
          'answer',
          'finish',
          'unlock',
          'heartbeat',
          'close',
        ].map((name) => `course/${name}`),
      ];
      requireCondition(
        routes.includes(pathname.slice('/api/v1/'.length)),
        404,
        'NOT_FOUND',
        '找不到该操作。',
      );
      const write = request.method === 'POST';
      requireCondition(
        write || request.method === 'GET',
        405,
        'METHOD_NOT_ALLOWED',
        '请求方法不支持。',
      );
      if (write)
        requireCondition(
          request.headers.get('origin') === url.origin &&
            request.headers.get('x-telltale-request') === '1',
          403,
          'ORIGIN_INVALID',
          '请求来源验证失败。',
        );
      const input = write ? await readJson(request) : null;
      const cookieName = url.protocol === 'https:' ? '__Host-telltale_session' : 'telltale_session';
      if (pathname === '/api/v1/session' && write) {
        const data = createSchema.parse(input);
        const ipHash = await digest(request.headers.get('cf-connecting-ip') ?? 'local');
        const quota = await env.QUOTAS.getByName(`creation:${ipHash}`).reserve(
          'creation',
          5,
          60 * 60_000,
          crypto.randomUUID(),
        );
        requireCondition(quota, 429, 'RATE_LIMITED', '创建课程过于频繁，请稍后再试。');
        const id = crypto.randomUUID();
        const secret = randomToken();
        const response = await env.COURSES.getByName(id).initialize({
          id,
          cookieHash: await digest(secret),
          kind: data.kind,
          settings: data.settings,
        });
        return Response.json(response, {
          status: 201,
          headers: {
            ...headers,
            'Set-Cookie': stringifySetCookie({
              name: cookieName,
              value: `${id}.${secret}`,
              httpOnly: true,
              secure: url.protocol === 'https:',
              sameSite: 'lax',
              path: '/',
              maxAge: 4 * 60 * 60,
            }),
          },
        });
      }
      const cookie = parseCookie(request.headers.get('cookie') ?? '')[cookieName];
      requireCondition(
        cookie && /^[0-9a-f-]{36}\.[0-9a-f]{64}$/.test(cookie),
        401,
        'SESSION_EXPIRED',
        '请成人准备一节新课。',
      );
      const [id, secret] = cookie.split('.');
      const action =
        pathname === '/api/v1/session'
          ? 'session'
          : pathname.startsWith('/api/v1/course/')
            ? pathname.slice('/api/v1/course/'.length)
            : '';
      requireCondition(
        action &&
          (['session', 'review', 'report'].includes(action) ? request.method === 'GET' : write),
        404,
        'NOT_FOUND',
        '找不到该操作。',
      );
      const response = await env.COURSES.getByName(id!).handle(
        action,
        input,
        {
          cookieHash: await digest(secret!),
          csrf: request.headers.get('x-csrf-token') ?? '',
          runtime: request.headers.get('x-runtime-token') ?? '',
        },
        await digest(`${action}:${JSON.stringify(input)}`),
      );
      const secured = new Response(response.body, response);
      for (const [key, value] of Object.entries(headers)) secured.headers.set(key, value);
      if (action === 'close' && response.ok)
        secured.headers.set(
          'Set-Cookie',
          stringifySetCookie({
            name: cookieName,
            value: '',
            path: '/',
            httpOnly: true,
            secure: url.protocol === 'https:',
            sameSite: 'lax',
            maxAge: 0,
          }),
        );
      return secured;
    } catch (error) {
      if (error instanceof HttpError)
        return Response.json(
          { error: { code: error.code, message: error.message } },
          { status: error.status, headers },
        );
      if (error instanceof z.ZodError)
        return Response.json(
          { error: { code: 'INPUT_INVALID', message: '填写内容不符合要求，请检查后重试。' } },
          { status: 400, headers },
        );
      throw error;
    }
  },
} satisfies ExportedHandler<Env>;
