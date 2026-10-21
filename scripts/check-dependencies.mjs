import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(filename), '..');

export function checkDependencies(root = projectRoot) {
  const directories = [root];
  for (const parent of ['apps', 'packages']) {
    const container = path.join(root, parent);
    if (!existsSync(container)) continue;
    for (const entry of readdirSync(container, { withFileTypes: true })) {
      if (entry.isDirectory() && existsSync(path.join(container, entry.name, 'package.json'))) {
        directories.push(path.join(container, entry.name));
      }
    }
  }
  let checked = 0;
  for (const directory of directories) {
    const manifest = JSON.parse(readFileSync(path.join(directory, 'package.json'), 'utf8'));
    for (const dependency of Object.keys({
      ...manifest.dependencies,
      ...manifest.devDependencies,
    })) {
      if (!existsSync(path.join(directory, 'node_modules', dependency, 'package.json'))) {
        throw new Error(
          `${manifest.name}缺少依赖${dependency}，请运行pnpm install --frozen-lockfile。`,
        );
      }
      checked++;
    }
  }
  return { workspaces: directories.length, checked };
}

if (process.argv[1] && path.resolve(process.argv[1]) === filename) {
  console.info(JSON.stringify(checkDependencies()));
}
