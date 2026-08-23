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

export function TextWithTerms({
  text,
  highlight = true,
  linkTerms = true,
}: {
  text: string;
  highlight?: boolean;
  linkTerms?: boolean;
}) {
  const isFirst = useContext(TermSeenContext);
  if (!highlight) return text;

  return (
    <>
      {splitByChapters(text).flatMap((chunk, chunkIndex) => {
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
