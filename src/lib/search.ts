import type { Block, WidgetName } from "../types";
import { tracks } from "../data/curriculum";
import { getQuiz } from "../data/quizzes";
import { glossaryAnchor, terms } from "../data/terms";
import { projectFiles } from "../data/project";
import { httpSample, requestFlow, stackCases } from "../data/labs";
import { blockAnchorIds, lessonRowAnchor } from "./anchors";
import { cheatSheet } from "../data/cheatsheet";
import { troubleshootMap } from "../data/troubleshootMap";

export type SearchHit = {
  href: string;
  title: string;
  crumb: string;
  snippet: string;
};

function stripCodeMarks(value: string): string {
  return value.replaceAll("`", "");
}

function normalizeForSearch(value: string): string {
  return stripCodeMarks(value).normalize("NFKC").toLowerCase();
}

/** 一致した箇所へ飛ぶための本文の一区切り。anchor が無いものはページの先頭を指す */
type Part = { anchor?: string; text: string };
type Segment = Part & { textN: string };

type Doc = {
  href: string;
  title: string;
  crumb: string;
  text: string;
  titleN: string;
  textN: string;
  kind: "page" | "glossary";
  segments: Segment[];
};

function toDoc(
  href: string,
  title: string,
  crumb: string,
  text: string,
  kind: Doc["kind"] = "page",
  parts?: Part[],
): Doc {
  const segments: Segment[] = parts
    ? parts
        .filter((part) => part.text.trim() !== "")
        .map((part) => ({ ...part, textN: normalizeForSearch(part.text) }))
    : [{ text, textN: normalizeForSearch(text) }];
  return {
    href,
    title,
    crumb,
    text,
    titleN: normalizeForSearch(title),
    textN: normalizeForSearch(text),
    kind,
    segments,
  };
}

function blockText(block: Block): string {
  switch (block.type) {
    case "p":
    case "h2":
    case "h3":
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
      return block.caption ?? "";
    case "figure":
      return [block.alt, block.caption].filter(Boolean).join("\n");
    case "table":
      return [
        block.headers.join(" "),
        ...(block.rows.length > 0 ? block.rows.map((row) => row.join(" ")) : [block.empty ?? "0 行"]),
      ].join("\n");
    case "steps":
      return block.items.map((item) => `${item.title}\n${item.text}`).join("\n");
    case "investigation-flow":
      return block.items
        .flatMap((item) => {
          if (typeof item === "string") return [item];
          return item.tracks.flatMap((track) => [track.label ?? "", ...track.steps]);
        })
        .filter(Boolean)
        .join("\n");
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
    case "troubleshoot-map":
      return troubleshootMap
        .flatMap((group) => [
          group.label,
          ...group.leaves.map((leaf) => `${leaf.symptom}\n${leaf.check}\n${leaf.tells}`),
        ])
        .join("\n");
    default:
      return "";
  }
}

const documents: Doc[] = [
  toDoc(
    "/",
    "参画前に知っておきたい Java Web アプリ",
    "トップ",
    "既存のソースを追い、リクエストがどこまで届いたかで切り分ける。申請くん。HTTP。処理の入口。",
  ),
  ...tracks.map((track) =>
    toDoc(
      `/tracks/${track.id}`,
      track.title,
      `${track.no} 章`,
      [track.title, track.kicker, track.description, ...track.lessons.map((lesson) => lesson.title)].join("\n"),
      "page",
      [
        { text: [track.title, track.kicker, track.description].join("\n") },
        ...track.lessons.map((lesson) => ({ anchor: lessonRowAnchor(lesson.id), text: lesson.title })),
      ],
    ),
  ),
  ...tracks.flatMap((track) =>
    track.lessons.map((lesson) => {
      const anchors = blockAnchorIds(lesson.blocks);
      return toDoc(
        `/tracks/${track.id}/${lesson.id}`,
        lesson.title,
        `${track.no} ${track.title}`,
        [track.title, lesson.title, ...lesson.blocks.map(blockText)].join("\n"),
        "page",
        [
          { text: [track.title, lesson.title].join("\n") },
          ...lesson.blocks.map((block, index) => ({ anchor: anchors[index], text: blockText(block) })),
        ],
      );
    }),
  ),
  toDoc("/glossary", "用語集", "GLOSSARY", ["用語集", "用語ヒント", ...terms.map((item) => item.term)].join("\n")),
  ...terms.map((item) =>
    toDoc(
      `/glossary#${glossaryAnchor(item.term)}`,
      item.term,
      "用語集",
      [item.term, ...item.aliases, item.body].join("\n"),
      "glossary",
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
  toDoc(
    "/cheatsheet",
    "チートシート",
    "CHEAT SHEET",
    [
      "チートシート コマンド 早見表",
      ...cheatSheet.flatMap((section) => [
        section.title,
        ...section.groups.flatMap((group) => [
          group.title,
          ...group.rows.map((row) => `${row.cmd} ${row.env} ${row.desc}`),
        ]),
      ]),
    ].join("\n"),
  ),
];

function snippetAround(original: string, needle: string) {
  const source = stripCodeMarks(original);
  const lower = source.toLowerCase();
  let at = lower.indexOf(needle);
  if (at < 0) {
    const normalized = source.normalize("NFKC").toLowerCase();
    at = normalized.indexOf(needle);
    if (at < 0 || source.length !== normalized.length) {
      return source.replace(/\s+/g, " ").slice(0, 88);
    }
  }
  const start = Math.max(0, at - 22);
  const end = Math.min(source.length, at + needle.length + 52);
  const slice = source.slice(start, end).replace(/\s+/g, " ").trim();
  return `${start > 0 ? "…" : ""}${slice}${end < source.length ? "…" : ""}`;
}

export function searchSite(query: string): SearchHit[] {
  const needle = normalizeForSearch(query.trim());
  if (!needle) return [];

  return documents
    .map((doc) => {
      const titleHit = doc.titleN.includes(needle);
      const bodyHit = doc.textN.includes(needle);
      if (!titleHit && !bodyHit) return null;
      const exactTitle = doc.titleN === needle;
      const glossary = doc.kind === "glossary";
      // レッスン・章・トップなどの本文ページを、用語集より先に出す。完全一致だけは種類を問わず最優先
      let rank: number;
      if (exactTitle) rank = 0;
      else if (!glossary && titleHit) rank = 1;
      else if (!glossary && bodyHit) rank = 2;
      else if (glossary && titleHit) rank = 3;
      else rank = 4;
      // タイトルに当たったときはページの先頭へ。本文に当たったときは、その箇所のアンカーを付ける
      const segment = titleHit ? undefined : doc.segments.find((item) => item.textN.includes(needle));
      return {
        href: segment?.anchor ? `${doc.href}#${segment.anchor}` : doc.href,
        title: doc.title,
        crumb: doc.crumb,
        snippet: snippetAround(titleHit ? doc.title : (segment?.text ?? doc.text), needle),
        rank,
      };
    })
    .filter((hit): hit is SearchHit & { rank: number } => hit !== null)
    .sort((a, b) => a.rank - b.rank || a.title.localeCompare(b.title, "ja"))
    .slice(0, 24)
    .map(({ rank: _rank, ...hit }) => hit);
}
