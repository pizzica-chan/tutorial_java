import { Link } from "react-router-dom";
import type { ChapterHit } from "../data/chapterRefs";

export function ChapterMark({ hit, text }: { hit: ChapterHit; text: string }) {
  return (
    <Link
      className="chapter-ref"
      to={hit.href}
      title={hit.kind === "lesson" ? `レッスン「${hit.title}」` : `章「${hit.title}」`}
    >
      {text}
    </Link>
  );
}
