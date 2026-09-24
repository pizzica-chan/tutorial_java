import type { GlossaryGroup } from "../data/terms";
import { scrollToHeading } from "../lib/scrollToHeading";
import { PageToc } from "./PageToc";

export function GlossaryIndex({ groups }: { groups: GlossaryGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <PageToc label="索引" ariaLabel="用語集の索引" className="glossary-index">
      <ul>
        {groups.map((group) => (
          <li key={group.key}>
            <a
              href={`#idx-${group.key}`}
              onClick={(event) => {
                event.preventDefault();
                const target = document.getElementById(`idx-${group.key}`);
                if (target) scrollToHeading(target);
                history.replaceState(null, "", `#idx-${group.key}`);
              }}
            >
              {group.label}
            </a>
          </li>
        ))}
      </ul>
    </PageToc>
  );
}
