import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { glossary, glossaryAnchor } from "../data/terms";
import { TextWithTerms } from "../components/TextWithTerms";

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
    <div className="content">
      <p className="kicker">GLOSSARY</p>
      <h1 className="serif page-title">用語集</h1>
      <p className="lede">
        本文の点線の語は、ホバーで説明が出ます。初出は Tab でも説明が出ます。クリックやタップでこの用語集の該当項目へ飛びます。
      </p>
      <dl className="glossary">
        {glossary.map((item) => (
          <div key={item.term} id={glossaryAnchor(item.term)} tabIndex={-1}>
            <dt>{item.term}</dt>
            <dd>
              <TextWithTerms highlight={false} text={item.body} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
