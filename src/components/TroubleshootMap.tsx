import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { causeHints, troubleshootMap } from "../data/troubleshootMap";
import { TextWithTerms } from "./TextWithTerms";
import { Icon } from "./Icon";

const HEADING_ID = "troubleshoot-map-heading";

export function TroubleshootMap() {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [leafIndex, setLeafIndex] = useState<number | null>(null);

  const group = troubleshootMap.find((g) => g.id === groupId) ?? null;
  const leaf = group && leafIndex !== null ? (group.leaves[leafIndex] ?? null) : null;

  const viewRef = useRef<HTMLDivElement>(null);
  // 戻るを押したとき、焦点を返すボタンの data-node
  const restoreNode = useRef<string | null>(null);
  const firstRender = useRef(true);

  // 画面が丸ごと入れ替わるので、切り替えたあとの焦点を明示的に置き直す
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const node = restoreNode.current;
    restoreNode.current = null;
    const target = node ? viewRef.current?.querySelector<HTMLElement>(`[data-node="${node}"]`) : null;
    (target ?? viewRef.current)?.focus();
  }, [groupId, leafIndex]);

  const backToGroups = () => {
    restoreNode.current = groupId;
    setGroupId(null);
    setLeafIndex(null);
  };
  const backToSymptoms = () => {
    restoreNode.current = leafIndex === null ? null : String(leafIndex);
    setLeafIndex(null);
  };

  const heading = leaf
    ? "その症状は、こう当たりをつけます"
    : group
      ? `「${group.label}」の症状から選びましょう`
      : "画面の様子に近いものを選びましょう";

  return (
    <section className="widget troubleshoot-map" aria-label="症状から探す">
      <div className="widget-head">
        <div>
          <p className="kicker">SYMPTOM MAP</p>
          <strong id={HEADING_ID}>{heading}</strong>
        </div>
      </div>

      <div className="troubleshoot-map-view" ref={viewRef} tabIndex={-1} role="group" aria-labelledby={HEADING_ID}>
        {!group ? (
          <div className="troubleshoot-map-grid">
            {troubleshootMap.map((g) => (
              <button
                key={g.id}
                type="button"
                data-node={g.id}
                className="troubleshoot-map-node"
                onClick={() => setGroupId(g.id)}
              >
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
                  data-node={String(index)}
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
              原因の当たり：
              {leaf.cause.map((side, index) => (
                <span key={side}>
                  {index > 0 ? " か " : null}
                  <strong>{side}</strong>
                </span>
              ))}
              （{leaf.causeNote ?? leaf.cause.map((side) => causeHints[side]).join("／")}）
            </p>
            <p className="troubleshoot-map-check">
              <strong>最初に確認すること：</strong>
              <TextWithTerms text={leaf.check} />
            </p>
            <p className="troubleshoot-map-tells">
              <strong>それで分かること：</strong>
              <TextWithTerms text={leaf.tells} />
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
      </div>
    </section>
  );
}
