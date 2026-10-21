import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
mkdirSync(path.join(root, "dist/generated"), { recursive: true });
for (const filename of ["public.js", "public.d.ts"])
  copyFileSync(
    path.join(root, "src/generated", filename),
    path.join(root, "dist/generated", filename),
  );
