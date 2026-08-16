import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { glossary, glossaryAnchor } from "../data/terms";

export function GlossaryPage() {
  const location = useLocation();

  useEffect(() => {
    const id = location.hash.replace(/^#/, "");
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, [location.hash]);

  return (
    <div className="content">
      <p className="kicker">GLOSSARY</p>
      <h1 className="serif" style={{ fontSize: 42 }}>用語集</h1>
      <p className="lede">
        本文の点線の語は、ホバーやキーボードフォーカスで説明が出ます。タップやクリックでこの用語集の該当項目へ飛びます。
      </p>
      <dl className="glossary">
        {glossary.map((item) => (
          <div key={item.term} id={glossaryAnchor(item.term)}>
            <dt>{item.term}</dt>
            <dd>{item.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
