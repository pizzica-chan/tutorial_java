import { Link } from "react-router-dom";

export function NotFoundPage({
  title = "ページが見つかりません",
  lead = "アドレスが違うか、古いリンクの可能性があります。",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <div className="content">
      <p className="kicker">404</p>
      <h1 className="serif" style={{ fontSize: 42, marginTop: 8 }}>
        {title}
      </h1>
      <p className="lede">{lead}</p>
      <p>
        <Link className="btn btn-primary" to="/">
          トップへ戻る
        </Link>
      </p>
    </div>
  );
}
