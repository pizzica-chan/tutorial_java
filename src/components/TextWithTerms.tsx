import { splitByTerms } from "../data/terms";
import { TermMark } from "./TermMark";

export function TextWithTerms({ text, highlight = true }: { text: string; highlight?: boolean }) {
  if (!highlight) return text;

  return (
    <>
      {splitByTerms(text).map((part, index) =>
        part.type === "text" ? (
          <span key={index}>{part.value}</span>
        ) : (
          <TermMark key={index} def={part.def} text={part.value} />
        ),
      )}
    </>
  );
}
