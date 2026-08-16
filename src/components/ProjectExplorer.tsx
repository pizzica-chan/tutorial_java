import { useState } from "react";
import { projectFiles } from "../data/project";
import { TextWithTerms } from "./TextWithTerms";
import { CodeBlock } from "./CodeBlock";
import { tabPanelProps, tabProps, useTabList } from "../hooks/useTabList";

export function ProjectExplorer() {
  const [active, setActive] = useState(0);
  const file = projectFiles[active] ?? projectFiles[0];
  const { listRef, onKeyDown } = useTabList(projectFiles.length, active, setActive);

  return (
    <section className="widget">
      <div className="widget-head">
        <div>
          <p className="kicker">SAMPLE APP</p>
          <strong>申請くん — ソースを開く</strong>
        </div>
        <span className="tag">Spring Boot 2.7</span>
      </div>
      <div className="widget-nav" role="tablist" aria-label="申請くんのファイル" ref={listRef} onKeyDown={onKeyDown}>
        {projectFiles.map((item, index) => {
          const name = item.path.split("/").slice(-1)[0];
          const selected = index === active;
          return (
            <button
              key={item.path}
              type="button"
              {...tabProps("explorer", index, selected)}
              className={`widget-chip ${selected ? "active" : ""}`}
              title={item.path}
              onClick={() => setActive(index)}
            >
              {name}
            </button>
          );
        })}
      </div>
      <div className="widget-main" {...tabPanelProps("explorer", active)}>
        <p className="widget-path">{file.path}</p>
        <h3>{file.note}</h3>
        <p>
          <TextWithTerms text={file.why} />
        </p>
        <CodeBlock code={file.code} path={file.path} title="抜粋" />
      </div>
    </section>
  );
}
