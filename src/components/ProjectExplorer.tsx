import { useState } from "react";
import { projectFiles } from "../data/project";
import { TextWithTerms } from "./TextWithTerms";
import { CodeBlock } from "./CodeBlock";

export function ProjectExplorer() {
  const [active, setActive] = useState(projectFiles[0].path);
  const file = projectFiles.find((item) => item.path === active) ?? projectFiles[0];

  return (
    <section className="widget">
      <div className="widget-head">
        <div>
          <p className="kicker">SAMPLE APP</p>
          <strong>申請くん — ソースを開く</strong>
        </div>
        <span className="tag">Spring Boot 2.7</span>
      </div>
      <div className="widget-nav">
        {projectFiles.map((item) => {
          const name = item.path.split("/").slice(-1)[0];
          return (
            <button
              key={item.path}
              type="button"
              className={`widget-chip ${item.path === active ? "active" : ""}`}
              title={item.path}
              onClick={() => setActive(item.path)}
            >
              {name}
            </button>
          );
        })}
      </div>
      <div className="widget-main">
        <p className="widget-path">{file.path}</p>
        <h3>{file.note}</h3>
        <p>
          <TextWithTerms text={file.why} />
        </p>
        <CodeBlock code={file.code} path={file.path} title="excerpt" />
      </div>
    </section>
  );
}
