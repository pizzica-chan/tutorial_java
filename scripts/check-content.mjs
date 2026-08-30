import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src");
const errors = [];

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(path));
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(path);
  }
  return files;
}

function read(path) {
  return readFileSync(path, "utf8");
}

const sourceFiles = walk(src);
const sourceText = sourceFiles.map((path) => read(path)).join("\n");

const quizzesSrc = read(join(src, "data", "quizzes.ts"));
const definedQuizzes = new Set(
  [...quizzesSrc.matchAll(/^\s+"([^"]+)": \{/gm)].map((match) => match[1]),
);
const quizIdsFromBlocks = [...sourceText.matchAll(/type:\s*"quiz",\s*id:\s*"([^"]+)"/g)].map((match) => match[1]);
const quizIdsFromLab = [...read(join(src, "pages", "LabPage.tsx")).matchAll(/QuizBlock id="([^"]+)"/g)].map(
  (match) => match[1],
);

for (const id of [...quizIdsFromBlocks, ...quizIdsFromLab]) {
  if (!definedQuizzes.has(id)) errors.push(`未定義のクイズ ID: ${id}`);
}

for (const id of definedQuizzes) {
  const referenced = quizIdsFromBlocks.includes(id) || quizIdsFromLab.includes(id);
  if (!referenced) errors.push(`未使用のクイズ ID: ${id}`);
}

function unionMembers(source, typeName) {
  const match = source.match(new RegExp(`export type ${typeName} =([\\s\\S]*?);`));
  if (!match) {
    errors.push(`型が見つかりません: ${typeName}`);
    return [];
  }
  return [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]);
}

const typesSrc = read(join(src, "types.ts"));
const diagramNames = unionMembers(typesSrc, "DiagramName");
const widgetNames = unionMembers(typesSrc, "WidgetName");

const diagramSrc = read(join(src, "components", "Diagram.tsx"));
const registry = diagramSrc.match(/const diagrams: Record<DiagramName, \(\) => ReactElement> = \{([\s\S]*?)\n\};/);
const renderedDiagrams = registry
  ? [...registry[1].matchAll(/^\s+"?([a-z0-9-]+)"?:/gm)].map((match) => match[1])
  : [];
if (!registry) errors.push("Diagram.tsx の diagrams が読めません");

const usedDiagrams = [...sourceText.matchAll(/type:\s*"diagram",\s*name:\s*"([^"]+)"/g)].map((match) => match[1]);
const usedWidgets = [...sourceText.matchAll(/type:\s*"widget",\s*name:\s*"([^"]+)"/g)].map((match) => match[1]);

for (const name of new Set(usedDiagrams)) {
  if (!diagramNames.includes(name)) errors.push(`未定義の図名: ${name}`);
}
for (const name of new Set(usedWidgets)) {
  if (!widgetNames.includes(name)) errors.push(`未定義のウィジェット名: ${name}`);
}
for (const name of diagramNames) {
  if (!renderedDiagrams.includes(name)) errors.push(`Diagram.tsx に描画がありません: ${name}`);
  if (!usedDiagrams.includes(name)) errors.push(`本文から参照されていない図: ${name}`);
}

const referencedImages = [...sourceText.matchAll(/\/images\/([a-z0-9-]+\.jpg)/g)].map((match) => match[1]);
const cssText = read(join(src, "styles", "index.css"));
referencedImages.push(...[...cssText.matchAll(/\/images\/([a-z0-9-]+\.jpg)/g)].map((match) => match[1]));
const uniqueImages = [...new Set(referencedImages)];
const imageDir = join(root, "public", "images");

for (const name of uniqueImages) {
  if (!existsSync(join(imageDir, name))) errors.push(`画像がありません: public/images/${name}`);
}

const sources = read(join(imageDir, "SOURCES.md"));
for (const name of uniqueImages) {
  if (!sources.includes(name)) errors.push(`SOURCES.md に無い画像: ${name}`);
}

const onDisk = readdirSync(imageDir).filter((name) => name.endsWith(".jpg"));
for (const name of onDisk) {
  if (!uniqueImages.includes(name)) errors.push(`参照されていない画像: public/images/${name}`);
}

const answerIndexes = [...quizzesSrc.matchAll(/answer:\s*(\d+)/g)].map((match) => Number(match[1]));
const choiceBlocks = [...quizzesSrc.matchAll(/choices:\s*\[([\s\S]*?)\],\s*answer:\s*(\d+)/g)];
for (const match of choiceBlocks) {
  const count = [...match[1].matchAll(/"/g)].length / 2;
  const answer = Number(match[2]);
  if (answer < 0 || answer >= count) errors.push(`クイズの answer が範囲外: ${answer} / ${count}`);
}

if (errors.length) {
  console.error("check-content 失敗:\n" + errors.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(
  `check-content OK: quizzes ${definedQuizzes.size}, images ${uniqueImages.length}, diagrams ${diagramNames.length}`,
);
