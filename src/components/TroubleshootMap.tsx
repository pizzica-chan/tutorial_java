import { useState } from "react";
import { Link } from "react-router-dom";
import { troubleshootMap } from "../data/troubleshootMap";
import { TextWithTerms } from "./TextWithTerms";
import { Icon } from "./Icon";

export function TroubleshootMap() {
  const [bucketId, setBucketId] = useState<string | null>(null);
  const [leafIndex, setLeafIndex] = useState<number | null>(null);

  const bucket = troubleshootMap.find((b) => b.id === bucketId) ?? null;
  const leaf = bucket && leafIndex !== null ? (bucket.leaves[leafIndex] ?? null) : null;

  const selectBucket = (id: string) => {
    setBucketId(id);
    setLeafIndex(null);
  };

  return (
    <section className="widget troubleshoot-map">
      <div className="widget-head">
        <div>
          <p className="kicker">症状から探す</p>
          <strong>{bucket ? "症状に近いものを選びましょう" : "原因はどこに近そうですか？"}</strong>
        </div>
      </div>

      <div className="troubleshoot-map-crumb">
        <button
          type="button"
          className={`troubleshoot-map-crumb-item ${bucket ? "" : "current"}`}
          onClick={() => {
            setBucketId(null);
            setLeafIndex(null);
          }}
        >
          原因の当たり
        </button>
        {bucket ? (
          <>
            <Icon name="arrow-right" size={12} />
            <button
              type="button"
              className={`troubleshoot-map-crumb-item ${leaf ? "" : "current"}`}
              onClick={() => setLeafIndex(null)}
            >
              {bucket.label}
            </button>
          </>
        ) : null}
        {leaf ? (
          <>
            <Icon name="arrow-right" size={12} />
            <span className="troubleshoot-map-crumb-item current">症状</span>
          </>
        ) : null}
      </div>

      {!bucket ? (
        <div className="troubleshoot-map-grid">
          {troubleshootMap.map((b) => (
            <button key={b.id} type="button" className="troubleshoot-map-node" onClick={() => selectBucket(b.id)}>
              <strong>{b.label}</strong>
              <span>{b.hint}</span>
            </button>
          ))}
        </div>
      ) : null}

      {bucket && !leaf ? (
        <div className="troubleshoot-map-grid">
          {bucket.leaves.map((item, index) => (
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
      ) : null}

      {leaf ? (
        <div className="troubleshoot-map-result">
          <p className="troubleshoot-map-symptom">
            <TextWithTerms text={leaf.symptom} highlight={false} />
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
