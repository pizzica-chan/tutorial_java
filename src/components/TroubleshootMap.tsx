import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { causeHints, troubleshootMap, type CauseSide, type MapLeaf } from "../data/troubleshootMap";
import { TextWithTerms } from "./TextWithTerms";
import { Icon } from "./Icon";

const HEADING_ID = "troubleshoot-map-heading";

const causeSlug: Record<CauseSide, string> = {
  クライアント: "client",
  ネットワーク: "network",
  サーバ: "server",
};

/** 検索用に、コードスパンの記号と全角半角・大小文字の違いを潰す */
function normalize(value: string): string {
  return value.replaceAll("`", "").normalize("NFKC").toLowerCase();
}

type Hit = { groupId: string; groupLabel: string; index: number; leaf: MapLeaf };

const allLeaves: Hit[] = troubleshootMap.flatMap((group) =>
  group.leaves.map((leaf, index) => ({ groupId: group.id, groupLabel: group.label, index, leaf })),
);

/** 症状そのものだけでなく、確認することや分かることの語、非表示の keywords でも引けるようにする */
const searchText = new Map<MapLeaf, string>(
  allLeaves.map(({ groupLabel, leaf }) => [
    leaf,
    normalize([groupLabel, leaf.symptom, leaf.check, leaf.tells, ...leaf.cause, ...(leaf.keywords ?? [])].join("\n")),
  ]),
);

function CauseChips({ cause }: { cause: CauseSide[] }) {
  return (
    <span className="troubleshoot-map-causes">
      {cause.map((side) => (
        <span key={side} className={`troubleshoot-map-cause-chip cause-${causeSlug[side]}`}>
          {side}
        </span>
      ))}
    </span>
  );
}

export function TroubleshootMap() {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [leafIndex, setLeafIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const searchId = useId();
  const group = troubleshootMap.find((g) => g.id === groupId) ?? null;
  const leaf = group && leafIndex !== null ? (group.leaves[leafIndex] ?? null) : null;
  const trimmed = query.trim();

  const hits = useMemo(() => {
    const needle = normalize(trimmed);
    if (!needle) return [];
    return allLeaves.filter((hit) => searchText.get(hit.leaf)?.includes(needle));
  }, [trimmed]);

  // 絞り込み中は、グループを選んでいなくても症状へ直接進める
  const searching = trimmed !== "" && !leaf;

  const viewRef = useRef<HTMLDivElement>(null);
  // 戻るを押したとき、焦点を返すボタンの data-node
  const restoreNode = useRef<string | null>(null);
  const firstRender = useRef(true);
  // 検索結果から開いたか（あとで検索欄を消しても、戻り先の判定をそのときの入力に左右されないようにする）
  const viaSearch = useRef(false);

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
  // その症状のグループの、症状一覧まで戻す（パンくずの分類チップ用）。検索欄に文字が残っていると
  // searching が優先されグループの一覧に留まれないため、検索も一緒に消す
  const goToGroupSymptoms = () => {
    restoreNode.current = leafIndex === null ? null : String(leafIndex);
    setLeafIndex(null);
    setQuery("");
  };
  const backFromLeaf = () => {
    if (viaSearch.current) {
      // 「戻る」ボタン用の戻り先。検索欄を消していたら、結果ではなく画面の様子の一覧まで戻す
      restoreNode.current = trimmed !== "" ? `${groupId}-${leafIndex}` : groupId;
      setGroupId(null);
      setLeafIndex(null);
      return;
    }
    goToGroupSymptoms();
  };

  const openLeafFromSearch = (nextGroupId: string, index: number) => {
    viaSearch.current = true;
    setGroupId(nextGroupId);
    setLeafIndex(index);
  };

  const openLeafFromGroup = (index: number) => {
    viaSearch.current = false;
    setLeafIndex(index);
  };

  const heading = leaf
    ? "その症状は、こう当たりをつけます"
    : searching
      ? `「${trimmed}」に当てはまる症状`
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
        <div className="troubleshoot-map-search">
          <label className="sr-only" htmlFor={searchId}>
            症状のことばで絞り込む
          </label>
          <Icon name="search" size={14} />
          <input
            id={searchId}
            type="search"
            value={query}
            placeholder="ことばで絞り込む（例: 遅い、メール、404）"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      {group && !searching ? (
        <p className="troubleshoot-map-trail">
          <button type="button" onClick={backToGroups}>
            画面の様子
          </button>
          <Icon name="arrow-right" size={12} />
          {leaf ? (
            <button type="button" onClick={goToGroupSymptoms}>
              {group.label}
            </button>
          ) : (
            <span className="troubleshoot-map-trail-current">{group.label}</span>
          )}
        </p>
      ) : null}

      <div className="troubleshoot-map-view" ref={viewRef} tabIndex={-1} role="group" aria-labelledby={HEADING_ID}>
        {!group && !searching ? (
          <div className="troubleshoot-map-grid">
            {troubleshootMap.map((g) => (
              <button
                key={g.id}
                type="button"
                data-node={g.id}
                className="troubleshoot-map-node"
                onClick={() => setGroupId(g.id)}
              >
                <span className="troubleshoot-map-node-label">{g.label}</span>
                <span className="troubleshoot-map-node-count">{g.leaves.length} 件の症状</span>
              </button>
            ))}
          </div>
        ) : null}

        {searching ? (
          <div className="troubleshoot-map-grid">
            {hits.length === 0 ? (
              <p className="troubleshoot-map-empty">
                当てはまる症状がありません。別のことばで探すか、絞り込みを消して画面の様子から選びましょう。
              </p>
            ) : (
              hits.map((hit) => (
                <button
                  key={`${hit.groupId}-${hit.index}`}
                  type="button"
                  data-node={`${hit.groupId}-${hit.index}`}
                  className="troubleshoot-map-node"
                  onClick={() => openLeafFromSearch(hit.groupId, hit.index)}
                >
                  <span className="troubleshoot-map-node-group">{hit.groupLabel}</span>
                  <span className="troubleshoot-map-node-label">
                    <TextWithTerms text={hit.leaf.symptom} highlight={false} />
                  </span>
                  <CauseChips cause={hit.leaf.cause} />
                </button>
              ))
            )}
          </div>
        ) : null}

        {group && !leaf && !searching ? (
          <div className="troubleshoot-map-grid">
            {group.leaves.map((item, index) => (
              <button
                key={item.symptom}
                type="button"
                data-node={String(index)}
                className="troubleshoot-map-node"
                onClick={() => openLeafFromGroup(index)}
              >
                <span className="troubleshoot-map-node-label">
                  <TextWithTerms text={item.symptom} highlight={false} />
                </span>
                <CauseChips cause={item.cause} />
              </button>
            ))}
          </div>
        ) : null}

        {leaf ? (
          <div className="troubleshoot-map-result">
            <button type="button" className="troubleshoot-map-back" onClick={backFromLeaf}>
              <Icon name="arrow-left" size={14} />
              {viaSearch.current
                ? trimmed !== ""
                  ? "絞り込みの結果に戻る"
                  : "画面の様子の一覧に戻る"
                : "症状の一覧に戻る"}
            </button>
            <p className="troubleshoot-map-symptom">
              <TextWithTerms text={leaf.symptom} highlight={false} />
            </p>
            <p className="troubleshoot-map-cause">
              原因の当たり：
              <CauseChips cause={leaf.cause} />
              <span className="troubleshoot-map-cause-note">
                {leaf.causeNote ?? leaf.cause.map((side) => causeHints[side]).join("／")}
              </span>
            </p>
            <div className="troubleshoot-map-check">
              <p className="troubleshoot-map-label">最初に確認すること</p>
              <p>
                <TextWithTerms text={leaf.check} />
              </p>
            </div>
            <div className="troubleshoot-map-tells">
              <p className="troubleshoot-map-label">それで分かること</p>
              <p>
                <TextWithTerms text={leaf.tells} />
              </p>
            </div>
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
