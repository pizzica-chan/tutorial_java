import type { Block } from "../types";
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

type Doc = {
  href: string;
  title: string;
  crumb: string;
  text: string;
};

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
    default:
      return "";
  }
}

const documents: Doc[] = [
  ...tracks.flatMap((track) =>
    track.lessons.map((lesson) => ({
      href: `/tracks/${track.id}/${lesson.id}`,
      title: lesson.title,
      crumb: `${track.no} ${track.title}`,
      text: [track.title, lesson.title, lesson.summary, ...lesson.blocks.map(blockText)].join("\n"),
    })),
  ),
  ...terms.map((item) => ({
    href: `/glossary#${glossaryAnchor(item.term)}`,
    title: item.term,
    crumb: "用語集",
    text: [item.term, ...item.aliases, item.body].join("\n"),
  })),
  {
    href: "/lab",
    title: "ラボ",
    crumb: "LAB",
    text: [
      "ラボ ソースツリー HTTP リクエスト追跡 スタックトレース 申請くん",
      ...projectFiles.map((file) => [file.path, file.note, file.why, file.code].join("\n")),
      ...requestFlow.map((step) => [step.title, step.detail, step.code ?? ""].join("\n")),
      ...stackCases.flatMap((item) => [item.title, item.symptom, ...item.lines.map((line) => `${line.text} ${line.note}`)]),
      httpSample.request,
      httpSample.response,
      ...httpSample.notes.map((note) => `${note.label} ${note.text}`),
    ].join("\n"),
  },
];

function snippetAround(text: string, query: string) {
  const lower = text.toLowerCase();
  const at = lower.indexOf(query);
  if (at < 0) return text.replace(/\s+/g, " ").slice(0, 88);
  const start = Math.max(0, at - 22);
  const end = Math.min(text.length, at + query.length + 52);
  const slice = text.slice(start, end).replace(/\s+/g, " ").trim();
  return `${start > 0 ? "…" : ""}${slice}${end < text.length ? "…" : ""}`;
}

export function searchSite(query: string): SearchHit[] {
  const needle = query.trim().normalize("NFKC").toLowerCase();
  if (!needle) return [];

  return documents
    .map((doc) => {
      const titleHit = doc.title.toLowerCase().includes(needle);
      const bodyHit = doc.text.toLowerCase().includes(needle);
      if (!titleHit && !bodyHit) return null;
      return {
        href: doc.href,
        title: doc.title,
        crumb: doc.crumb,
        snippet: snippetAround(doc.text, needle),
        rank: titleHit ? 0 : 1,
      };
    })
    .filter((hit): hit is SearchHit & { rank: number } => hit !== null)
    .sort((a, b) => a.rank - b.rank || a.title.localeCompare(b.title, "ja"))
    .slice(0, 12)
    .map(({ rank: _rank, ...hit }) => hit);
}
