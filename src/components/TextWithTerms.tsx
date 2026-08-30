import { createContext, useContext, useRef, type ReactNode } from "react";
import { splitByChapters } from "../data/chapterRefs";
import { splitByTerms } from "../data/terms";
import { ChapterMark } from "./ChapterMark";
import { TermMark } from "./TermMark";

type ClaimFirst = (term: string) => boolean;

const TermSeenContext = createContext<ClaimFirst | undefined>(undefined);

/** 配下の用語は、その描画ごとの初出だけ Tab 止め（用語集リンク）にする */
export function TermHighlightScope({ children }: { children: ReactNode }) {
  const generation = useRef(0);
  const claimed = useRef(new Map<string, number>());
  generation.current += 1;
  const gen = generation.current;
  const isFirst: ClaimFirst = (term) => {
    if (claimed.current.get(term) === gen) return false;
    claimed.current.set(term, gen);
    return true;
  };
  return <TermSeenContext.Provider value={isFirst}>{children}</TermSeenContext.Provider>;
}

/** 配下で TermHighlightScope の初出判定を再利用したいコンポーネント（JavaCode など）向け */
export function useTermFirst(): ClaimFirst | undefined {
  return useContext(TermSeenContext);
}

function splitByCodeSpans(text: string): Array<{ type: "text" | "code"; value: string }> {
  const parts: Array<{ type: "text" | "code"; value: string }> = [];
  const pattern = /`([^`]+)`/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) {
      parts.push({ type: "text", value: text.slice(last, match.index) });
    }
    parts.push({ type: "code", value: match[1] });
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push({ type: "text", value: text.slice(last) });
  }
  return parts.length > 0 ? parts : [{ type: "text", value: text }];
}

export function TextWithTerms({
  text,
  highlight = true,
  linkTerms = true,
  linkChapters = true,
}: {
  text: string;
  highlight?: boolean;
  linkTerms?: boolean;
  linkChapters?: boolean;
}) {
  const isFirst = useContext(TermSeenContext);

  return (
    <>
      {splitByCodeSpans(text).map((span, spanIndex) => {
        if (span.type === "code") {
          return (
            <code key={`s-${spanIndex}`} className="code-span">
              {highlight ? (
                <MarkedText
                  text={span.value}
                  isFirst={isFirst}
                  linkTerms={linkTerms}
                  linkChapters={false}
                />
              ) : (
                span.value
              )}
            </code>
          );
        }
        if (!highlight) return <span key={`s-${spanIndex}`}>{span.value}</span>;
        return (
          <MarkedText
            key={`s-${spanIndex}`}
            text={span.value}
            isFirst={isFirst}
            linkTerms={linkTerms}
            linkChapters={linkChapters}
          />
        );
      })}
    </>
  );
}

function MarkedText({
  text,
  isFirst,
  linkTerms,
  linkChapters,
}: {
  text: string;
  isFirst: ClaimFirst | undefined;
  linkTerms: boolean;
  linkChapters: boolean;
}) {
  const chunks = linkChapters ? splitByChapters(text) : [{ type: "text" as const, value: text }];

  return (
    <>
      {chunks.flatMap((chunk, chunkIndex) => {
        if (chunk.type === "chapter") {
          return <ChapterMark key={`c-${chunkIndex}`} hit={chunk.hit} text={chunk.value} />;
        }
        return splitByTerms(chunk.value).map((part, index) => {
          if (part.type === "text") {
            return <span key={`t-${chunkIndex}-${index}`}>{part.value}</span>;
          }
          const toGlossary = linkTerms && (isFirst ? isFirst(part.def.term) : true);
          return (
            <TermMark
              key={`t-${chunkIndex}-${index}`}
              def={part.def}
              text={part.value}
              toGlossary={toGlossary}
            />
          );
        });
      })}
    </>
  );
}
