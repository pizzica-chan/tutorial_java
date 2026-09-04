import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { glossaryAnchor, glossaryGroups } from "../data/terms";
import { TextWithTerms } from "../components/TextWithTerms";
import { GlossaryIndex } from "../components/GlossaryIndex";

export function GlossaryPage() {
  const location = useLocation();

  useEffect(() => {
    const id = location.hash.replace(/^#/, "");
    if (!id) return;
    const item = document.getElementById(id);
    if (!item) return;
    item.focus({ preventScroll: true });
    item.scrollIntoView({ block: "start" });
  }, [location.hash]);

  return (
    <div className="lesson-layout">
      <div className="content">
        <p className="kicker">GLOSSARY</p>
        <h1 className="serif page-title">用語集</h1>
        <p className="lede">
          本文の点線の語は、ホバーで説明が出ます。初出は Tab でも説明が出ます。クリックやタップでこの用語集の該当項目へ飛びます。
        </p>
        {glossaryGroups.map((group) => (
          <section key={group.key}>
            <h2 className="serif" id={`idx-${group.key}`}>
              {group.label}
            </h2>
            <dl className="glossary">
              {group.items.map((item) => (
                <div key={item.term} id={glossaryAnchor(item.term)} tabIndex={-1}>
                  <dt>{item.term}</dt>
                  <dd>
                    <TextWithTerms highlight={false} text={item.body} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      <GlossaryIndex groups={glossaryGroups} />
    </div>
  );
}
