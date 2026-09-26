import { useEffect, useRef, useState } from "react";
import type { HeadingEntry } from "../lib/headings";
import { scrollBelowTopbar, USER_SCROLL_EVENTS } from "../lib/scrollBelowTopbar";
import { PageToc } from "./PageToc";
import { TextWithTerms } from "./TextWithTerms";

// level 4 の項目を目次に出す幅。CSS の .toc-level-4 と合わせる
const ROWS_QUERY = "(max-width: 640px)";

export function ArticleToc({ headings }: { headings: HeadingEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [rowsShown, setRowsShown] = useState(() => window.matchMedia(ROWS_QUERY).matches);
  // 目次から選んだ見出しは、利用者が自分でスクロールし始めるまで選んだまま残す
  const pickedRef = useRef(false);

  useEffect(() => {
    const query = window.matchMedia(ROWS_QUERY);
    const onChange = () => setRowsShown(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;
    // 隠れている項目を追うと、見えている目次のどれも選ばれなくなる
    const elements = headings
      .filter((h) => h.level < 4 || rowsShown)
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // 画面の上から3割の線を越えた最後の見出しを、いま読んでいる見出しにする。
    // 最初の見出しより上では何も選ばない。末尾まで来たら、画面内に入った最後の見出しまで進める
    let frame = 0;
    const update = () => {
      frame = 0;
      if (pickedRef.current) return;
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
    const release = () => {
      pickedRef.current = false;
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    USER_SCROLL_EVENTS.forEach((type) => window.addEventListener(type, release, { passive: true }));
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      USER_SCROLL_EVENTS.forEach((type) => window.removeEventListener(type, release));
    };
  }, [headings, rowsShown]);

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
                const target = document.getElementById(heading.id);
                if (!target) return;
                pickedRef.current = true;
                setActiveId(heading.id);
                scrollBelowTopbar(target);
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
