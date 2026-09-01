import { useEffect, useRef, useState } from "react";
import type { HeadingEntry } from "../lib/headings";

export function ArticleToc({ headings }: { headings: HeadingEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const firstVisible = headings.find((h) => visible.has(h.id));
        if (firstVisible) setActiveId(firstVisible.id);
      },
      { rootMargin: "-72px 0px -70% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="article-toc" aria-label="この記事の目次" ref={navRef}>
      <p className="article-toc-label">この記事の目次</p>
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
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
