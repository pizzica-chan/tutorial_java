import { useState } from "react";
import { Link } from "react-router-dom";
import { troubleshootMap } from "../data/troubleshootMap";
import { TextWithTerms } from "./TextWithTerms";
import { Icon } from "./Icon";

export function TroubleshootMap() {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [leafIndex, setLeafIndex] = useState<number | null>(null);

  const group = troubleshootMap.find((g) => g.id === groupId) ?? null;
  const leaf = group && leafIndex !== null ? (group.leaves[leafIndex] ?? null) : null;

  const backToGroups = () => {
    setGroupId(null);
    setLeafIndex(null);
  };
  const backToSymptoms = () => setLeafIndex(null);

  return (
    <section className="widget troubleshoot-map">
      <div className="widget-head">
        <div>
          <p className="kicker">症状から探す</p>
          <strong>
            {leaf ? "その症状は、こう当たりをつけます" : group ? "近い症状を選びましょう" : "画面の様子に近いものを選びましょう"}
          </strong>
        </div>
      </div>

      {!group ? (
        <div className="troubleshoot-map-grid">
          {troubleshootMap.map((g) => (
            <button key={g.id} type="button" className="troubleshoot-map-node" onClick={() => setGroupId(g.id)}>
              {g.label}
            </button>
          ))}
        </div>
      ) : null}

      {group && !leaf ? (
        <div className="troubleshoot-map-result">
          <button type="button" className="troubleshoot-map-back" onClick={backToGroups}>
            <Icon name="arrow-left" size={14} />
            画面の様子の一覧に戻る
          </button>
          <div className="troubleshoot-map-grid">
            {group.leaves.map((item, index) => (
              <button
                key={item.symptom}
                type="button"
                className="troubleshoot-map-node"
                onClick={() => setLeafIndex(index)}
              >
                <TextWithTerms text={item.symptom} highlight={false} />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {leaf ? (
        <div className="troubleshoot-map-result">
          <button type="button" className="troubleshoot-map-back" onClick={backToSymptoms}>
            <Icon name="arrow-left" size={14} />
            症状の一覧に戻る
          </button>
          <p className="troubleshoot-map-symptom">
            <TextWithTerms text={leaf.symptom} highlight={false} />
          </p>
          <p className="troubleshoot-map-cause">
            原因の当たり：<strong>{leaf.causeLabel}</strong>（{leaf.causeHint}）
          </p>
          <p className="troubleshoot-map-check">
            <TextWithTerms text={leaf.check} />
          </p>
          <div className="troubleshoot-map-links">
            {leaf.links.map((link) => (
              <Link key={link.to} to={link.to} className="btn btn-primary">
                {link.label}
                <Icon name="arrow-right" size={14} />
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
