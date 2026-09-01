import { useState } from "react";
import { Link } from "react-router-dom";
import { troubleshootMap } from "../data/troubleshootMap";
import { TextWithTerms } from "./TextWithTerms";
import { Icon } from "./Icon";

type FlatLeaf = {
  bucketLabel: string;
  bucketHint: string;
  symptom: string;
  check: string;
  links: { label: string; to: string }[];
};

export function TroubleshootMap() {
  const [selected, setSelected] = useState<FlatLeaf | null>(null);

  return (
    <section className="widget troubleshoot-map">
      <div className="widget-head">
        <div>
          <p className="kicker">症状から探す</p>
          <strong>{selected ? "その症状は、こう当たりをつけます" : "今の症状に近いものを選びましょう"}</strong>
        </div>
      </div>

      {!selected ? (
        <div className="troubleshoot-map-groups">
          {troubleshootMap.map((bucket) => (
            <div className="troubleshoot-map-group" key={bucket.id}>
              <p className="troubleshoot-map-group-label">{bucket.label}が原因のことが多い症状</p>
              <div className="troubleshoot-map-grid">
                {bucket.leaves.map((leaf) => (
                  <button
                    key={leaf.symptom}
                    type="button"
                    className="troubleshoot-map-node"
                    onClick={() =>
                      setSelected({
                        bucketLabel: bucket.label,
                        bucketHint: bucket.hint,
                        symptom: leaf.symptom,
                        check: leaf.check,
                        links: leaf.links,
                      })
                    }
                  >
                    <TextWithTerms text={leaf.symptom} highlight={false} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="troubleshoot-map-result">
          <button type="button" className="troubleshoot-map-back" onClick={() => setSelected(null)}>
            <Icon name="arrow-left" size={14} />
            症状の一覧に戻る
          </button>
          <p className="troubleshoot-map-symptom">
            <TextWithTerms text={selected.symptom} highlight={false} />
          </p>
          <p className="troubleshoot-map-cause">
            原因の当たり：<strong>{selected.bucketLabel}</strong>（{selected.bucketHint}）
          </p>
          <p className="troubleshoot-map-check">
            <TextWithTerms text={selected.check} />
          </p>
          <div className="troubleshoot-map-links">
            {selected.links.map((link) => (
              <Link key={link.to} to={link.to} className="btn btn-primary">
                {link.label}
                <Icon name="arrow-right" size={14} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
