import { tracks } from "./curriculum";
import { terms } from "./terms";

export type ChapterHit = {
  title: string;
  href: string;
  kind: "chapter" | "lesson";
};

export type ChapterPart =
  | { type: "text"; value: string }
  | { type: "chapter"; value: string; hit: ChapterHit };

function insertAsciiJaSpaces(title: string): string {
  return title
    .replace(/([A-Za-z0-9])([^\x00-\x7F])/g, "$1 $2")
    .replace(/([^\x00-\x7F])([A-Za-z0-9])/g, "$1 $2");
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type Matcher = {
  alias: string;
  pattern: string;
  hit: ChapterHit;
};

const SKIP = new Set(["はじめに"]);
const termNames = new Set(terms.flatMap((item) => [item.term, ...item.aliases]));

function toMatchers(aliasSet: Set<string>, hit: ChapterHit): Matcher[] {
  return [...aliasSet].map((alias) => {
    const escaped = escapeRegex(alias);
    const pattern = /^[\x00-\x7F]+$/.test(alias)
      ? `(?<![A-Za-z0-9_])${escaped}(?![A-Za-z0-9_])`
      : /^[A-Za-z0-9]/.test(alias)
        ? `(?<![A-Za-z0-9_])${escaped}`
        : escaped;
    return { alias, pattern, hit };
  });
}

function titleAliases(title: string): Set<string> {
  return new Set([title, insertAsciiJaSpaces(title), title.replace(/\s+/g, "")]);
}

const matchers: Matcher[] = tracks
  .filter((track) => !SKIP.has(track.title))
  .flatMap((track) => {
    const chapterHit: ChapterHit = { title: track.title, href: `/tracks/${track.id}`, kind: "chapter" };
    const aliases = titleAliases(track.title);
    if (track.id === "scenario") aliases.add("シナリオ章");
    const chapterMatchers = toMatchers(aliases, chapterHit);
    const lessonMatchers = track.lessons
      .filter((lesson) => !termNames.has(lesson.title))
      .flatMap((lesson) =>
        toMatchers(titleAliases(lesson.title), {
          title: lesson.title,
          href: `/tracks/${track.id}/${lesson.id}`,
          kind: "lesson",
        }),
      );
    return [...chapterMatchers, ...lessonMatchers];
  })
  .sort((a, b) => b.alias.length - a.alias.length);

const chapterRegex = new RegExp(matchers.map((item) => item.pattern).join("|"), "g");

const aliasLookup = new Map<string, ChapterHit>();
for (const item of matchers) {
  aliasLookup.set(item.alias, item.hit);
}

export function splitByChapters(text: string): ChapterPart[] {
  const parts: ChapterPart[] = [];
  chapterRegex.lastIndex = 0;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = chapterRegex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ type: "text", value: text.slice(last, match.index) });
    }
    const raw = match[0];
    const hit = aliasLookup.get(raw) ?? aliasLookup.get(raw.replace(/\s+/g, ""));
    if (hit) {
      parts.push({ type: "chapter", value: raw, hit });
    } else {
      parts.push({ type: "text", value: raw });
    }
    last = match.index + raw.length;
  }
  if (last < text.length) {
    parts.push({ type: "text", value: text.slice(last) });
  }
  chapterRegex.lastIndex = 0;
  return parts;
}
