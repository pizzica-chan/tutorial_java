import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "downloads");
const outFile = join(outDir, "shinsei-kun.zip");

mkdirSync(outDir, { recursive: true });

// git 管理下の shinsei-kun/ だけを、コミット時点の内容でそのまま固める
execFileSync("git", ["archive", "--format=zip", "-o", outFile, "HEAD:shinsei-kun"], {
  cwd: root,
  stdio: "inherit",
});

console.log(`shinsei-kun.zip を書き出しました: ${outFile}`);
