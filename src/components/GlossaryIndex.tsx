import type { GlossaryGroup } from "../data/terms";

export function GlossaryIndex({ groups }: { groups: GlossaryGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <nav className="article-toc glossary-index" aria-label="用語集の索引">
      <p className="article-toc-label">索引</p>
      <ul>
        {groups.map((group) => (
          <li key={group.key}>
            <a
              href={`#idx-${group.key}`}
              onClick={(event) => {
                event.preventDefault();
                document.getElementById(`idx-${group.key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                history.replaceState(null, "", `#idx-${group.key}`);
              }}
            >
              {group.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
