import { useState } from "react";
import { stackCases, stackKindLabel } from "../data/labs";
import { TextWithTerms } from "./TextWithTerms";

export function StackLab() {
  const [caseId, setCaseId] = useState(stackCases[0].id);
  const [line, setLine] = useState(0);
  const current = stackCases.find((item) => item.id === caseId) ?? stackCases[0];
  const active = current.lines[line] ?? current.lines[0];

  return (
    <section className="widget">
      <div className="widget-head">
        <div>
          <p className="kicker">STACK TRACE LAB</p>
          <strong>右端がソースの位置</strong>
        </div>
        <div className="widget-actions">
          {stackCases.map((item) => (
            <button
              key={item.id}
              className={`btn ${item.id === caseId ? "btn-primary" : "btn-ghost"}`}
              type="button"
              onClick={() => {
                setCaseId(item.id);
                setLine(0);
              }}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
      <p className="stack-legend">
        <span className="stack-badge app">自作</span>
        会社名で始まる行を先に見る。
        <span className="stack-badge framework">FW</span>
        <span className="stack-badge jdk">JDK</span>
        は書いていないコードなので飛ばす。
      </p>
      <div className="stack-pane">
        {current.lines.map((item, index) => (
          <button
            key={item.text}
            className={`stack-line kind-${item.kind} ${index === line ? "active" : ""}`}
            type="button"
            onClick={() => setLine(index)}
          >
            <span className={`stack-badge ${item.kind}`}>{stackKindLabel[item.kind]}</span>
            <span className="stack-text">{item.text}</span>
          </button>
        ))}
      </div>
      <div className="widget-main stack-notes">
        <div>
          <p className="kicker">SYMPTOM</p>
          <p>
            <TextWithTerms text={current.symptom} />
          </p>
        </div>
        <div>
          <p className="kicker">THIS LINE</p>
          <p>
            <TextWithTerms text={active.note} />
          </p>
        </div>
      </div>
    </section>
  );
}
