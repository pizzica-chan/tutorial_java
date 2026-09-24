import { useEffect, useState } from "react";
import type { HeadingEntry } from "../lib/headings";
import { PageToc } from "./PageToc";
import { TextWithTerms } from "./TextWithTerms";

export function ArticleToc({ headings }: { headings: HeadingEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // 画面の上から3割の線を越えた最後の見出しを、いま読んでいる見出しにする。
    // 最初の見出しより上では何も選ばない。末尾まで来たら、画面内に入った最後の見出しまで進める
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      let current: string | null = null;
      for (const el of elements) {
        const top = el.getBoundingClientRect().top;
        if (top < line || (atBottom && top < window.innerHeight)) current = el.id;
      }
      setActiveId(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <PageToc label="この記事の目次" ariaLabel="この記事の目次">
      <ul>
        {headings.map((heading) => (
          <li key={heading.id} className={`toc-level-${heading.level}`}>
            <a
              href={`#${heading.id}`}
              className={activeId === heading.id ? "active" : ""}
              onClick={(event) => {
                event.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                history.replaceState(null, "", `#${heading.id}`);
              }}
            >
              <TextWithTerms text={heading.text} highlight={false} />
            </a>
          </li>
        ))}
      </ul>
    </PageToc>
  );
}
