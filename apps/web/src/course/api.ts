import type { CourseSnapshot, ReviewContent, StoryDraft, CourseAttempt } from '@telltale/contracts';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
export interface CourseResult {
  session: CourseSnapshot;
  csrf?: string;
  runtime?: string;
}
let csrf = '';
let runtime = '';
const operations = new Map<string, string>();

async function request<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`/api/v1/${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'X-Telltale-Request': '1',
      'X-CSRF-Token': csrf,
      'X-Runtime-Token': runtime,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(15_000),
  });
  const data = await response.json();
  if (!response.ok)
    throw new ApiError(
      response.status,
      data.error?.code ?? 'REQUEST_FAILED',
      data.error?.message ?? `请求失败（${response.status}）。`,
    );
  if (data.csrf) csrf = data.csrf;
  if (data.runtime) runtime = data.runtime;
  return data as T;
}
export const loadSession = () => request<CourseResult>('session');
export const createSession = (pin: string, settings: CourseSnapshot['settings']) =>
  request<CourseResult>('session', { pin, kind: 'class', settings });
export const getReview = () => request<ReviewContent & { raw: StoryDraft | null }>('course/review');
export const heartbeat = () => request<{ expiresAt: number }>('course/heartbeat', {});
export async function unlock(pin: string): Promise<CourseResult> {
  const result = await request<CourseResult>('course/unlock', { pin });
  runtime = '';
  return result;
}
export async function closeSession() {
  await request('course/close', {});
  csrf = '';
  runtime = '';
  operations.clear();
}
export async function command<T = CourseResult>(
  action: string,
  data: Record<string, unknown> = {},
): Promise<T> {
  const key = JSON.stringify({ action, data });
  const operationId = operations.get(key) ?? crypto.randomUUID();
  operations.set(key, operationId);
  const result = await request<T>(`course/${action}`, { ...data, operationId });
  operations.delete(key);
  return result;
}
export const recordEvent = (kind: string, targetId: string) =>
  command<{ recorded?: boolean; hint?: string }>('event', { kind, targetId });
export const submitAnswer = (data: Record<string, unknown>) =>
  command<{ attempt: CourseAttempt; message: string }>('answer', data);
