import { tracks } from "./curriculum";

export type ChapterHit = {
  title: string;
  href: string;
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

const matchers: Matcher[] = tracks
  .filter((track) => !SKIP.has(track.title))
  .flatMap((track) => {
    const hit: ChapterHit = { title: track.title, href: `/tracks/${track.id}` };
    const aliases = new Set([track.title, insertAsciiJaSpaces(track.title), track.title.replace(/\s+/g, "")]);
    if (track.id === "scenario") aliases.add("シナリオ章");
    return [...aliases].map((alias) => {
      const escaped = escapeRegex(alias);
      const pattern = /^[\x00-\x7F]+$/.test(alias)
        ? `(?<![A-Za-z0-9_])${escaped}(?![A-Za-z0-9_])`
        : /^[A-Za-z0-9]/.test(alias)
          ? `(?<![A-Za-z0-9_])${escaped}`
          : escaped;
      return { alias, pattern, hit };
    });
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
