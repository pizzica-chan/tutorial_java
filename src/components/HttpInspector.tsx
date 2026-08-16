import { httpSample } from "../data/labs";
import { TextWithTerms } from "./TextWithTerms";
import { CodeBlock } from "./CodeBlock";

export function HttpInspector() {
  return (
    <section className="widget">
      <div className="widget-head">
        <div>
          <p className="kicker">HTTP</p>
          <strong>申請一覧を開いた瞬間</strong>
        </div>
      </div>
      <div className="http-grid">
        <div className="http-pane">
          <p className="kicker">REQUEST</p>
          <CodeBlock code={httpSample.request} lang="http" title="ブラウザ → サーバ" />
        </div>
        <div className="http-pane">
          <p className="kicker">RESPONSE</p>
          <CodeBlock code={httpSample.response} lang="http" title="サーバ → ブラウザ" />
        </div>
      </div>
      <ul className="http-notes">
        {httpSample.notes.map((note) => (
          <li key={note.label}>
            <span className="tag">{note.label}</span>
            <span>
              <TextWithTerms text={note.text} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
