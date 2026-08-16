import { useState } from "react";
import { requestFlow } from "../data/labs";
import { TextWithTerms } from "./TextWithTerms";
import { CodeBlock } from "./CodeBlock";
import { Icon, flowLayerIcon } from "./Icon";
import { tabPanelProps, tabProps, useTabList } from "../hooks/useTabList";

export function RequestFlow() {
  const [active, setActive] = useState(0);
  const step = requestFlow[active];
  const { listRef, onKeyDown } = useTabList(requestFlow.length, active, setActive);

  return (
    <section className="widget">
      <div className="widget-head">
        <div>
          <p className="kicker">REQUEST TRACE</p>
          <strong>
            申請一覧を開く — {active + 1} / {requestFlow.length}
          </strong>
        </div>
        <div className="widget-actions">
          <button className="btn btn-ghost" type="button" onClick={() => setActive((v) => Math.max(0, v - 1))}>
            <Icon name="arrow-left" size={16} />
            戻る
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => setActive((v) => Math.min(requestFlow.length - 1, v + 1))}
          >
            次の区間
            <Icon name="arrow-right" size={16} />
          </button>
        </div>
      </div>
      <div
        className="widget-nav flow"
        role="tablist"
        aria-label="リクエストの区間"
        ref={listRef}
        onKeyDown={onKeyDown}
      >
        {requestFlow.map((item, index) => (
          <button
            key={item.id}
            className={`flow-step ${index === active ? "active" : ""}`}
            type="button"
            {...tabProps("flow", index, index === active)}
            onClick={() => setActive(index)}
          >
            <span className="tag">{String(index + 1).padStart(2, "0")}</span>
            <span className="flow-copy">
              <small>
                <Icon name={flowLayerIcon(item.layer)} size={12} />
                {item.layer}
              </small>
              <strong>{item.title}</strong>
            </span>
          </button>
        ))}
      </div>
      <div className="widget-main" {...tabPanelProps("flow", active)}>
        <h3>{step.title}</h3>
        <p>
          <TextWithTerms text={step.detail} />
        </p>
        {step.code ? <CodeBlock code={step.code} title={step.layer} /> : null}
      </div>
    </section>
  );
}
