import { useState } from "react";
import { firstAppLine, stackCases, stackKindLabel } from "../data/labs";
import { TextWithTerms } from "./TextWithTerms";
import { tabPanelProps, tabProps, useTabList } from "../hooks/useTabList";

export function StackLab() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [line, setLine] = useState(() => firstAppLine(stackCases[0]));
  const current = stackCases[caseIndex] ?? stackCases[0];
  const active = current.lines[line] ?? current.lines[0];

  const selectCase = (index: number) => {
    setCaseIndex(index);
    setLine(firstAppLine(stackCases[index]));
  };
  const { listRef, onKeyDown } = useTabList(stackCases.length, caseIndex, selectCase);

  return (
    <section className="widget">
      <div className="widget-head">
        <div>
          <p className="kicker">STACK TRACE LAB</p>
          <strong>右端がソースの位置</strong>
        </div>
        <div className="widget-actions" role="tablist" aria-label="スタックの例" ref={listRef} onKeyDown={onKeyDown}>
          {stackCases.map((item, index) => (
            <button
              key={item.id}
              className={`btn ${index === caseIndex ? "btn-primary" : "btn-ghost"}`}
              type="button"
              {...tabProps("stack", index, index === caseIndex)}
              onClick={() => selectCase(index)}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
      <div {...tabPanelProps("stack", caseIndex)}>
        <p className="stack-legend">
          <span className="stack-badge app">自作</span>
          自分たちが書いたコードのパッケージ名の行を先に見る。
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
              aria-current={index === line}
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
      </div>
    </section>
  );
}
