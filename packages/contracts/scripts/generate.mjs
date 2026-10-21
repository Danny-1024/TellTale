import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import standaloneCode from 'ajv/dist/standalone/index.js';
import { buildSync } from 'esbuild';
import { PublicSchemas } from '../src/schemas.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ajv = new Ajv({
  strict: true,
  removeAdditional: false,
  useDefaults: false,
  coerceTypes: false,
  code: { source: true },
});
addFormats(ajv, ['uuid', 'date-time']);
for (const [name, schema] of Object.entries(PublicSchemas)) ajv.addSchema(schema, name);
const code = standaloneCode(
  ajv,
  Object.fromEntries(Object.keys(PublicSchemas).map((name) => [name, name])),
);
const result = buildSync({
  absWorkingDir: root,
  stdin: { contents: code, resolveDir: root, sourcefile: 'validators.cjs' },
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  write: false,
  legalComments: 'none',
});
assert.equal(result.outputFiles.length, 1);
const generated = `// 此文件由pnpm --filter @telltale/contracts generate生成。\n${result.outputFiles[0].text}`;
assert(!generated.includes('new Function('));
assert(!generated.includes('correctOptionId') && !generated.includes('correctPairs'));
const destination = path.join(root, 'src/generated/public.js');
if (process.argv.includes('--check')) {
  assert(existsSync(destination), '请先生成共享校验代码。');
  assert.equal(
    readFileSync(destination, 'utf8'),
    generated,
    '共享校验代码与Schema不一致，请重新生成。',
  );
} else {
  mkdirSync(path.dirname(destination), { recursive: true });
  writeFileSync(destination, generated);
}
console.log(
  JSON.stringify({
    schemas: Object.keys(PublicSchemas).length,
    mode: process.argv.includes('--check') ? 'check' : 'generate',
  }),
);
