import type { Block, WidgetName } from "../types";
import { tracks } from "../data/curriculum";
import { getQuiz } from "../data/quizzes";
import { glossaryAnchor, terms } from "../data/terms";
import { projectFiles } from "../data/project";
import { httpSample, requestFlow, stackCases } from "../data/labs";

export type SearchHit = {
  href: string;
  title: string;
  crumb: string;
  snippet: string;
};

function normalizeForSearch(value: string): string {
  return value.normalize("NFKC").toLowerCase();
}

type Doc = {
  href: string;
  title: string;
  crumb: string;
  text: string;
  titleN: string;
  textN: string;
};

function toDoc(href: string, title: string, crumb: string, text: string): Doc {
  return {
    href,
    title,
    crumb,
    text,
    titleN: normalizeForSearch(title),
    textN: normalizeForSearch(text),
  };
}

function blockText(block: Block): string {
  switch (block.type) {
    case "p":
    case "h2":
      return block.text;
    case "ul":
    case "ol":
      return block.items.join("\n");
    case "code":
      return [block.title, block.code].filter(Boolean).join("\n");
    case "callout":
      return `${block.title}\n${block.text}`;
    case "quiz": {
      const quiz = getQuiz(block.id);
      if (!quiz) return "";
      return [quiz.question, ...quiz.choices, quiz.explanation].join("\n");
    }
    case "diagram":
    case "figure":
      return block.caption ?? "";
    case "table":
      return [block.headers.join(" "), ...block.rows.map((row) => row.join(" "))].join("\n");
    case "steps":
      return block.items.map((item) => `${item.title}\n${item.text}`).join("\n");
    case "widget":
      return widgetText(block.name);
    default:
      return "";
  }
}

function widgetText(name: WidgetName): string {
  switch (name) {
    case "explorer":
      return projectFiles.map((item) => `${item.path}\n${item.note}\n${item.why}`).join("\n");
    case "flow":
      return requestFlow.map((item) => `${item.layer}\n${item.title}\n${item.detail}`).join("\n");
    case "stack":
      return stackCases.map((item) => `${item.title}\n${item.symptom}`).join("\n");
    case "http":
      return `${httpSample.request}\n${httpSample.response}`;
    default:
      return "";
  }
}

const documents: Doc[] = [
  toDoc(
    "/",
    "参画前に知っておきたい Java Web",
    "トップ",
    "HTTP と Java Web アプリの構成、既存コードの追い方、よくある不具合パターン、シナリオでの切り分け。申請くん。",
  ),
  ...tracks.map((track) =>
    toDoc(
      `/tracks/${track.id}`,
      track.title,
      `${track.no} 章`,
      [track.title, track.kicker, track.description, ...track.lessons.map((lesson) => lesson.title)].join("\n"),
    ),
  ),
  ...tracks.flatMap((track) =>
    track.lessons.map((lesson) =>
      toDoc(
        `/tracks/${track.id}/${lesson.id}`,
        lesson.title,
        `${track.no} ${track.title}`,
        [track.title, lesson.title, ...lesson.blocks.map(blockText)].join("\n"),
      ),
    ),
  ),
  ...terms.map((item) =>
    toDoc(
      `/glossary#${glossaryAnchor(item.term)}`,
      item.term,
      "用語集",
      [item.term, ...item.aliases, item.body].join("\n"),
    ),
  ),
  toDoc(
    "/lab",
    "ラボ",
    "LAB",
    [
      "ラボ ソースツリー HTTP リクエスト追跡 スタックトレース 申請くん",
      ...projectFiles.map((file) => [file.path, file.note, file.why, file.code].join("\n")),
      ...requestFlow.map((step) => [step.title, step.detail, step.code ?? ""].join("\n")),
      ...stackCases.flatMap((item) => [item.title, item.symptom, ...item.lines.map((line) => `${line.text} ${line.note}`)]),
      httpSample.request,
      httpSample.response,
      ...httpSample.notes.map((note) => `${note.label} ${note.text}`),
    ].join("\n"),
  ),
];

function snippetAround(original: string, needle: string) {
  const lower = original.toLowerCase();
  let at = lower.indexOf(needle);
  if (at < 0) {
    const normalized = original.normalize("NFKC").toLowerCase();
    at = normalized.indexOf(needle);
    if (at < 0 || original.length !== normalized.length) {
      return original.replace(/\s+/g, " ").slice(0, 88);
    }
  }
  const start = Math.max(0, at - 22);
  const end = Math.min(original.length, at + needle.length + 52);
  const slice = original.slice(start, end).replace(/\s+/g, " ").trim();
  return `${start > 0 ? "…" : ""}${slice}${end < original.length ? "…" : ""}`;
}

export function searchSite(query: string): SearchHit[] {
  const needle = normalizeForSearch(query.trim());
  if (!needle) return [];

  return documents
    .map((doc) => {
      const titleHit = doc.titleN.includes(needle);
      const bodyHit = doc.textN.includes(needle);
      if (!titleHit && !bodyHit) return null;
      return {
        href: doc.href,
        title: doc.title,
        crumb: doc.crumb,
        snippet: snippetAround(titleHit ? doc.title : doc.text, needle),
        rank: titleHit ? 0 : 1,
      };
    })
    .filter((hit): hit is SearchHit & { rank: number } => hit !== null)
    .sort((a, b) => a.rank - b.rank || a.title.localeCompare(b.title, "ja"))
    .slice(0, 12)
    .map(({ rank: _rank, ...hit }) => hit);
}
