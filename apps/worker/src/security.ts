import { z } from 'zod';

export const settingsSchema = z.strictObject({
  showChinese: z.boolean(),
  volume: z.number().min(0).max(1),
  reduceMotion: z.boolean(),
});
export const createSchema = z.strictObject({
  pin: z.string().regex(/^\d{6}$/),
  kind: z.enum(['sample', 'class']),
  settings: settingsSchema,
});
export const uuid = z.uuid();
export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
export function requireCondition(
  value: unknown,
  status: number,
  code: string,
  message: string,
): asserts value {
  if (!value) throw new HttpError(status, code, message);
}
export const randomToken = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');
export async function digest(text: string): Promise<string> {
  return Array.from(
    new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))),
    (b) => b.toString(16).padStart(2, '0'),
  ).join('');
}
export async function pinDigest(pin: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bytes = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 100_000 },
    key,
    256,
  );
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('');
}
export function equalToken(left: string, right: string): boolean {
  const encoder = new TextEncoder();
  return (
    left.length === right.length &&
    crypto.subtle.timingSafeEqual(encoder.encode(left), encoder.encode(right))
  );
}
export async function readJson(request: Request): Promise<unknown> {
  requireCondition(
    request.headers.get('content-type')?.split(';')[0] === 'application/json',
    415,
    'CONTENT_TYPE',
    '请使用 JSON 提交。',
  );
  const reader = request.body?.getReader();
  requireCondition(reader, 400, 'INPUT_INVALID', '缺少请求内容。');
  let size = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 32_000) {
      await reader.cancel();
      throw new HttpError(413, 'INPUT_TOO_LARGE', '提交内容超过大小限制。');
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch (error) {
    if (error instanceof SyntaxError) throw new HttpError(400, 'INPUT_INVALID', 'JSON 格式无效。');
    throw error;
  }
}
