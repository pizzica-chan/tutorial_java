import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "downloads");
const outFile = join(outDir, "shinsei-kun.zip");

mkdirSync(outDir, { recursive: true });

// 一時インデックスで現在のソースを固める。利用者のステージ状態は変えない。
// target・logs・node_modules など Git の無視対象は含めない。
const temporaryDir = mkdtempSync(join(tmpdir(), "shinsei-archive-"));
try {
  const options = {
    cwd: root,
    env: { ...process.env, GIT_INDEX_FILE: join(temporaryDir, "index") },
  };
  execFileSync("git", ["read-tree", "HEAD"], options);
  execFileSync("git", ["add", "--", "shinsei-kun"], options);
  const tree = execFileSync("git", ["write-tree"], { ...options, encoding: "utf8" }).trim();
  execFileSync("git", ["archive", "--format=zip", "--prefix=shinsei-kun/", "-o", outFile, `${tree}:shinsei-kun`], options);
} finally {
  rmSync(temporaryDir, { recursive: true, force: true });
}

console.log(`shinsei-kun.zip を書き出しました: ${outFile}`);
